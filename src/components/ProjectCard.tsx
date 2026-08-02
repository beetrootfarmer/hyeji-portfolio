import { motion } from 'framer-motion';
import type { Project } from '../data/types';
import { useLocale } from '../i18n/LocaleContext';
import './ProjectCard.css';

const text = {
  en: { appStore: 'View on App Store ↗' },
  ko: { appStore: '앱스토어에서 보기 ↗' },
} as const;

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (slug: string) => void;
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const { locale } = useLocale();
  const t = text[locale];

  return (
    <motion.div
      className="project-card"
      role="button"
      tabIndex={0}
      data-cursor-hover
      onClick={() => onOpen(project.slug)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(project.slug);
        }
      }}
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
      {project.award && <span className="project-card-award">{project.award}</span>}
      <div className="project-card-footer">
        <ul className="project-card-tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {project.liveUrl && (
          <a
            className="project-card-link"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            onClick={(event) => event.stopPropagation()}
          >
            {t.appStore}
          </a>
        )}
      </div>
    </motion.div>
  );
}
