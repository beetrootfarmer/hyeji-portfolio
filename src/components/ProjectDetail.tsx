import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/types';
import { useLocale } from '../i18n/LocaleContext';
import { SpiralMark } from './SpiralMark';
import './ProjectDetail.css';

const text = {
  en: {
    close: 'Close project detail',
    dragHint: '← Drag to see more →',
    problem: 'Problem',
    solution: 'Solution',
    result: 'Result',
    liveSite: 'Live site ↗',
    source: 'Source ↗',
  },
  ko: {
    close: '프로젝트 상세 닫기',
    dragHint: '← 드래그해서 더 보기 →',
    problem: '문제',
    solution: '해결',
    result: '결과',
    liveSite: '라이브 사이트 ↗',
    source: '소스 코드 ↗',
  },
} as const;

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const { locale } = useLocale();
  const t = text[locale];
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="project-detail-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="project-detail"
        layoutId={`card-${project.slug}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="project-detail-close"
          data-cursor-hover
          onClick={onClose}
          aria-label={t.close}
        >
          ×
        </button>

        <motion.div className="project-detail-gallery" ref={galleryRef} data-cursor-hover>
          <motion.div
            className="project-detail-gallery-track"
            drag={project.images.length > 1 ? 'x' : false}
            dragConstraints={galleryRef}
            dragElastic={0.08}
          >
            {project.images.map((image, index) => (
              <motion.img
                key={image.src}
                src={image.src}
                alt={image.alt}
                draggable={false}
                layoutId={index === 0 ? `image-${project.slug}` : undefined}
              />
            ))}
          </motion.div>
        </motion.div>

        {project.images.length > 1 && (
          <span className="project-detail-gallery-hint">{t.dragHint}</span>
        )}

        <motion.div
          className="project-detail-body"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <div className="project-detail-heading">
            <span className="eyebrow">
              {project.role} · {project.year}
            </span>
            <h2>{project.title}</h2>
          </div>

          <p className="project-detail-text">{project.description}</p>

          <ul className="project-detail-tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          {project.problems && (
            <div className="project-detail-problems">
              {project.problems.map((item, index) => (
                <div className="project-detail-problem" key={item.title}>
                  <div className="project-detail-problem-heading">
                    <SpiralMark
                      className="project-detail-problem-mark"
                      size={26}
                      turns={2.2 + index * 0.7}
                    />
                    <h3 className="project-detail-problem-title">{item.title}</h3>
                  </div>

                  <div className="project-detail-problem-row">
                    <span className="project-detail-problem-label">{t.problem}</span>
                    <p>{item.problem}</p>
                  </div>
                  <div className="project-detail-problem-row">
                    <span className="project-detail-problem-label">{t.solution}</span>
                    <p>{item.solution}</p>
                  </div>
                  <div className="project-detail-problem-row">
                    <span className="project-detail-problem-label">{t.result}</span>
                    <p>{item.result}</p>
                  </div>

                  {item.code && (
                    <div className="project-detail-code">
                      <span className="project-detail-code-label">{item.code.label}</span>
                      <pre>
                        <code>{item.code.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {project.code && (
            <div className="project-detail-code">
              <span className="project-detail-code-label">{project.code.label}</span>
              <pre>
                <code>{project.code.code}</code>
              </pre>
            </div>
          )}

          {(project.liveUrl || project.repoUrl) && (
            <div className="project-detail-links">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" data-cursor-hover>
                  {t.liveSite}
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" data-cursor-hover>
                  {t.source}
                </a>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
