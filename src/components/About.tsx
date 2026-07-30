import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import { SpiralMark } from './SpiralMark';
import './About.css';

const facts = [
  { label: 'Background', value: 'B.A. in Fine Arts, Gachon University' },
  { label: 'Now', value: 'Frontend Developer' },
  { label: 'Tools', value: 'React · TypeScript · Figma' },
  { label: 'Based in', value: 'Seoul, KR' },
];

const essays = {
  en: [
    {
      title: 'Asking Questions, and Being Asked',
      paragraphs: [
        "A habit that carried over from studying art into now. Starting with a question, testing the answer, sitting with the discomfort of not knowing yet, and refusing to settle for the first answer that merely works.",
        'And the crits — being questioned, and having to explain my own choices — made me slip naturally into code review culture. Just in front of a pull request instead of a canvas.',
      ],
    },
    {
      title: 'The Feedback Loop',
      paragraphs: [
        "Code runs, or it doesn't. It's faster, or it's slower. It holds up, or it breaks. I genuinely enjoy this loop — explore, build, test, learn, rebuild. Not because the uncertainty disappears, but because it turns into something I can actually work with.",
        "And since there's always more than one good way to build something, I don't think I'll ever get tired of repeating this loop.",
      ],
    },
  ],
  ko: [
    {
      title: '질문하기, 그리고 질문받기',
      paragraphs: [
        '미술을 공부하던 시절부터 지금까지 이어져 온 습관이다. 질문을 시작으로 답을 시험해보고, 아직 모른다는 불편함을 견디고, 일단 되는 첫 번째 답에 안주하지 않는 것.',
        '그리고 질문을 받고 나의 선택을 논의하던 크리틱의 시간들은, 나를 코드리뷰 문화에 자연스럽게 스며들게 했다. 캔버스 대신 풀 리퀘스트 앞에서.',
      ],
    },
    {
      title: '피드백 루프',
      paragraphs: [
        '코드는 돌아가거나, 돌아가지 않는다. 더 빠르거나, 더 느리다. 부하를 견디거나, 무너진다. 탐색하고, 만들고, 시험하고, 배우고, 다시 만드는 이 피드백 루프가 나는 진심으로 즐겁다. 불확실성이 사라져서가 아니라, 불확실성이 내가 다룰 수 있는 무언가로 바뀌기 때문이다.',
        '좋은 구현에는 늘 여러 갈래의 길이 있어서, 이 루프는 지치지 않고 평생 반복할 수 있을 것 같다.',
      ],
    },
  ],
} as const;

export function About() {
  const { locale } = useLocale();

  return (
    <section className="about section" id="about">
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
      >
        About
      </motion.p>

      <div className="about-essays">
        {essays[locale].map((essay, index) => (
          <motion.div
            className="about-essay"
            key={essay.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <SpiralMark className="about-essay-mark" size={30} turns={2.2 + index * 0.8} />
            <div className="about-essay-body">
              <div className="about-essay-heading">
                <h3 className="about-essay-title">{essay.title}</h3>
                <span className="about-essay-index">0{index + 1}</span>
              </div>
              {essay.paragraphs.map((paragraph, pIndex) => (
                <p className="about-essay-para" key={pIndex}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="about-facts">
        {facts.map((fact, index) => (
          <motion.div
            className="about-fact"
            key={fact.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <span className="about-fact-label">{fact.label}</span>
            <span className="about-fact-value">{fact.value}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
