import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { getMindmapData } from '../../data/mindmap';
import type { MindmapNode } from '../../data/mindmap/types';
import { useLocale } from '../../i18n/LocaleContext';
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
  skill: 8,
};

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

  const [nodes, setNodes] = useState<SimNode[]>([]);
  const [links, setLinks] = useState<SimLink[]>([]);
  const [dimensions, setDimensions] = useState({ width: 960, height: 640 });

  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current;

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

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

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

    setNodes(simNodes);
    setLinks(simLinks);
  }, [locale, dimensions.width, dimensions.height]);

  // Run the force simulation. Position only — visuals are handled by CSS/Framer.
  useEffect(() => {
    if (nodes.length === 0) return;
    const { width, height } = dimensions;

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
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
        d3.forceCollide<SimNode>().radius((d) => radiusFor(d) + 26),
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
    return () => {
      simulation.stop();
    };
  }, [nodes, links, dimensions, prefersReducedMotion]);

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
        })
        .on('drag', (event) => {
          n.fx = event.x;
          n.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) simulation.alphaTarget(0);
          n.pinned = true;
          el.setAttribute('data-pinned', 'true');
        });

      d3.select(el).call(drag).on('dblclick', (event) => {
        event.stopPropagation();
        n.fx = null;
        n.fy = null;
        n.pinned = false;
        el.setAttribute('data-pinned', 'false');
        simulation.alpha(0.3).restart();
      });
    });
  }, [nodes]);

  // Entry stagger: depth 0 immediate, depth 1 spread evenly so the whole
  // reveal stays under ~1s regardless of how many depth-1 nodes exist.
  const depth1Count = nodes.filter((n) => n.depth === 1).length;
  const stagger = Math.min(0.08, 0.9 / Math.max(depth1Count, 1));
  let depth1Index = 0;

  return (
    <div className="mindmap-view" ref={containerRef}>
      <svg ref={svgRef} width="100%" height="100%" className="mindmap-svg">
        <g ref={zoomGroupRef}>
          <g className="mindmap-links">
            {links.map((l) => (
              <line
                key={`${l.sourceId}->${l.targetId}`}
                ref={(el) => {
                  if (el) linkElRefs.current.set(`${l.sourceId}->${l.targetId}`, el);
                  else linkElRefs.current.delete(`${l.sourceId}->${l.targetId}`);
                }}
                className={`mindmap-link mindmap-link-${l.kind}`}
              />
            ))}
          </g>
          <g className="mindmap-nodes">
            <AnimatePresence>
              {nodes.map((n) => {
                const delay = n.depth === 0 ? 0 : depth1Index++ * stagger;
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
                      className={`mindmap-node mindmap-node-${n.type}`}
                      data-depth={n.depth}
                      data-cursor-hover
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.3 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.4, delay, ease: [0.34, 1.3, 0.64, 1] }
                      }
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 1.12 }}
                    >
                      <circle r={radiusFor(n)} />
                      <text dy={radiusFor(n) + 12}>{n.label}</text>
                    </motion.g>
                  </g>
                );
              })}
            </AnimatePresence>
          </g>
        </g>
      </svg>
    </div>
  );
}
