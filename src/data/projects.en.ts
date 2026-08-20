import type { Project } from './types';
import { withBase } from '../lib/asset';

export const projectsEn: Project[] = [
  {
    slug: 'beeve',
    year: '2025',
    title: 'Beeve',
    role: 'PM & Frontend',
    summary:
      "A fitness-measurement service built on Korea's national fitness public dataset — heart rate and reaction time, measured with nothing but a phone's camera and sensors. Now live on the iOS App Store.",
    description:
      "Ongoing since September 2025, built as PM and frontend engineer: a service that measures " +
      "physical fitness using only a smartphone's camera and sensors, powered by Korea's " +
      "national fitness public dataset. The project won 2nd place at the Korea Sports Promotion " +
      "Foundation's public data competition and has since launched on the iOS App Store. Below are " +
      "five core problems from development and how I solved them.",
    award: '2nd place, Korea Sports Promotion Foundation public data competition',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MediaPipe', 'Node.js', 'Docker'],
    thumbnail: withBase('1.beeve/beeve_logo.png'),
    images: [
      { src: withBase('1.beeve/beeve1.jpg'), alt: 'Beeve 6-Data radar score screen' },
      { src: withBase('1.beeve/beeve3.jpg'), alt: 'Beeve AI daily schedule screen' },
      { src: withBase('1.beeve/beeve4.jpg'), alt: 'Beeve fitness stats screen' },
      { src: withBase('1.beeve/beeve2.jpg'), alt: 'Beeve outfit log screen' },
    ],
    problems: [
      {
        title: 'Heart rate via rPPG',
        problem:
          "Measuring heart rate from nothing but a mobile browser meant solving for signal noise and " +
          "lighting conditions. Existing rPPG libraries didn't work within mobile browser constraints, " +
          "so I built the pipeline from scratch.",
        solution:
          "The MediaStream API and a torch constraint turn on the flash, and per-frame changes in the " +
          "red-channel pixel average become a blood-flow signal. A 5-point moving average filters noise, " +
          "and peaks are detected using a dynamic threshold (80% of the max) with a minimum interval, " +
          "then inverted into BPM. The 15-second window is split into three sub-intervals, each computed " +
          "independently and averaged for a noise-resistant reading.",
        result: 'Valid-range filtering drops outliers, and the three-interval average keeps readings stable.',
      },
      {
        title: 'Reaction time via accelerometer',
        problem:
          "Measuring reaction time with nothing but a phone's sensors meant handling per-device " +
          "permission models and sensor noise. iOS 13+'s DeviceMotionEvent permission model " +
          "(requestPermission) and the Android branch were the trickiest part.",
        solution:
          "Composite acceleration (√x²+y²+z²) auto-starts a measurement once stability crosses a 90-point " +
          "threshold. A Web Audio API oscillator plays the countdown cue, and performance.now() times the " +
          "gap between the cue and the detected movement. useRef sidesteps a stale-closure bug, and any " +
          "reaction under 100ms is auto-rejected as a false start at the code level.",
        result: 'The best of three valid readings is kept, and false starts are auto-invalidated for reliability.',
      },
      {
        title: 'Real-time pose estimation and rendering in the browser',
        problem:
          "Calling detectForVideo() on every frame overloaded the CPU/GPU and dropped frames. setInterval " +
          "made it worse, since it runs independently of the browser's render cycle and drifts out of sync.",
        solution:
          "Inference is skipped entirely when the video frame hasn't changed, and delegated to the GPU " +
          "for the frames that do run.",
        result: 'Removing redundant inference brought rendering to a smooth, consistent 60fps.',
        code: {
          label: 'Frame skip + GPU delegation',
          language: 'ts',
          code: `// Skip inference if the frame hasn't changed
if (video.currentTime === lastVideoTime) {
  requestAnimationFrame(detect);
  return;
}
// Delegate to GPU for faster inference
PoseLandmarker.createFromOptions({
  baseOptions: {
    delegate: 'GPU', // GPU instead of CPU
  },
  runningMode: 'VIDEO', // optimized for continuous frames
});`,
        },
      },
      {
        title: 'Custom hexagonal Chart.js radar chart',
        problem:
          "National Fitness 100 scores fitness across six categories, but Chart.js's radar chart " +
          "defaults to a circular grid, making a hexagonal visualization impossible. Setting " +
          "circular: false didn't help either — the gridlines drifted out of alignment with the " +
          "data polygon. The grading system was another problem: in National Fitness 100, grade 1 " +
          "is the best, but radar charts push higher values further outward, so plotting the raw " +
          "grades would push the best-performing categories toward the center.",
        solution:
          "Made the built-in grid transparent and drew a hexagonal grid directly as an SVG layer " +
          "underneath the chart. Converted grades through a reverse-mapping table so grade 1 sits at " +
          "the outermost ring, turned off the default animation, and implemented the entry animation " +
          "myself with requestAnimationFrame-based linear interpolation so the grid and polygon never " +
          "drift out of sync.",
        result: 'Grades now read intuitively against an accurate hexagonal grid, with a smooth expand-in animation on entry.',
        code: {
          label: 'Hexagonal grid + grade reverse-mapping',
          language: 'ts',
          code: `// Hide the built-in grid, replace it with a hex.svg layer
grid: { color: 'transparent' }

// Reverse-map grades so grade 1 (best) sits outermost
const GRADE_TO_VALUE = [0, 3.6, 2.9, 2.2, 1.2, 0];

// Linear rAF interpolation instead of the default animation
animation: false → requestAnimationFrame(animate)`,
        },
      },
      {
        title: 'From award to a real service',
        problem:
          "After winning the competition, I had to build a new backend to actually ship it as a real " +
          "service. Express gives a lot of freedom, but building it solo, I judged that freedom would " +
          "make the structure easy to lose control of.",
        solution:
          "I chose Nest.js instead, since it enforces a Module/Controller/Service structure and " +
          "supports TypeScript natively. I implemented the logic for calculating grades across six " +
          "categories by gender and age group per the National Fitness 100 standard, and built a " +
          "workout-recommendation pipeline — weakness analysis via the Gemini API, prompt generation, " +
          "then JSON parsing — with a fallback in place for when the response didn't come back in the " +
          "expected format. Deployment was automated with a Cloud Run multi-stage Docker build.",
        result: 'Went from planning through frontend, backend, and App Store review in two months, and shipped to iOS.',
      },
    ],
    liveUrl: 'https://apps.apple.com/kr/app/beeve/id6759857773',
    repoUrls: [
      { label: 'Beeve Web', url: 'https://github.com/Hi-Beeve/Beeve-web' },
      { label: 'Beeve Server', url: 'https://github.com/Hi-Beeve/Beeve-server-v2' },
    ],
  },
  {
    slug: 'fandom',
    year: '2024',
    title: 'Churrrrr · Dayoff',
    role: 'Frontend',
    summary:
      'Fandom community apps "Churrrrr" and "Dayoff" plus an admin service — from an iOS 16 rendering bug to a 75% Docker image cut.',
    description:
      'Built at Genesis Nest as a frontend engineer between April 2024 and April 2025: the fandom ' +
      'community apps "Churrrrr" and "Dayoff", plus their admin service. From a live-service incident ' +
      'to deployment optimization and a team-wide coding convention, here are four core problems ' +
      'from development and how I solved them.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker', 'CSS'],
    thumbnail: withBase('3.fandom/fandom_logo.png'),
    images: [
      { src: withBase('3.fandom/fandom1.png'), alt: 'Churrrrr Official news feed screen' },
      { src: withBase('3.fandom/fandom2.png'), alt: 'Dayoff post detail screen' },
      { src: withBase('3.fandom/fandom3.png'), alt: 'Dayoff FAQ screen' },
      { src: withBase('3.fandom/fandom4.png'), alt: 'Churrrrr post detail screen' },
      { src: withBase('3.fandom/fandom5.png'), alt: 'Churrrrr FAQ screen' },
    ],
    problems: [
      {
        title: 'iOS 16 CSS Nesting compatibility bug',
        problem:
          'A live-service incident: SVG icons rendered at the wrong size, but only in staging and only ' +
          'on specific iOS 16 devices. It wasn\'t reproducible locally, so I had to dig through WebKit ' +
          "spec docs and Safari release notes directly.",
        solution:
          'Found that CSS Nesting support landed in iOS 16.5 but still wasn\'t fully applied in 16.6, ' +
          'and split the nested selectors into independent selectors per class.',
        result: 'UI rendered consistently across every iOS device.',
      },
      {
        title: 'Docker image optimization',
        problem:
          'The deployed Docker image had ballooned to 273MB, slowing down builds and deploys. I ' +
          'compared a multi-stage build against Next.js\'s standalone output option.',
        solution: 'Adopted Next.js standalone mode.',
        result: 'Cut the image from 273MB to 68MB (75%) and shortened deploy times.',
      },
      {
        title: 'TypeScript enum to union types',
        problem:
          "enum wasn't tree-shakeable, so unused code kept shipping in the bundle, and numeric enums " +
          "were weak on type safety too. I reviewed the tradeoffs with the team against a range of " +
          "references and other teams' conventions.",
        solution: 'Standardized on union types + as const as the team convention.',
        result: 'Smaller bundles, stronger type safety, and better code quality across the team.',
      },
      {
        title: 'Fixing timezone ambiguity in the admin schedule list',
        problem:
          "While reviewing the search spec for the admin schedule list page, I found that the date/time " +
          "reference was defined as KST only. Since fandom app data includes overseas schedules, times " +
          "shown in the list could read ambiguously. I raised it with the planning team, who checked " +
          "with the actual users — idol agencies — and confirmed they wanted to see local time instead. " +
          "The original requirement didn't match how it would actually be used.",
        solution:
          "After revising the spec and design, I implemented it as follows: the search filter now " +
          "operates on the user's local timezone, and the schedule display — which previously showed " +
          "only date and time — now appends the UTC offset so the registered time is conveyed exactly " +
          "as entered.",
        result:
          "Learned that \"which timezone counts as the reference\" was fundamentally a data-definition " +
          "question, and that not settling it before development makes the cost of fixing it later " +
          "much higher.",
      },
    ],
  },
  {
    slug: 'myfarm',
    year: '2025',
    title: 'MyFarm+',
    role: 'Frontend',
    summary:
      'A hybrid smart-farm management app built at Genesis Nest — from map marker rendering performance to a token-security architecture overhaul.',
    description:
      'Built at Genesis Nest as a frontend engineer between May and August 2025: a hybrid app for ' +
      'managing smart farms. From map marker rendering performance to cross-platform shared ' +
      'components, here are four core problems from development and how I solved them.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn/CVA', 'App Bridge'],
    thumbnail: withBase('2.myFarm/myfarm_logo.png'),
    images: [
      { src: withBase('2.myFarm/myfarm1.png'), alt: 'MyFarm+ login screen' },
      { src: withBase('2.myFarm/myfarm2.png'), alt: 'MyFarm+ phone verification screen' },
      { src: withBase('2.myFarm/myfarm3.png'), alt: 'MyFarm+ password setup screen' },
      { src: withBase('2.myFarm/myfarm4.png'), alt: 'MyFarm+ map-based work list screen' },
    ],
    problems: [
      {
        title: 'Map marker rendering optimization',
        problem:
          'Re-rendering every field marker on the map on each update caused a real performance hit. ' +
          "I looked at detecting only the markers whose data had actually changed, instead of " +
          "re-rendering the whole set.",
        solution:
          'Memoized the marker-rendering function with useCallback so only markers with changed data ' +
          'get updated.',
        result: 'Only changed markers re-render now, eliminating unnecessary renders.',
      },
      {
        title: 'Per-device safe-area handling via App Bridge',
        problem:
          'Notch and home-bar heights vary by device, so the app bar padding broke inconsistently ' +
          'across devices.',
        solution:
          'Used App Bridge to pass the native safe-area values through to the web view and adjust ' +
          'padding dynamically.',
        result: 'UI stayed consistent across every device.',
      },
      {
        title: 'Token security architecture',
        problem:
          'The existing localStorage approach left tokens exposed to theft via XSS. I made the case ' +
          'to the team for adopting a BFF pattern.',
        solution:
          'Used a Next.js Route Handler as the BFF and switched to HttpOnly, Secure, ' +
          'SameSite=strict cookies.',
        result: 'Blocked client-side JS from ever touching the token — zero token-related incidents since launch.',
      },
      {
        title: 'Cross-platform shared components',
        problem:
          'UI diverged between the app and web environments, and duplicate code kept piling up. I ' +
          'looked at a Shadcn UI + CVA foundation for components that work the same regardless of ' +
          'platform.',
        solution: 'Built a 33-component shared library, cutting duplicate code by roughly 40%.',
        result: 'A reusable component library that works across both the app and the web.',
      },
    ],
  },
  {
    slug: 'memorial',
    year: '2023',
    title: 'Memorial Shower',
    role: 'Frontend',
    summary:
      'Solo-built the frontend for Memorial Shower, a project commissioned by Studio Bandal — SVG interactions and a 10,000+ item dataset optimized with filtering and infinite scroll.',
    description:
      'Built the entire frontend solo for Memorial Shower, a project commissioned by Studio Bandal, ' +
      'between September and November 2023. Built the service from scratch with React, TypeScript, ' +
      "and React Query — implementing user event handlers directly on SVG for the artwork intro and " +
      "workshop pages, and optimizing a 10,000+ item dataset with filtering and infinite scroll on " +
      "the \"Dongil Kim's Closet\" page.",
    tags: ['React', 'TypeScript', 'React Query'],
    thumbnail: withBase('4.memorial/logo.svg'),
    images: [
      { src: withBase('4.memorial/memorial1.png'), alt: 'Memorial Shower home screen' },
      { src: withBase('4.memorial/memorial2.png'), alt: 'Memorial Shower artwork intro screen' },
      { src: withBase('4.memorial/memorial3.png'), alt: 'Memorial Shower workshop screen' },
      { src: withBase('4.memorial/memorial4.png'), alt: "Dongil Kim's Closet screen" },
    ],
    liveUrl: 'https://memorialshower.com/',
    more: true,
  },
  {
    slug: 'tify',
    year: '2023',
    title: 'TIFY',
    role: 'PM & Frontend Lead',
    summary:
      'A gift-funding service where you get celebrated by crowdfunding the gift you want. PM and Frontend Lead at Samsung Software Academy For Youth (SSAFY) — built a Firebase notification system and S3 image storage.',
    description:
      'Built between January and February 2023 at Samsung Software Academy For Youth (SSAFY) as PM ' +
      'and Frontend Lead: TIFY (This Is For You), a service where you get celebrated by crowdfunding ' +
      'the gift you actually want. Implemented a NoSQL notification service with Firebase, optimized ' +
      'the UI at the component level — forms, buttons, page labels — and set up an S3 bucket for ' +
      'image storage backed by a separate database.',
    tags: ['Firebase', 'AWS S3'],
    thumbnail: withBase('5.tify/logo.svg'),
    images: [
      { src: withBase('5.tify/tify1.png'), alt: 'TIFY sign-up screen' },
      { src: withBase('5.tify/tify2.png'), alt: 'TIFY gift-funding screen' },
      { src: withBase('5.tify/tify3.png'), alt: 'TIFY thank-you card screen' },
      { src: withBase('5.tify/tify4.png'), alt: 'TIFY occasion history and card archive screen' },
    ],
    repoUrls: [{ label: 'GitHub', url: 'https://github.com/beetrootfarmer/TIFY' }],
    more: true,
  },
  {
    slug: 'fins',
    year: '2022',
    title: 'FINS',
    role: 'PM & Frontend',
    summary:
      'A personal movie SNS service built around your favorite films. Won the Project Excellence Award (presented by Samsung Electronics) at SSAFY.',
    description:
      'Built in November 2022 at Samsung Software Academy For Youth (SSAFY): a personal movie SNS ' +
      'service built around your favorite films. Randomly displayed thumbnails from a pool of roughly ' +
      '14,000 movies, and implemented infinite scroll with the Intersection Observer API. Web-crawled ' +
      'movie data with Python and Pandas, built the frontend with Vue.js, JavaScript, and Vite, and ' +
      'the backend with Python, Django, and SQLite.',
    award: 'Project Excellence Award (Samsung Electronics)',
    tags: ['Vue.js', 'JavaScript', 'Vite', 'Python', 'Django', 'SQLite'],
    thumbnail: withBase('6.fins/logo.svg'),
    images: [
      { src: withBase('6.fins/fins1.png'), alt: 'FINS login/sign-up screen' },
      { src: withBase('6.fins/fins2.png'), alt: 'FINS movie grid screen' },
      { src: withBase('6.fins/fins3.png'), alt: 'FINS Finder (swipe) screen' },
      { src: withBase('6.fins/fins4.png'), alt: 'FINS my page screen' },
    ],
    repoUrls: [{ label: 'GitHub', url: 'https://github.com/beetrootfarmer/fins_mr' }],
    more: true,
  },
];
