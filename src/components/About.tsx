import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import { SpiralMark } from './SpiralMark';
import './About.css';

const facts = {
  en: [
    { label: 'Background', value: 'B.A. in Fine Arts, Gachon University' },
    { label: 'Now', value: 'Frontend Developer' },
    { label: 'Tools', value: 'React · TypeScript · Figma' },
    { label: 'Based in', value: 'Seoul, KR' },
  ],
  ko: [
    { label: '배경', value: '가천대학교 미술디자인학부 학사' },
    { label: '현재', value: '프론트엔드 개발자' },
    { label: '도구', value: 'React · TypeScript · Figma' },
    { label: '거주지', value: '서울, 대한민국' },
  ],
} as const;

const eyebrow = { en: 'About', ko: '소개' } as const;

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
      title: '두 번 다, 기획서부터 썼습니다',
      paragraphs: [
        'SSAFY(삼성청년SW아카데미)에서 만든 FINS도, 국민체육진흥공단(KSPO) 공공데이터 공모전에 출품한 Beeve도 기획부터 시작했습니다. 무엇을 만들지 정하고, 왜 필요한지 설명하고, 화면을 설계한 다음 코드를 썼고, 둘 다 수상했습니다.',
        "개발을 알면 기획이 넓어집니다. 폼의 모바일 키패드 확인 버튼은 '완료'로 둘 수도, '다음'이나 '검색'으로 바꿀 수도 있습니다. 커스텀이 가능하다는 걸 모르면 그 선택지는 기획서에 등장하지 않습니다. 저는 개발을 하니까 이런 지점까지 기획에 담을 수 있고, 기획을 해봤으니까 넘어온 화면의 의도를 빨리 이해합니다.",
      ],
    },
    {
      title: '코드를 가장 많이 쓴 사람',
      paragraphs: [
        '팬덤 앱의 웹을 전담했습니다. 처음엔 프론트 팀이 네 명까지 늘었지만, 운영 단계에 접어들면서 저 혼자 남았습니다.',
        '혼자 붙잡고 있던 1년이 다음 단계를 만들었습니다. 구조를 모노레포로 정리해 두 번째 앱을 올릴 수 있게 했고, 새 팀원들이 합류했을 때 코드의 방향을 잡고 온보딩을 맡았습니다. 코드 전체를 알고 있는 사람이 저뿐이었기 때문입니다.',
      ],
    },
    {
      title: '10만 명이 쓰는 동안',
      paragraphs: [
        '츄르와 데이오프, 두 앱 모두 누적 10만 다운로드를 넘겼습니다. 사용자는 한국에만 있지 않아서 한국어·영어·일본어·중국어 네 개 언어를 지원했고, i18n을 도입해 번역 파일을 직접 관리했습니다.',
        'QA 조직이 없는 팀이었습니다. 지원 범위를 정의해두고 최대한 예외 케이스와 기기 조건을 고려해 출시했지만, 그럼에도 예외가 있었기에 빠르게 대응하는 것이 중요했습니다. CS가 들어오면 기기와 OS, 브라우저에 따라 원인을 파악하고 fallback을 만들거나 호환되는 문법으로 수정했습니다.',
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
        {eyebrow[locale]}
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
        {facts[locale].map((fact, index) => (
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
