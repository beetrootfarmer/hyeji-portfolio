import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import { SpiralHero } from './SpiralHero';
import './Hero.css';

const copy = {
  en: {
    titleLine1: 'ONE QUESTION',
    titleAccent: 'LEADS TO ANOTHER',
    tagline:
      "A PM's intent, a user's flow, a teammate's understanding — solving one only opens the next question. I keep that chain moving.",
    sub: 'A fine arts major turned 3-year frontend developer, still asking why — now exploring better answers in code.',
  },
  ko: {
    titleLine1: '꼬리를 무는',
    titleAccent: '질문',
    tagline:
      '기획자의 의도, 사용자의 동선, 동료의 이해 — 하나를 풀면 다음 질문이 이어집니다. 저는 그 흐름을 멈추지 않습니다.',
    sub: '순수예술을 전공했고, 지금은 3년차 프론트엔드 개발자입니다. 여전히 왜냐고 묻고, 이제는 코드로 더 나은 답을 탐구합니다.',
  },
} as const;

export function Hero() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Design → Frontend
        </motion.p>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {text.titleLine1}
          <br />
          <span className="hero-title-accent">{text.titleAccent}</span>
        </motion.h1>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {text.tagline}
        </motion.p>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {text.sub}
        </motion.p>
      </div>

      <motion.div
        className="hero-figure"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        aria-hidden="true"
      >
        <SpiralHero />
      </motion.div>

      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span>Scroll</span>
        <motion.span
          className="scroll-cue-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
