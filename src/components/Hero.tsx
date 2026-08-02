import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import { SpiralHero } from './SpiralHero';
import './Hero.css';

const copy = {
  en: {
    eyebrow: 'Fine Art → Software',
    titleLines: [
      [{ text: 'Hyeji Kim ' }, { text: 'ships', accent: true }],
      [{ text: 'from concept to App Store.' }],
    ],
    tagline:
      'I studied fine art, where you define the problem yourself and carry it all the way to done. I build products the same way.',
    sub: 'Conceived and designed an app that won a KSPO award, then rebuilt its backend and shipped to the App Store in two months. React · TypeScript · Flutter. Three years in.',
    scroll: 'Scroll',
  },
  ko: {
    eyebrow: '순수예술 → 프론트엔드',
    titleLines: [
      [{ text: '기획부터 스토어까지,' }],
      [{ text: '서비스를 완성하는 개발자 ' }, { text: '김혜지', accent: true }],
    ],
    tagline:
      '문제를 스스로 정의하고 끝까지 완성해야 하는 순수예술을 전공했습니다. 지금은 같은 방식으로 서비스를 만듭니다.',
    sub: '직접 기획한 앱으로 국민체육진흥공단(KSPO) 수상, 이후 백엔드를 새로 구축해 2개월 만에 App Store 출시. React · TypeScript · Flutter, 3년차.',
    scroll: '스크롤',
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
          {text.eyebrow}
        </motion.p>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {text.titleLines.map((line, lineIndex) => (
            <span className="hero-title-line" key={lineIndex}>
              {line.map((segment, segIndex) =>
                'accent' in segment && segment.accent ? (
                  <span className="hero-title-accent" key={segIndex}>
                    {segment.text}
                  </span>
                ) : (
                  <span key={segIndex}>{segment.text}</span>
                ),
              )}
            </span>
          ))}
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
        <span>{text.scroll}</span>
        <motion.span
          className="scroll-cue-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
