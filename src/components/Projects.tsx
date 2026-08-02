import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getProjects } from '../data/projects';
import { useLocale } from '../i18n/LocaleContext';
import { ProjectCard } from './ProjectCard';
import { ProjectDetail } from './ProjectDetail';
import './Projects.css';

const text = {
  en: { eyebrow: 'Selected work', heading: 'Projects' },
  ko: { eyebrow: '주요 작업', heading: '프로젝트' },
} as const;

export function Projects() {
  const { locale } = useLocale();
  const projects = getProjects(locale);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openProject = projects.find((project) => project.slug === openSlug) ?? null;

  return (
    <section className="projects section" id="projects">
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
      >
        {text[locale].eyebrow}
      </motion.p>

      <motion.h2
        className="projects-heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        {text[locale].heading}
      </motion.h2>

      <div className="project-list">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} onOpen={setOpenSlug} />
        ))}
      </div>

      <AnimatePresence>
        {openProject && <ProjectDetail project={openProject} onClose={() => setOpenSlug(null)} />}
      </AnimatePresence>
    </section>
  );
}
