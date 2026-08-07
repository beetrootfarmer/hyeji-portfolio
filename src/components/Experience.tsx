import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';
import { SpiralMark } from './SpiralMark';
import './Experience.css';

interface JobEntry {
  period: string;
  org: string;
  role: string;
  points: string[];
}
interface GapEntry {
  variant: 'gap';
  label: string;
  period?: string;
}
type JobItem = JobEntry | GapEntry;

interface ExperienceCopy {
  eyebrow: string;
  careerLabel: string;
  educationLabel: string;
  jobs: JobItem[];
  education: { org: string; detail: string; period: string }[];
}

const content: Record<'en' | 'ko', ExperienceCopy> = {
  en: {
    eyebrow: 'Experience',
    careerLabel: 'Career',
    educationLabel: 'Education',
    jobs: [
      {
        period: 'Dec 2025 — Present',
        org: 'Dankook University Industry-Academic Cooperation Foundation',
        role: 'Yongin Media Center, Education Operations Team · Web Developer',
        points: [
          'Overhauled the Yongin Media Center homepage: traced and fixed 20+ bugs (missing refunds/cancellations, admin errors)',
          'Closed a critical payment side-effect that was creating operational risk',
          'Built a React-based document automation tool to unify a fragmented paperwork process',
          'Replaced a manually-run parking system with a React app, improving day-to-day operations',
        ],
      },
      {
        variant: 'gap',
        label: 'Built and shipped Beeve, entered it in a public data competition, and won an award',
        period: 'Sep 2025 ~',
      },
      {
        period: 'Mar 2024 — Aug 2025',
        org: 'Genesis Nest',
        role: 'Frontend Engineer · Full-time · 1.5 yrs',
        points: [
          'Owned the web side of two fandom apps (Churrrrr, Dayoff) — 100K+ combined downloads, introduced i18n and managed translation files across 4 languages',
          'Restructured the codebase into a monorepo to support a second app, and onboarded new engineers while setting frontend coding conventions',
          'Built a 33-component library on Radix UI, Shadcn, and CVA — cut duplicate code by ~40%',
          'Overhauled token security with a Next.js BFF pattern and HttpOnly cookies (zero incidents)',
          'Cut a Docker image 75% (273MB → 68MB) by adopting Next.js standalone mode',
          'Fixed an iOS CSS Nesting rendering bug to unblock cross-browser support',
        ],
      },
      {
        period: 'Jul 2023 — Feb 2024',
        org: 'Fairy Inc.',
        role: 'Frontend Research Engineer · Full-time · 8 mo',
        points: [
          'Built a React dashboard for ad campaign management and performance analytics',
          'Automated internal workflows with a Slack bot and a Spreadsheet-webhook email system',
        ],
      },
    ],
    education: [
      { org: 'Gachon University', detail: 'School of Art & Design · B.A.', period: '2016 — 2021' },
      { org: 'Samsung SW Academy For Youth', detail: 'Completed · Project Excellence Award', period: '2022 — 2023' },
      { org: 'Korea National Open University', detail: 'Computer Science · In progress', period: '2025 — Present' },
    ],
  },
  ko: {
    eyebrow: '이력',
    careerLabel: '경력',
    educationLabel: '학력',
    jobs: [
      {
        period: '2025.12 — 재직중',
        org: '단국대학교 산학협력단',
        role: '용인특례시 미디어센터 교육운영관리팀, 웹 개발 담당',
        points: [
          '용인특례시 미디어센터 홈페이지 개편 — 환불/취소 누락, 관리자 페이지 오류 등 20여 건의 버그 추적 및 정상화',
          '치명적인 결제 관련 사이드 이펙트를 해결해 운영 리스크 차단',
          'React 기반 증빙서류 자동화 프로그램을 개발해 파편화된 문서 작성 프로세스 통합',
          '수기로 관리하던 주차 시스템을 React App으로 만들어 업무 효율 증대',
        ],
      },
      {
        variant: 'gap',
        label: 'Beeve 개발·공모전 출품 및 수상',
        period: '2025.09 ~',
      },
      {
        period: '2024.03 — 2025.08',
        org: '제네시스네스트',
        role: 'Frontend 개발 · 정규직 · 1년 6개월',
        points: [
          '팬덤 커뮤니티 앱 2종(Churrrrr·Dayoff) 웹 전담 — 누적 10만 다운로드, 4개 국어 i18n 도입 및 번역 파일 관리',
          '모노레포 전환으로 두 번째 앱 출시 기반 구축, 신규 합류자 온보딩 및 코드 컨벤션 정립',
          'Radix UI·Shadcn·CVA 기반 33개 범용 컴포넌트 라이브러리 구축 — 중복 코드 약 40% 감축',
          'Next.js BFF 패턴과 HttpOnly 쿠키로 토큰 보안 아키텍처 전면 개편 (오류 0건)',
          'Next.js Standalone 모드 도입으로 Docker 이미지 크기 75% 감축 (273MB → 68MB)',
          'iOS CSS Nesting 렌더링 버그를 해결해 크로스 브라우징 환경 구축',
        ],
      },
      {
        period: '2023.07 — 2024.02',
        org: '(주) 페어리',
        role: 'Frontend 개발 연구원 · 정규직 · 8개월',
        points: [
          'React 기반 타겟팅 광고 캠페인 관리 및 성과 분석 대시보드 구축',
          '슬랙봇과 Spreadsheet Webhook 연동 이메일 시스템으로 사내 업무 프로세스 자동화',
        ],
      },
    ],
    education: [
      { org: '가천대학교', detail: '미술디자인학부 · 학사', period: '2016 — 2021' },
      { org: '삼성청년SW아카데미', detail: '수료 · 프로젝트 우수상', period: '2022 — 2023' },
      { org: '방송통신대학교', detail: '컴퓨터과학과 · 재학 중', period: '2025 — 현재' },
    ],
  },
};

export function Experience() {
  const { locale } = useLocale();
  const text = content[locale];

  return (
    <section className="experience section" id="experience">
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
      >
        {text.eyebrow}
      </motion.p>

      <div className="experience-block">
        <span className="experience-block-label">{text.careerLabel}</span>
        <div className="experience-jobs">
          {text.jobs.map((job, index) =>
            'variant' in job ? (
              <motion.p
                className="experience-gap"
                key={job.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <span className="experience-gap-bullet" aria-hidden="true">
                  ·
                </span>
                {job.label}
                {job.period && <span className="experience-gap-period">{job.period}</span>}
              </motion.p>
            ) : (
              <motion.div
                className="experience-job"
                key={job.org}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <SpiralMark className="experience-job-mark" size={26} turns={2.2 + index * 0.7} />
                <div className="experience-job-body">
                  <div className="experience-job-heading">
                    <h3 className="experience-job-org">{job.org}</h3>
                    <span className="experience-job-period">{job.period}</span>
                  </div>
                  <p className="experience-job-role">{job.role}</p>
                  <ul className="experience-job-points">
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </div>

      <div className="experience-block">
        <span className="experience-block-label">{text.educationLabel}</span>
        <div className="experience-education">
          {text.education.map((edu, index) => (
            <motion.div
              className="experience-edu-row"
              key={edu.org}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <span className="experience-edu-org">{edu.org}</span>
              <span className="experience-edu-detail">{edu.detail}</span>
              <span className="experience-edu-period">{edu.period}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
