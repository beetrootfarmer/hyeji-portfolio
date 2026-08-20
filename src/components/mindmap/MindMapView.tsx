import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { getMindmapData } from '../../data/mindmap';
import type { MindmapNode } from '../../data/mindmap/types';
import { useLocale } from '../../i18n/LocaleContext';
import { MindMapSidePanel } from './MindMapSidePanel';
import { MindMapSearchBar } from './MindMapSearchBar';
import { MindMapLegend } from './MindMapLegend';
import './MindMapView.css';

interface SimNode extends MindmapNode, d3.SimulationNodeDatum {
  pinned?: boolean;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  sourceId: string;
  targetId: string;
  kind: 'hierarchy' | 'relation';
}

const RADIUS: Record<MindmapNode['type'], number> = {
  root: 30,
  career: 18,
  project: 18,
  education: 16,
  skill: 6,
};

const PANEL_WIDTH = 380;
const ZOOM_TO_NODE_SCALE = 1.4;

function radiusFor(node: Pick<MindmapNode, 'type' | 'depth'>): number {
  if (node.depth === 2) return 12;
  return RADIUS[node.type];
}

function nodeOf(end: string | SimNode | number): SimNode | null {
  return typeof end === 'object' ? end : null;
}

export function MindMapView() {
  const { locale } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomGroupRef = useRef<SVGGElement>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const nodeElRefs = useRef<Map<string, SVGGElement>>(new Map());
  const linkElRefs = useRef<Map<string, SVGLineElement>>(new Map());
  const dimensionsRef = useRef({ width: 960, height: 640 });
  const simAlphaRef = useRef(1);

  const [nodes, setNodes] = useState<SimNode[]>([]);
  const [links, setLinks] = useState<SimLink[]>([]);
  const [dimensions, setDimensions] = useState({ width: 960, height: 640 });
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [enteringLinkKeys, setEnteringLinkKeys] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [keyboardFocusId, setKeyboardFocusId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [showTags, setShowTags] = useState(false);
  const [pulsingIds, setPulsingIds] = useState<Set<string>>(new Set());
  const [showRelations, setShowRelations] = useState(false);
  const prevMatchedRef = useRef<Set<string>>(new Set());

  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current;

  const fullData = useMemo(() => getMindmapData(locale), [locale]);

  // Which depth-1 nodes have depth-2 children, and what those children's ids are.
  const childrenMap = useMemo(() => {
    const map = new Map<string, string[]>();
    const depth2Ids = new Set(fullData.nodes.filter((n) => n.depth === 2).map((n) => n.id));
    fullData.links.forEach((l) => {
      if (l.kind === 'hierarchy' && depth2Ids.has(l.target)) {
        const list = map.get(l.source) ?? [];
        list.push(l.target);
        map.set(l.source, list);
      }
    });
    return map;
  }, [fullData]);

  const selectedNodeData = selectedId ? fullData.nodes.find((n) => n.id === selectedId) ?? null : null;

  const allTags = useMemo(() => {
    const set = new Set<string>();
    fullData.nodes.forEach((n) => n.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [fullData]);

  // Which node ids should stay at full opacity while something is selected
  // (the selection itself, plus everything directly linked to it).
  const focusedIds = useMemo(() => {
    if (!selectedId) return null;
    const set = new Set<string>([selectedId]);
    links.forEach((l) => {
      if (l.sourceId === selectedId) set.add(l.targetId);
      if (l.targetId === selectedId) set.add(l.sourceId);
    });
    return set;
  }, [selectedId, links]);

  // Search/tag filter matches among currently-rendered nodes (collapsed
  // depth-2 case studies are excluded — they only exist once expanded).
  const matchedIdSet = useMemo(() => {
    if (debouncedQuery === '' && activeTags.size === 0) return null;
    const set = new Set<string>();
    nodes.forEach((n) => {
      const textMatch =
        debouncedQuery !== '' &&
        (n.label.toLowerCase().includes(debouncedQuery) || n.tags.some((tag) => tag.toLowerCase().includes(debouncedQuery)));
      const tagMatch = activeTags.size > 0 && n.tags.some((tag) => activeTags.has(tag));
      if (textMatch || tagMatch) set.add(n.id);
    });
    return set;
  }, [nodes, debouncedQuery, activeTags]);

  const filterActive = debouncedQuery !== '' || activeTags.size > 0;
  // Selection spotlight takes priority; search/tag filter spotlight otherwise.
  const effectiveFocusIds = focusedIds ?? matchedIdSet;

  useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchInput.trim().toLowerCase()), 200);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  // Search/tag filter and node-selection spotlights are mutually exclusive.
  useEffect(() => {
    if (filterActive) setSelectedId(null);
  }, [filterActive]);

  // Pulse newly-matched nodes once, and pan/fit the camera to the match set.
  useEffect(() => {
    if (!matchedIdSet) {
      prevMatchedRef.current = new Set();
      setPulsingIds(new Set());
      return;
    }
    const newlyMatched = [...matchedIdSet].filter((id) => !prevMatchedRef.current.has(id));
    prevMatchedRef.current = matchedIdSet;

    if (!prefersReducedMotion && newlyMatched.length > 0) {
      setPulsingIds((prev) => new Set([...prev, ...newlyMatched]));
      window.setTimeout(() => {
        setPulsingIds((prev) => {
          const next = new Set(prev);
          newlyMatched.forEach((id) => next.delete(id));
          return next;
        });
      }, 600);
    }

    if (matchedIdSet.size > 0) fitToMatches(matchedIdSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedIdSet]);

  // Measure the container so the graph fills its space and re-centers on resize.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build the base graph (depth 0 + 1 only — depth 2 case studies spawn on expand).
  useEffect(() => {
    const data = getMindmapData(locale);
    const baseNodes = data.nodes.filter((n) => n.depth <= 1);
    const baseIds = new Set(baseNodes.map((n) => n.id));
    const baseLinks = data.links.filter((l) => baseIds.has(l.source) && baseIds.has(l.target));

    const { width, height } = dimensionsRef.current;
    const cx = width / 2;
    const cy = height / 2;

    const simNodes: SimNode[] = baseNodes.map((n) => ({
      ...n,
      x: cx + (Math.random() - 0.5) * 4,
      y: cy + (Math.random() - 0.5) * 4,
    }));

    const root = simNodes.find((n) => n.type === 'root');
    if (root) {
      root.fx = cx;
      root.fy = cy;
    }

    const simLinks: SimLink[] = baseLinks.map((l) => ({
      source: l.source,
      target: l.target,
      sourceId: l.source,
      targetId: l.target,
      kind: l.kind,
    }));

    simAlphaRef.current = 1;
    setNodes(simNodes);
    setLinks(simLinks);
    setExpandedIds(new Set());
    setSelectedId(null);
    setKeyboardFocusId(null);
    setSearchInput('');
    setActiveTags(new Set());
  }, [locale]);

  // Run the force simulation. Position only — visuals are handled by CSS/Framer.
  useEffect(() => {
    if (nodes.length === 0) return;
    const { width, height } = dimensionsRef.current;

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .alpha(simAlphaRef.current)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((l) => (l.kind === 'hierarchy' ? 120 : 190))
          .strength((l) => (l.kind === 'hierarchy' ? 0.9 : 0.1)),
      )
      .force('charge', d3.forceManyBody().strength(-650))
      .force(
        'collide',
        d3.forceCollide<SimNode>().radius((d) => radiusFor(d) + 20),
      )
      .force('x', d3.forceX(width / 2).strength(0.015))
      .force('y', d3.forceY(height / 2).strength(0.015));

    function applyPositions() {
      nodes.forEach((n) => {
        const el = nodeElRefs.current.get(n.id);
        if (el && n.x != null && n.y != null) {
          el.setAttribute('transform', `translate(${n.x},${n.y})`);
        }
      });
      links.forEach((l) => {
        const el = linkElRefs.current.get(`${l.sourceId}->${l.targetId}`);
        if (!el) return;
        const s = nodeOf(l.source);
        const t = nodeOf(l.target);
        if (s?.x != null && s.y != null) {
          el.setAttribute('x1', String(s.x));
          el.setAttribute('y1', String(s.y));
        }
        if (t?.x != null && t.y != null) {
          el.setAttribute('x2', String(t.x));
          el.setAttribute('y2', String(t.y));
        }
      });
    }

    if (prefersReducedMotion) {
      simulation.stop();
      for (let i = 0; i < 300; i += 1) simulation.tick();
      applyPositions();
    } else {
      simulation.on('tick', applyPositions);
    }

    simulationRef.current = simulation;
    simAlphaRef.current = 0.5; // subsequent rebuilds (expand/collapse) are gentler
    return () => {
      simulation.stop();
    };
  }, [nodes, links, prefersReducedMotion]);

  // Resize: nudge the existing simulation's center instead of rebuilding nodes.
  useEffect(() => {
    const simulation = simulationRef.current;
    if (!simulation) return;
    const { width, height } = dimensions;
    simulation.force('x', d3.forceX<SimNode>(width / 2).strength(0.015));
    simulation.force('y', d3.forceY<SimNode>(height / 2).strength(0.015));
    const root = nodes.find((n) => n.type === 'root');
    if (root) {
      root.fx = width / 2;
      root.fy = height / 2;
    }
    simulation.alpha(0.3).restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.width, dimensions.height]);

  // Pan/zoom.
  useEffect(() => {
    if (!svgRef.current || !zoomGroupRef.current) return;
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        zoomGroupRef.current?.setAttribute('transform', event.transform.toString());
      });
    d3.select(svgRef.current).call(zoom);
    zoomRef.current = zoom;
  }, []);

  // Drag-to-pin. Re-bound whenever the node set changes.
  useEffect(() => {
    const simulation = simulationRef.current;
    if (!simulation) return;

    nodes.forEach((n) => {
      const el = nodeElRefs.current.get(n.id);
      if (!el) return;

      const drag = d3
        .drag<SVGGElement, unknown>()
        .on('start', (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          n.fx = n.x;
          n.fy = n.y;
          el.querySelector('.mindmap-node')?.classList.add('is-dragging');
        })
        .on('drag', (event) => {
          n.fx = event.x;
          n.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) simulation.alphaTarget(0);
          n.pinned = true;
          el.querySelector('.mindmap-node')?.classList.remove('is-dragging');
          // Pinning shows the dashed stroke immediately; unpinning (dblclick,
          // below) animates it back via the circle's normal CSS transition.
          const circle = el.querySelector('circle');
          if (circle instanceof SVGElement) {
            circle.style.transition = 'none';
            el.setAttribute('data-pinned', 'true');
            void circle.getBoundingClientRect();
            circle.style.transition = '';
          } else {
            el.setAttribute('data-pinned', 'true');
          }
        });

      d3.select(el)
        .call(drag)
        .on('dblclick', (event) => {
          event.stopPropagation();
          n.fx = null;
          n.fy = null;
          n.pinned = false;
          el.setAttribute('data-pinned', 'false');
          simulation.alpha(0.3).restart();
        });
    });
  }, [nodes]);

  function panToNode(node: SimNode) {
    const zoom = zoomRef.current;
    if (!svgRef.current || !zoom || node.x == null || node.y == null) return;
    const { width, height } = dimensionsRef.current;
    const visibleCenterX = (width - PANEL_WIDTH) / 2;
    const centerY = height / 2;
    const transform = d3.zoomIdentity
      .translate(visibleCenterX - node.x * ZOOM_TO_NODE_SCALE, centerY - node.y * ZOOM_TO_NODE_SCALE)
      .scale(ZOOM_TO_NODE_SCALE);
    if (prefersReducedMotion) {
      d3.select(svgRef.current).call(zoom.transform, transform);
    } else {
      d3.select(svgRef.current).transition().duration(700).ease(d3.easeCubicInOut).call(zoom.transform, transform);
    }
  }

  // Single search/tag match: center it (no panel offset — the panel is
  // closed while a filter is active). Multiple matches: fit them all in view.
  function fitToMatches(ids: Set<string>) {
    const zoom = zoomRef.current;
    if (!svgRef.current || !zoom) return;
    const matched = nodes.filter((n) => ids.has(n.id) && n.x != null && n.y != null);
    if (matched.length === 0) return;

    const { width, height } = dimensionsRef.current;
    let transform: d3.ZoomTransform;

    if (matched.length === 1) {
      const node = matched[0];
      transform = d3.zoomIdentity
        .translate(width / 2 - node.x! * ZOOM_TO_NODE_SCALE, height / 2 - node.y! * ZOOM_TO_NODE_SCALE)
        .scale(ZOOM_TO_NODE_SCALE);
    } else {
      const xs = matched.map((n) => n.x!);
      const ys = matched.map((n) => n.y!);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const pad = 100;
      const boxW = Math.max(maxX - minX, 1) + pad * 2;
      const boxH = Math.max(maxY - minY, 1) + pad * 2;
      const scale = Math.min(2, Math.max(0.3, Math.min(width / boxW, height / boxH)));
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      transform = d3.zoomIdentity.translate(width / 2 - cx * scale, height / 2 - cy * scale).scale(scale);
    }

    if (prefersReducedMotion) {
      d3.select(svgRef.current).call(zoom.transform, transform);
    } else {
      d3.select(svgRef.current).transition().duration(700).ease(d3.easeCubicInOut).call(zoom.transform, transform);
    }
  }

  function expandNode(parentId: string) {
    const parent = nodes.find((n) => n.id === parentId);
    const childIds = new Set(childrenMap.get(parentId) ?? []);
    if (!parent || parent.x == null || parent.y == null || childIds.size === 0) return;

    const newChildren: SimNode[] = fullData.nodes
      .filter((n) => childIds.has(n.id))
      .map((n) => ({
        ...n,
        x: parent.x! + (Math.random() - 0.5) * 10,
        y: parent.y! + (Math.random() - 0.5) * 10,
      }));

    const presentIds = new Set([...nodes.map((n) => n.id), ...newChildren.map((n) => n.id)]);
    const newLinks: SimLink[] = fullData.links
      .filter((l) => (childIds.has(l.source) || childIds.has(l.target)) && presentIds.has(l.source) && presentIds.has(l.target))
      .map((l) => ({ source: l.source, target: l.target, sourceId: l.source, targetId: l.target, kind: l.kind }));

    const newLinkKeys = newLinks.map((l) => `${l.sourceId}->${l.targetId}`);

    simAlphaRef.current = 0.5;
    setNodes((prev) => [...prev, ...newChildren]);
    setLinks((prev) => [...prev, ...newLinks]);
    setExpandedIds((prev) => new Set(prev).add(parentId));
    setEnteringLinkKeys((prev) => new Set([...prev, ...newLinkKeys]));

    // Links stay invisible for ~100ms after their node appears, then fade in
    // via the CSS transition on .mindmap-link once this class is dropped.
    window.setTimeout(() => {
      setEnteringLinkKeys((prev) => {
        const next = new Set(prev);
        newLinkKeys.forEach((k) => next.delete(k));
        return next;
      });
    }, 100);
  }

  function collapseNode(parentId: string) {
    const childIds = new Set(childrenMap.get(parentId) ?? []);
    simAlphaRef.current = 0.5;
    setNodes((prev) => prev.filter((n) => !childIds.has(n.id)));
    setLinks((prev) => prev.filter((l) => !childIds.has(l.sourceId) && !childIds.has(l.targetId)));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(parentId);
      return next;
    });
    setSelectedId((current) => (current && childIds.has(current) ? null : current));
    setKeyboardFocusId((current) => (current && childIds.has(current) ? null : current));
  }

  function handleNodeClick(n: SimNode) {
    setSearchInput('');
    setActiveTags(new Set());
    setSelectedId(n.id);
    setKeyboardFocusId(n.id);
    panToNode(n);
    if (childrenMap.has(n.id)) {
      if (expandedIds.has(n.id)) collapseNode(n.id);
      else expandNode(n.id);
    }
  }

  function closePanel() {
    setSelectedId(null);
  }

  // Spatial arrow-key traversal: from the current keyboard focus, jump to the
  // closest node lying within a 60°-wide cone around the pressed direction.
  function moveKeyboardFocus(dx: number, dy: number) {
    const current =
      nodes.find((n) => n.id === keyboardFocusId) ?? nodes.find((n) => n.type === 'root') ?? nodes[0];
    if (!current || current.x == null || current.y == null) return;
    const cx = current.x;
    const cy = current.y;

    let best: SimNode | null = null;
    let bestScore = Infinity;
    nodes.forEach((n) => {
      if (n.id === current.id || n.x == null || n.y == null) return;
      const vx = n.x - cx;
      const vy = n.y - cy;
      const dist = Math.hypot(vx, vy);
      if (dist === 0) return;
      const dot = (vx * dx + vy * dy) / dist;
      if (dot <= 0.5) return; // outside the ~60° direction cone
      const score = dist / dot;
      if (score < bestScore) {
        bestScore = score;
        best = n;
      }
    });

    if (best) {
      setKeyboardFocusId((best as SimNode).id);
      panToNode(best as SimNode);
    } else if (!keyboardFocusId) {
      setKeyboardFocusId(current.id);
      panToNode(current);
    }
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function clearFilter() {
    setSearchInput('');
    setActiveTags(new Set());
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closePanel();
        setKeyboardFocusId(null);
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          moveKeyboardFocus(1, 0);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          moveKeyboardFocus(-1, 0);
          break;
        case 'ArrowUp':
          event.preventDefault();
          moveKeyboardFocus(0, -1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          moveKeyboardFocus(0, 1);
          break;
        case 'Enter': {
          const n = nodes.find((node) => node.id === keyboardFocusId);
          if (n) handleNodeClick(n);
          break;
        }
        default:
          break;
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nodes, keyboardFocusId]);

  // Entry stagger: depth 0 immediate, depth 1 spread evenly so the whole
  // reveal stays under ~1s regardless of how many depth-1 nodes exist.
  const depth1Count = nodes.filter((n) => n.depth === 1).length;
  const stagger = Math.min(0.08, 0.9 / Math.max(depth1Count, 1));
  let depth1Index = 0;

  return (
    <div className="mindmap-view" ref={containerRef}>
      <MindMapSearchBar
        value={searchInput}
        onChange={setSearchInput}
        allTags={allTags}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        showTags={showTags}
        onToggleShowTags={() => setShowTags((v) => !v)}
        onClear={clearFilter}
        hasFilter={filterActive}
      />
      <MindMapLegend showRelations={showRelations} onToggleRelations={() => setShowRelations((v) => !v)} />
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="mindmap-svg"
        onClick={() => closePanel()}
      >
        <g ref={zoomGroupRef}>
          <g className="mindmap-links">
            {links.map((l) => {
              const key = `${l.sourceId}->${l.targetId}`;
              const isFocusedLink = selectedId !== null && (l.sourceId === selectedId || l.targetId === selectedId);
              const isFilterMatchLink =
                selectedId === null && matchedIdSet !== null && matchedIdSet.has(l.sourceId) && matchedIdSet.has(l.targetId);
              const isDimmedLink = selectedId !== null ? !isFocusedLink : matchedIdSet !== null ? !isFilterMatchLink : false;
              const isEntering = enteringLinkKeys.has(key);
              const isRelationHidden = l.kind === 'relation' && !showRelations && !isFocusedLink && !isFilterMatchLink;
              return (
                <line
                  key={key}
                  ref={(el) => {
                    if (el) linkElRefs.current.set(key, el);
                    else linkElRefs.current.delete(key);
                  }}
                  className={[
                    'mindmap-link',
                    `mindmap-link-${l.kind}`,
                    isDimmedLink ? 'is-dim' : '',
                    isFocusedLink || isFilterMatchLink ? 'is-focused' : '',
                    isRelationHidden ? 'is-relation-hidden' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={isEntering ? { opacity: 0 } : undefined}
                />
              );
            })}
          </g>
          <g className="mindmap-nodes">
            <AnimatePresence>
              {nodes.map((n) => {
                const isChild = n.depth === 2;
                const delay = n.depth === 0 ? 0 : depth1Index++ * stagger;
                const isSelected = n.id === selectedId;
                const isMatch = matchedIdSet !== null && matchedIdSet.has(n.id);
                const isPulsing = pulsingIds.has(n.id);
                const isKbdFocused = n.id === keyboardFocusId;
                const isDimmed = effectiveFocusIds !== null && !effectiveFocusIds.has(n.id);
                const dimFocusActive = effectiveFocusIds !== null;

                const transition = prefersReducedMotion
                  ? { duration: 0 }
                  : dimFocusActive
                    ? {
                        opacity: { duration: 0.14, ease: 'easeOut' as const },
                        scale: { duration: 0.22, ease: 'easeOut' as const },
                      }
                    : isChild
                      ? { duration: 0.28, ease: 'easeOut' as const }
                      : { duration: 0.4, delay, ease: [0.34, 1.3, 0.64, 1] as const };

                return (
                  <g
                    key={n.id}
                    ref={(el) => {
                      if (el) nodeElRefs.current.set(n.id, el);
                      else nodeElRefs.current.delete(n.id);
                    }}
                    className="mindmap-node-position"
                  >
                    <motion.g
                      className={`mindmap-node mindmap-node-${n.type}${isDimmed ? ' is-dim' : ''}${isSelected ? ' is-focused' : ''}${isMatch ? ' is-match' : ''}`}
                      data-depth={n.depth}
                      data-cursor-hover
                      onClick={(event) => {
                        event.stopPropagation();
                        handleNodeClick(n);
                      }}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0 }}
                      animate={{ opacity: isDimmed ? 0.15 : 1, scale: isSelected ? 1.15 : 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.3,
                        transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeIn' as const },
                      }}
                      transition={transition}
                      whileHover={{ scale: isSelected ? 1.15 : 1.08 }}
                      whileTap={{ scale: 1.12 }}
                    >
                      <circle r={radiusFor(n)} />
                      {isPulsing && <circle className="mindmap-pulse-ring" r={radiusFor(n)} />}
                      {isKbdFocused && <circle className="mindmap-kbd-ring" r={radiusFor(n) + 6} />}
                      <text dy={radiusFor(n) + 12}>{n.label}</text>
                    </motion.g>
                  </g>
                );
              })}
            </AnimatePresence>
          </g>
        </g>
      </svg>

      <AnimatePresence>
        {selectedNodeData && <MindMapSidePanel node={selectedNodeData} />}
      </AnimatePresence>
    </div>
  );
}
