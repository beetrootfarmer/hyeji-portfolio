import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getProjects } from '../data/projects';
import { useLocale } from '../i18n/LocaleContext';
import { ProjectCard } from './ProjectCard';
import { ProjectDetail } from './ProjectDetail';
import './Projects.css';

const text = {
  en: {
    eyebrow: 'Selected work',
    heading: 'Projects',
    showMore: (n: number) => `Show ${n} more project${n === 1 ? '' : 's'}`,
    showLess: 'Show less',
  },
  ko: {
    eyebrow: '주요 작업',
    heading: '프로젝트',
    showMore: (n: number) => `프로젝트 ${n}개 더 보기`,
    showLess: '접기',
  },
} as const;

export function Projects() {
  const { locale } = useLocale();
  const projects = getProjects(locale);
  const mainProjects = projects.filter((project) => !project.more);
  const moreProjects = projects.filter((project) => project.more);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const openProject = projects.find((project) => project.slug === openSlug) ?? null;
  const t = text[locale];

  return (
    <section className="projects section" id="projects">
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
      >
        {t.eyebrow}
      </motion.p>

      <motion.h2
        className="projects-heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        {t.heading}
      </motion.h2>

      <div className="project-list">
        {mainProjects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} onOpen={setOpenSlug} />
        ))}
      </div>

      {moreProjects.length > 0 && (
        <>
          <AnimatePresence initial={false}>
            {showMore && (
              <motion.div
                className="project-list project-list-more"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                {moreProjects.map((project, index) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    index={mainProjects.length + index}
                    onOpen={setOpenSlug}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            className="projects-toggle"
            data-cursor-hover
            onClick={() => setShowMore((value) => !value)}
          >
            {showMore ? t.showLess : t.showMore(moreProjects.length)}
            <span className={showMore ? 'projects-toggle-arrow projects-toggle-arrow-open' : 'projects-toggle-arrow'}>
              ↓
            </span>
          </button>
        </>
      )}

      <AnimatePresence>
        {openProject && <ProjectDetail project={openProject} onClose={() => setOpenSlug(null)} />}
      </AnimatePresence>
    </section>
  );
}
