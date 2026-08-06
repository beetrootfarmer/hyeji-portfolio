export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectCodeSnippet {
  label: string;
  language: string;
  code: string;
}

export interface ProjectProblem {
  title: string;
  problem: string;
  solution: string;
  result: string;
  code?: ProjectCodeSnippet;
}

export interface Project {
  slug: string;
  year: string;
  title: string;
  role: string;
  summary: string;
  description: string;
  award?: string;
  tags: string[];
  thumbnail?: string;
  images: ProjectImage[];
  problems?: ProjectProblem[];
  code?: ProjectCodeSnippet;
  liveUrl?: string;
  repoUrl?: string;
  /** Shown under a "show more" toggle instead of the main list. */
  more?: boolean;
}
