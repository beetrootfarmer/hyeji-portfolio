import { withBase } from '../../lib/asset';
import type { MindmapData } from './types';

export const mindmapEn: MindmapData = {
  nodes: [
    {
      id: 'root',
      label: 'Hyeji Kim',
      type: 'root',
      depth: 0,
      tags: [],
      detail: {
        summary: 'A frontend developer who ships from concept to App Store. Studied fine art, now three years into engineering.',
      },
    },

    // ---- career ----
    {
      id: 'career-dankook',
      label: 'Dankook University',
      type: 'career',
      depth: 1,
      tags: ['React'],
      detail: {
        period: 'Dec 2025 — Present',
        summary: 'Yongin Media Center, Education Operations Team · Web Developer.',
        bullets: [
          'Overhauled the Yongin Media Center homepage — traced and fixed 20+ bugs',
          'Closed a critical payment side-effect that was creating operational risk',
          'Built a React-based document automation tool',
          'Replaced a manually-run parking system with a React app',
        ],
      },
    },
    {
      id: 'career-genesisnest',
      label: 'Genesis Nest',
      type: 'career',
      depth: 1,
      tags: ['Next.js', 'TypeScript', 'Docker', 'CSS', 'Shadcn/CVA', 'App Bridge'],
      detail: {
        period: 'Mar 2024 — Aug 2025',
        summary: 'Frontend Engineer · Full-time · 1.5 yrs. Built two fandom apps and a smart-farm management app.',
        bullets: [
          'Owned the web side of two fandom apps (Churrrrr, Dayoff) — 100K+ combined downloads',
          'Restructured the codebase into a monorepo, onboarded new engineers',
          'Built a 33-component shared library — cut duplicate code by ~40%',
        ],
      },
    },
    {
      id: 'career-fairytech',
      label: 'Fairytech Inc.',
      type: 'career',
      depth: 1,
      tags: ['React'],
      detail: {
        period: 'Jul 2023 — Feb 2024',
        summary: 'Frontend Research Engineer · Full-time · 8 mo.',
        bullets: [
          'Built a React dashboard for ad campaign management and performance analytics',
          'Automated internal workflows with a Slack bot and a Spreadsheet-webhook email system',
        ],
      },
    },

    // ---- education ----
    {
      id: 'edu-gachon',
      label: 'Gachon University',
      type: 'education',
      depth: 1,
      tags: [],
      detail: {
        period: '2016 — 2021',
        summary: 'B.A., School of Art & Design. Studied fine art, where you define the problem yourself and carry it to done.',
      },
    },
    {
      id: 'edu-ssafy',
      label: 'Samsung SW Academy For Youth',
      type: 'education',
      depth: 1,
      tags: [],
      detail: {
        period: '2022 — 2023',
        summary: 'Completed · Project Excellence Award. Built both TIFY and FINS during this period.',
      },
    },
    {
      id: 'edu-konau',
      label: 'Korea National Open University',
      type: 'education',
      depth: 1,
      tags: [],
      detail: {
        period: '2025 — Present',
        summary: 'Computer Science · In progress.',
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
        summary: "A fitness-measurement service built on Korea's national fitness public dataset, using only a phone's camera and sensors. Live on the iOS App Store.",
        bullets: ['2nd place, KSPO public data competition'],
        links: [{ label: 'Live site', url: 'https://apps.apple.com/kr/app/beeve/id6759857773' }],
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
        summary: 'Fandom community apps "Churrrrr" and "Dayoff" plus an admin service — from an iOS 16 rendering bug to a 75% Docker image cut.',
        images: [withBase('3.fandom/fandom_logo.png')],
      },
    },
    {
      id: 'project-myfarm',
      label: 'MyFarm+',
      type: 'project',
      depth: 1,
      tags: ['Next.js', 'TypeScript', 'Shadcn/CVA', 'App Bridge'],
      detail: {
        period: '2025',
        summary: 'A hybrid smart-farm management app — from map marker rendering performance to a token-security architecture overhaul.',
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
        summary: 'Solo-built the frontend for a project commissioned by Studio Bandal — SVG interactions and a 10,000+ item dataset.',
        links: [{ label: 'Live site', url: 'https://memorialshower.com/' }],
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
        summary: 'A gift-funding service where you get celebrated by crowdfunding the gift you want. PM and Frontend Lead.',
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
        summary: 'A personal movie SNS service built around your favorite films. Won the Project Excellence Award (Samsung Electronics).',
        images: [withBase('6.fins/logo.svg')],
      },
    },

    // ---- flagship case studies (depth 2) ----
    {
      id: 'case-beeve-rppg',
      label: 'Heart rate via rPPG',
      type: 'project',
      depth: 2,
      tags: ['MediaPipe'],
      detail: {
        summary:
          "Measuring heart rate from nothing but a mobile browser meant solving for signal noise and " +
          "lighting conditions. Existing rPPG libraries didn't work within mobile browser constraints, " +
          "so I built the pipeline from scratch.",
        bullets: ['Valid-range filtering drops outliers; the three-interval average keeps readings stable'],
      },
    },
    {
      id: 'case-fandom-timezone',
      label: 'Fixing timezone ambiguity',
      type: 'project',
      depth: 2,
      tags: [],
      detail: {
        summary:
          'Found that the admin schedule spec defined dates/times as KST only. Traced it through ' +
          'planning to the actual users — idol agencies — who wanted local time instead.',
        bullets: [
          "The search filter now operates on the user's local timezone",
          'Schedule display appends the UTC offset so the registered time is conveyed exactly',
        ],
      },
    },
    {
      id: 'case-myfarm-token',
      label: 'Token security architecture',
      type: 'project',
      depth: 2,
      tags: ['App Bridge'],
      detail: {
        summary:
          'The existing localStorage approach left tokens exposed to theft via XSS. I made the case ' +
          'to the team for adopting a BFF pattern and built it myself.',
        bullets: ['Next.js Route Handler as BFF, HttpOnly/Secure/SameSite=strict cookies', 'Zero token-related incidents since launch'],
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

    { source: 'project-beeve', target: 'case-beeve-rppg', kind: 'hierarchy' },
    { source: 'project-fandom', target: 'case-fandom-timezone', kind: 'hierarchy' },
    { source: 'project-myfarm', target: 'case-myfarm-token', kind: 'hierarchy' },

    { source: 'career-dankook', target: 'skill-react', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-nextjs', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-typescript', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-docker', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-css', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-shadcn-cva', kind: 'relation' },
    { source: 'career-genesisnest', target: 'skill-app-bridge', kind: 'relation' },
    { source: 'career-fairytech', target: 'skill-react', kind: 'relation' },

    { source: 'career-genesisnest', target: 'project-fandom', kind: 'relation' },
    { source: 'career-genesisnest', target: 'project-myfarm', kind: 'relation' },
    { source: 'career-dankook', target: 'project-beeve', kind: 'relation' },

    { source: 'edu-ssafy', target: 'project-tify', kind: 'relation' },
    { source: 'edu-ssafy', target: 'project-fins', kind: 'relation' },

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

    { source: 'case-beeve-rppg', target: 'skill-mediapipe', kind: 'relation' },
    { source: 'case-myfarm-token', target: 'skill-app-bridge', kind: 'relation' },
  ],
};
