import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import './Footer.css';

const links = [
  { label: 'Email', href: 'mailto:pos04118@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/beetrootfarmer' },
];

const text = {
  en: {
    heading: ["Let's make", 'something.'],
    note: (year: number) => `© ${year} HyeJi. Built with React, Vite & Framer Motion.`,
  },
  ko: {
    heading: ['함께', '만들어요.'],
    note: (year: number) => `© ${year} HyeJi. React, Vite, Framer Motion으로 제작.`,
  },
} as const;

export function Footer() {
  const { locale } = useLocale();
  const t = text[locale];

  return (
    <footer className="footer section" id="contact">
      <motion.h2
        className="footer-heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
      >
        {t.heading[0]}
        <br />
        {t.heading[1]}
      </motion.h2>

      <div className="footer-links">
        {links.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer" data-cursor-hover>
            {link.label}
          </a>
        ))}
      </div>

      <p className="footer-note">{t.note(new Date().getFullYear())}</p>
    </footer>
  );
}
