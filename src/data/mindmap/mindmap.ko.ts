import { withBase } from '../../lib/asset';
import type { MindmapData } from './types';

export const mindmapKo: MindmapData = {
  nodes: [
    {
      id: 'root',
      label: '김혜지',
      type: 'root',
      depth: 0,
      tags: [],
      detail: {
        summary: '기획부터 스토어까지, 서비스를 완성하는 프론트엔드 개발자. 순수예술을 전공하고 3년차 개발자로 일하고 있습니다.',
      },
    },

    // ---- career ----
    {
      id: 'career-dankook',
      label: '단국대학교 산학협력단',
      type: 'career',
      depth: 1,
      tags: ['React'],
      detail: {
        period: '2025.12 — 재직중',
        summary: '용인특례시 미디어센터 교육운영관리팀, 웹 개발 담당.',
        bullets: [
          '용인특례시 미디어센터 홈페이지 개편 — 20여 건의 버그 추적 및 정상화',
          '치명적인 결제 관련 사이드 이펙트를 해결해 운영 리스크 차단',
          'React 기반 증빙서류 자동화 프로그램 개발',
          '수기로 관리하던 주차 시스템을 React App으로 전환',
        ],
      },
    },
    {
      id: 'career-genesisnest',
      label: '제네시스네스트',
      type: 'career',
      depth: 1,
      tags: ['Next.js', 'TypeScript', 'Docker', 'CSS', 'Shadcn/CVA', 'App Bridge'],
      detail: {
        period: '2024.03 — 2025.08',
        summary: 'Frontend 개발 · 정규직 · 1년 6개월. 팬덤 앱 2종과 스마트 농사 관리 앱을 만들었습니다.',
        bullets: [
          '팬덤 커뮤니티 앱 2종(Churrrrr·Dayoff) 웹 전담 — 누적 10만 다운로드',
          '모노레포 전환으로 두 번째 앱 출시 기반 구축, 신규 합류자 온보딩',
          '33개 범용 컴포넌트 라이브러리 구축 — 중복 코드 약 40% 감축',
        ],
      },
    },
    {
      id: 'career-fairytech',
      label: '(주) 페어리테크',
      type: 'career',
      depth: 1,
      tags: ['React'],
      detail: {
        period: '2023.07 — 2024.02',
        summary: 'Frontend 개발 연구원 · 정규직 · 8개월.',
        bullets: [
          'React 기반 타겟팅 광고 캠페인 관리 및 성과 분석 대시보드 구축',
          '슬랙봇과 Spreadsheet Webhook 연동 이메일 시스템으로 업무 자동화',
        ],
      },
    },

    // ---- education ----
    {
      id: 'edu-gachon',
      label: '가천대학교',
      type: 'education',
      depth: 1,
      tags: [],
      detail: {
        period: '2016 — 2021',
        summary: '미술디자인학부 학사. 문제를 스스로 정의하고 끝까지 완성해야 하는 순수예술을 전공했습니다.',
      },
    },
    {
      id: 'edu-ssafy',
      label: '삼성청년SW아카데미',
      type: 'education',
      depth: 1,
      tags: [],
      detail: {
        period: '2022 — 2023',
        summary: '수료 · 프로젝트 우수상. TIFY와 FINS 두 프로젝트를 이 시기에 만들었습니다.',
      },
    },
    {
      id: 'edu-konau',
      label: '방송통신대학교',
      type: 'education',
      depth: 1,
      tags: [],
      detail: {
        period: '2025 — 현재',
        summary: '컴퓨터과학과 재학 중.',
      },
    },

    // ---- projects ----
    {
      id: 'project-beeve',
      label: 'Beeve',
      type: 'project',
      depth: 1,
      tags: ['Next.js', 'TypeScript', 'MediaPipe', 'Node.js', 'PostgreSQL', 'Docker'],
      detail: {
        period: '2025',
        summary: '국민체력100 공공데이터를 활용해 스마트폰 카메라와 센서만으로 체력을 측정하는 서비스. iOS 앱스토어 정식 출시.',
        bullets: ['국민체육진흥공단 공공데이터 경진대회 2위'],
        links: [{ label: '라이브 사이트', url: 'https://apps.apple.com/kr/app/beeve/id6759857773' }],
        images: [withBase('1.beeve/beeve_logo.png')],
      },
    },
    {
      id: 'project-fandom',
      label: 'Churrrrr · Dayoff',
      type: 'project',
      depth: 1,
      tags: ['Next.js', 'TypeScript', 'Docker', 'CSS'],
      detail: {
        period: '2024',
        summary: '팬덤 커뮤니티 앱 「Churrrrr」·「Dayoff」와 어드민 서비스. iOS 16 렌더링 버그 대응부터 Docker 이미지 75% 감축까지.',
        images: [withBase('3.fandom/fandom_logo.png')],
      },
    },
    {
      id: 'project-myfarm',
      label: '마이팜플러스',
      type: 'project',
      depth: 1,
      tags: ['Next.js', 'TypeScript', 'Shadcn/CVA', 'App Bridge'],
      detail: {
        period: '2025',
        summary: '스마트 농사 관리 서비스 하이브리드 앱. 지도 마커 렌더링 최적화부터 토큰 보안 아키텍처 개편까지.',
        images: [withBase('2.myFarm/myfarm_logo.png')],
      },
    },
    {
      id: 'project-memorial',
      label: 'Memorial Shower',
      type: 'project',
      depth: 1,
      tags: ['React', 'TypeScript', 'React Query'],
      detail: {
        period: '2023',
        summary: '스튜디오 반달이 의뢰한 메모리얼 샤워 서비스의 프론트엔드를 단독 개발. SVG 인터랙션과 1만 건 이상 데이터 최적화.',
        links: [{ label: '라이브 사이트', url: 'https://memorialshower.com/' }],
        images: [withBase('4.memorial/logo.svg')],
      },
    },
    {
      id: 'project-tify',
      label: 'TIFY',
      type: 'project',
      depth: 1,
      tags: ['Firebase', 'AWS S3'],
      detail: {
        period: '2023',
        summary: '원하는 선물을 펀딩받아 축하받는 서비스. PM 겸 Frontend Lead로 참여.',
        images: [withBase('5.tify/logo.svg')],
      },
    },
    {
      id: 'project-fins',
      label: 'FINS',
      type: 'project',
      depth: 1,
      tags: ['Vue.js', 'JavaScript', 'Vite', 'Python', 'Django', 'SQLite'],
      detail: {
        period: '2022',
        summary: '선호하는 영화를 기반으로 한 나만의 영화 SNS 서비스. 삼성전자 프로젝트 우수상 수상.',
        images: [withBase('6.fins/logo.svg')],
      },
    },

    // ---- flagship case studies (depth 2) ----
    {
      id: 'case-beeve-rppg',
      label: 'rPPG 기반 심박수 측정',
      type: 'project',
      depth: 2,
      tags: ['MediaPipe'],
      detail: {
        summary:
          '모바일 브라우저만으로 심박수를 측정하려면 신호 노이즈와 조명 문제를 해결해야 했습니다. ' +
          '기존 rPPG 라이브러리를 그대로 쓸 수 없어 직접 파이프라인을 구현했습니다.',
        bullets: ['BPM 유효 범위 필터링으로 outlier 제거, 3구간 평균으로 안정적인 측정값 확보'],
      },
    },
    {
      id: 'case-fandom-timezone',
      label: '어드민 스케줄 타임존 처리 개선',
      type: 'project',
      depth: 2,
      tags: [],
      detail: {
        summary:
          '기획서에 날짜·시간 기준이 KST로만 정의된 것을 발견. 기획팀을 거쳐 실사용자인 아이돌 ' +
          '기획사에 확인한 결과, 현지 시간 기준으로 보고 싶다는 실제 요구를 확인했습니다.',
        bullets: [
          '검색 필터는 사용자 로컬 타임존 기준으로 동작',
          '스케줄 표출에 UTC 오프셋을 병기해 등록된 시각 그대로 전달',
        ],
      },
    },
    {
      id: 'case-myfarm-token',
      label: '토큰 보안 구조 개선',
      type: 'project',
      depth: 2,
      tags: ['App Bridge'],
      detail: {
        summary:
          '기존 로컬스토리지 방식은 XSS 공격 시 토큰 탈취가 가능한 구조였습니다. BFF 패턴 도입을 ' +
          '팀에 제안하고 직접 구현했습니다.',
        bullets: ['Next.js Route Handler를 BFF로 활용, HttpOnly·Secure·SameSite=strict 쿠키 전환', '배포 후 토큰 관련 오류 0건'],
      },
    },

    // ---- skills ----
    { id: 'skill-nextjs', label: 'Next.js', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-typescript', label: 'TypeScript', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-mediapipe', label: 'MediaPipe', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-nodejs', label: 'Node.js', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-docker', label: 'Docker', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-css', label: 'CSS', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-shadcn-cva', label: 'Shadcn/CVA', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-app-bridge', label: 'App Bridge', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-react', label: 'React', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-react-query', label: 'React Query', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-firebase', label: 'Firebase', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-aws-s3', label: 'AWS S3', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-vuejs', label: 'Vue.js', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-javascript', label: 'JavaScript', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-vite', label: 'Vite', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-python', label: 'Python', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-django', label: 'Django', type: 'skill', depth: 1, tags: [] },
    { id: 'skill-sqlite', label: 'SQLite', type: 'skill', depth: 1, tags: [] },
  ],

  links: [
    // hierarchy: root -> depth 1
    { source: 'root', target: 'career-dankook', kind: 'hierarchy' },
    { source: 'root', target: 'career-genesisnest', kind: 'hierarchy' },
    { source: 'root', target: 'career-fairytech', kind: 'hierarchy' },
    { source: 'root', target: 'edu-gachon', kind: 'hierarchy' },
    { source: 'root', target: 'edu-ssafy', kind: 'hierarchy' },
    { source: 'root', target: 'edu-konau', kind: 'hierarchy' },
    { source: 'root', target: 'project-beeve', kind: 'hierarchy' },
    { source: 'root', target: 'project-fandom', kind: 'hierarchy' },
    { source: 'root', target: 'project-myfarm', kind: 'hierarchy' },
    { source: 'root', target: 'project-memorial', kind: 'hierarchy' },
    { source: 'root', target: 'project-tify', kind: 'hierarchy' },
    { source: 'root', target: 'project-fins', kind: 'hierarchy' },
    { source: 'root', target: 'skill-nextjs', kind: 'hierarchy' },
    { source: 'root', target: 'skill-typescript', kind: 'hierarchy' },
    { source: 'root', target: 'skill-mediapipe', kind: 'hierarchy' },
    { source: 'root', target: 'skill-nodejs', kind: 'hierarchy' },
    { source: 'root', target: 'skill-docker', kind: 'hierarchy' },
    { source: 'root', target: 'skill-css', kind: 'hierarchy' },
    { source: 'root', target: 'skill-shadcn-cva', kind: 'hierarchy' },
    { source: 'root', target: 'skill-app-bridge', kind: 'hierarchy' },
    { source: 'root', target: 'skill-react', kind: 'hierarchy' },
    { source: 'root', target: 'skill-react-query', kind: 'hierarchy' },
    { source: 'root', target: 'skill-firebase', kind: 'hierarchy' },
    { source: 'root', target: 'skill-aws-s3', kind: 'hierarchy' },
    { source: 'root', target: 'skill-vuejs', kind: 'hierarchy' },
    { source: 'root', target: 'skill-javascript', kind: 'hierarchy' },
    { source: 'root', target: 'skill-vite', kind: 'hierarchy' },
    { source: 'root', target: 'skill-python', kind: 'hierarchy' },
    { source: 'root', target: 'skill-django', kind: 'hierarchy' },
    { source: 'root', target: 'skill-sqlite', kind: 'hierarchy' },

    // hierarchy: project -> depth 2 case studies
    { source: 'project-beeve', target: 'case-beeve-rppg', kind: 'hierarchy' },
    { source: 'project-fandom', target: 'case-fandom-timezone', kind: 'hierarchy' },
    { source: 'project-myfarm', target: 'case-myfarm-token', kind: 'hierarchy' },

    // relation: career -> skill
    { source: 'career-dankook', target: 'skill-react', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-nextjs', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-typescript', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-docker', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-css', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-shadcn-cva', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-app-bridge', kind: 'relation' },
    { source: 'career-fairytech', target: 'skill-react', kind: 'relation' },

    // relation: career -> project (built at / overlapped with)
    { source: 'career-genesisnest', target: 'project-fandom', kind: 'relation' },
    { source: 'career-genesisnest', target: 'project-myfarm', kind: 'relation' },

    // relation: education -> project (built during)
    { source: 'edu-ssafy', target: 'project-tify', kind: 'relation' },
    { source: 'edu-ssafy', target: 'project-fins', kind: 'relation' },

    // relation: project -> skill
    { source: 'project-beeve', target: 'skill-nextjs', kind: 'relation' },
    { source: 'project-beeve', target: 'skill-typescript', kind: 'relation' },
    { source: 'project-beeve', target: 'skill-mediapipe', kind: 'relation' },
    { source: 'project-beeve', target: 'skill-nodejs', kind: 'relation' },
    { source: 'project-beeve', target: 'skill-docker', kind: 'relation' },

    { source: 'project-fandom', target: 'skill-nextjs', kind: 'relation' },
    { source: 'project-fandom', target: 'skill-typescript', kind: 'relation' },
    { source: 'project-fandom', target: 'skill-docker', kind: 'relation' },
    { source: 'project-fandom', target: 'skill-css', kind: 'relation' },

    { source: 'project-myfarm', target: 'skill-nextjs', kind: 'relation' },
    { source: 'project-myfarm', target: 'skill-typescript', kind: 'relation' },
    { source: 'project-myfarm', target: 'skill-shadcn-cva', kind: 'relation' },
    { source: 'project-myfarm', target: 'skill-app-bridge', kind: 'relation' },

    { source: 'project-memorial', target: 'skill-react', kind: 'relation' },
    { source: 'project-memorial', target: 'skill-typescript', kind: 'relation' },
    { source: 'project-memorial', target: 'skill-react-query', kind: 'relation' },

    { source: 'project-tify', target: 'skill-firebase', kind: 'relation' },
    { source: 'project-tify', target: 'skill-aws-s3', kind: 'relation' },

    { source: 'project-fins', target: 'skill-vuejs', kind: 'relation' },
    { source: 'project-fins', target: 'skill-javascript', kind: 'relation' },
    { source: 'project-fins', target: 'skill-vite', kind: 'relation' },
    { source: 'project-fins', target: 'skill-python', kind: 'relation' },
    { source: 'project-fins', target: 'skill-django', kind: 'relation' },
    { source: 'project-fins', target: 'skill-sqlite', kind: 'relation' },

    // relation: case study -> skill
    { source: 'case-beeve-rppg', target: 'skill-mediapipe', kind: 'relation' },
    { source: 'case-myfarm-token', target: 'skill-app-bridge', kind: 'relation' },
  ],
};
