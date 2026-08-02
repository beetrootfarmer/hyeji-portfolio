import { motion } from 'framer-motion';
import type { Project } from '../data/types';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (slug: string) => void;
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  return (
    <motion.button
      type="button"
      className="project-card"
      data-cursor-hover
      onClick={() => onOpen(project.slug)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      layoutId={`card-${project.slug}`}
    >
      <div className="project-card-media">
        <motion.img
          src={project.thumbnail}
          alt={`${project.title} logo`}
          layoutId={`thumbnail-${project.slug}`}
        />
      </div>
      <div className="project-card-meta">
        <span className="project-card-index">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="project-card-title">{project.title}</h3>
        <span className="project-card-year">{project.year}</span>
      </div>
      <p className="project-card-summary">{project.summary}</p>
      <ul className="project-card-tags">
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </motion.button>
  );
}
