export interface MindmapLink {
  label: string;
  url: string;
}

export interface MindmapNodeDetail {
  period?: string;
  summary: string;
  bullets?: string[];
  links?: MindmapLink[];
  images?: string[];
}

export interface MindmapNode {
  id: string;
  label: string;
  type: 'root' | 'career' | 'project' | 'skill' | 'education';
  depth: 0 | 1 | 2;
  tags: string[];
  detail?: MindmapNodeDetail;
}

export interface MindmapEdge {
  source: string;
  target: string;
  kind: 'hierarchy' | 'relation';
}

export interface MindmapData {
  nodes: MindmapNode[];
  links: MindmapEdge[];
}
