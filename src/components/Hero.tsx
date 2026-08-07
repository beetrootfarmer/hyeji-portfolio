import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import { SpiralHero } from './SpiralHero';
import './Hero.css';

interface TextSegment {
  text: string;
  accent?: boolean;
}
type LineSegment = TextSegment | TextSegment[];

interface TitleLine {
  segments: LineSegment[];
  /** Keep this line on a single row once the viewport is wide enough. */
  nowrapWide?: boolean;
}

interface HeroCopy {
  eyebrow: string;
  titleLines: TitleLine[];
  tagline: string[];
  sub: string;
  spiralLabel: string;
  spiralCaption: string;
  scroll: string;
}

const copy: Record<'en' | 'ko', HeroCopy> = {
  en: {
    eyebrow: 'Fine Art → Software',
    titleLines: [
      { segments: [{ text: 'Hyeji Kim ' }, { text: 'ships', accent: true }] },
      { segments: [{ text: 'from concept to App Store.' }] },
    ],
    tagline: [
      'Conceived and designed an app that won a KSPO award,',
      'then rebuilt its backend and shipped to the App Store.',
      'Ran the web side of two fandom apps with 100K+ downloads across four languages.',
    ],
    sub: 'React · TypeScript · Next.js. Three years in.',
    spiralLabel: 'A graphic of an infinitely expanding spiral, representing entropy.',
    spiralCaption: 'An infinitely expanding spiral — entropy',
    scroll: 'Scroll',
  },
  ko: {
    eyebrow: '순수예술 → 프론트엔드',
    titleLines: [
      { segments: [{ text: '기획부터 스토어까지,' }] },
      {
        segments: [{ text: '서비스를 완성하는 ' }, [{ text: '개발자 ' }, { text: '김혜지', accent: true }]],
        nowrapWide: true,
      },
    ],
    tagline: [
      '직접 기획한 앱으로 국민체육진흥공단(KSPO) 수상,',
      '백엔드를 새로 구축해 App Store 출시.',
      '누적 10만 다운로드 팬덤 앱 2종의 웹을 4개 국어로 운영.',
    ],
    sub: 'React · TypeScript · Next.js, 3년차.',
    spiralLabel: '무한히 확장하는 나선, 엔트로피를 형상화한 그래픽',
    spiralCaption: '무한히 확장하는 나선 — 엔트로피',
    scroll: '스크롤',
  },
};

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
            <span
              className={
                line.nowrapWide ? 'hero-title-line hero-title-line-nowrap-wide' : 'hero-title-line'
              }
              key={lineIndex}
            >
              {line.segments.map((segment, segIndex) =>
                Array.isArray(segment) ? (
                  <span className="hero-title-nowrap" key={segIndex}>
                    {segment.map((subSegment, subIndex) =>
                      subSegment.accent ? (
                        <span className="hero-title-accent" key={subIndex}>
                          {subSegment.text}
                        </span>
                      ) : (
                        <span key={subIndex}>{subSegment.text}</span>
                      ),
                    )}
                  </span>
                ) : segment.accent ? (
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
          {text.tagline.map((line, index) => (
            <span className="hero-tagline-line" key={index}>
              {line}
            </span>
          ))}
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
      >
        <SpiralHero label={text.spiralLabel} />
        <span className="hero-figure-caption" aria-hidden="true">
          {text.spiralCaption}
        </span>
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
