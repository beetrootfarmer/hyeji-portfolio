import type { Project } from './types';
import { withBase } from '../lib/asset';

export const projectsKo: Project[] = [
  {
    slug: 'beeve',
    year: '2025',
    title: 'Beeve',
    role: 'PM & Frontend',
    summary:
      '국민체력100 공공데이터를 활용해, 별도 장비 없이 스마트폰 카메라와 센서만으로 체력을 측정하는 서비스. iOS 앱스토어 정식 출시.',
    description:
      '2025년 9월부터 진행 중인 프로젝트로, PM 겸 프론트엔드로 참여해 국민체력100 공공데이터를 ' +
      '기반으로 스마트폰 카메라와 센서만으로 체력을 측정하는 서비스를 만들었습니다. 이 프로젝트로 ' +
      '국민체육진흥공단 공공데이터 경진대회에서 2위를 수상했으며, 현재 iOS 앱스토어에 정식 출시되어 ' +
      '있습니다. 개발 과정에서 마주한 핵심 문제 세 가지와 해결 과정은 아래와 같습니다.',
    tags: ['Next.js', 'TypeScript', 'MediaPipe', 'Node.js', 'PostgreSQL', 'Docker'],
    thumbnail: withBase('1.beeve/beeve_logo.png'),
    images: [
      { src: withBase('1.beeve/beeve1.jpg'), alt: 'Beeve 6-Data 레이더 점수 화면' },
      { src: withBase('1.beeve/beeve3.jpg'), alt: 'Beeve AI 일정 관리 화면' },
      { src: withBase('1.beeve/beeve4.jpg'), alt: 'Beeve 체력 통계 화면' },
      { src: withBase('1.beeve/beeve2.jpg'), alt: 'Beeve 옷 기록 화면' },
    ],
    problems: [
      {
        title: 'rPPG 기반 심박수 측정',
        problem:
          '모바일 브라우저만으로 심박수를 측정하려면 신호 노이즈와 조명 문제를 해결해야 했습니다. ' +
          '기존 rPPG 라이브러리는 모바일 브라우저 환경 제약 때문에 그대로 쓸 수 없어 직접 구현하기로 했습니다.',
        solution:
          'MediaStream API와 torch constraint로 플래시를 켠 뒤, 프레임마다 적색 채널 평균값을 추출해 ' +
          '혈류 신호로 활용하는 파이프라인을 설계했습니다. 5점 이동평균으로 노이즈를 걸러내고, 동적 ' +
          '임계값(최댓값의 80%)과 최소 간격 기반으로 피크를 감지해 BPM을 역산했습니다. 15초 구간을 ' +
          '3분할해 구간별로 독립 계산한 뒤 평균을 내는 방식으로 노이즈에 강건하게 만들었습니다.',
        result: 'BPM 유효 범위 필터링으로 outlier를 제거하고, 3구간 평균으로 안정적인 측정값을 확보했습니다.',
      },
      {
        title: '가속도계 기반 반응속도 측정',
        problem:
          '별도 장비 없이 스마트폰 센서만으로 반응속도를 측정하려면 기기별 권한 모델과 센서 노이즈 ' +
          '처리가 필요했습니다. iOS 13+의 DeviceMotionEvent 권한 모델(requestPermission)과 Android ' +
          '분기 처리가 특히 까다로웠습니다.',
        solution:
          '합성 가속도(√x²+y²+z²)를 계산해 안정성 점수가 90점 이상일 때 측정을 자동으로 시작하도록 ' +
          '설계했습니다. Web Audio API Oscillator로 카운트다운 신호음을 구현하고, performance.now() ' +
          '기준으로 신호와 움직임 감지 사이의 시간차를 반응속도로 확정했습니다. useRef로 클로저 문제를 ' +
          '해결하고, 100ms 이하의 선행 반응은 코드 레벨에서 자동으로 차단했습니다.',
        result: '3회 측정 중 유효 최솟값을 채택하고, 선행 반응을 자동 무효 처리해 측정 신뢰도를 확보했습니다.',
      },
      {
        title: 'MediaPipe 포즈 추정 렌더링 최적화',
        problem:
          'detectForVideo()를 매 프레임 호출하니 CPU/GPU 부하로 프레임 드롭이 발생했습니다. setInterval은 ' +
          '브라우저 렌더링 사이클과 무관하게 실행되어 타이밍이 어긋난다는 것도 문제였습니다.',
        solution:
          '비디오 프레임에 변화가 없으면 추론 자체를 건너뛰고, GPU로 추론을 위임해 속도를 끌어올렸습니다.',
        result: '중복 추론을 제거해 60fps의 자연스러운 렌더링을 달성했습니다.',
        code: {
          label: '프레임 스킵 + GPU 위임',
          language: 'ts',
          code: `// 프레임 변화 없으면 추론 skip
if (video.currentTime === lastVideoTime) {
  requestAnimationFrame(detect);
  return;
}
// GPU 위임으로 추론 속도 향상
PoseLandmarker.createFromOptions({
  baseOptions: {
    delegate: 'GPU', // CPU 대신 GPU 추론
  },
  runningMode: 'VIDEO', // 연속 프레임 최적화
});`,
        },
      },
    ],
    liveUrl: 'https://apps.apple.com/kr/app/beeve/id6759857773',
    repoUrl: '',
  },
  {
    slug: 'myfarm',
    year: '2025',
    title: '마이팜플러스',
    role: 'Frontend',
    summary:
      '제네시스네스트에서 개발한 스마트 농사 관리 서비스 하이브리드 앱. 지도 마커 렌더링 최적화부터 토큰 보안 아키텍처 개편까지.',
    description:
      '2025년 5월부터 8월까지 제네시스네스트에서 프론트엔드로 참여해 만든 스마트 농사 관리 서비스 ' +
      '하이브리드 앱입니다. 지도 마커 렌더링 성능 개선부터 크로스플랫폼 공통 컴포넌트 설계까지, ' +
      '개발 과정에서 마주한 핵심 문제 네 가지와 해결 과정은 아래와 같습니다.',
    tags: ['Next.js', 'TypeScript', 'Shadcn/CVA', 'App Bridge'],
    thumbnail: withBase('2.myFarm/myfarm_logo.png'),
    images: [
      { src: withBase('2.myFarm/myfarm1.png'), alt: '마이팜플러스 로그인 화면' },
      { src: withBase('2.myFarm/myfarm2.png'), alt: '마이팜플러스 휴대폰 번호 인증 화면' },
      { src: withBase('2.myFarm/myfarm3.png'), alt: '마이팜플러스 비밀번호 설정 화면' },
      { src: withBase('2.myFarm/myfarm4.png'), alt: '마이팜플러스 지도 기반 작업 목록 화면' },
    ],
    problems: [
      {
        title: '지도 마커 렌더링 최적화',
        problem:
          '지도 위 필드 마커 전체를 매번 렌더링해 성능 저하가 발생했습니다. 전체 마커를 재렌더링하는 ' +
          '대신 변경된 데이터만 감지하는 방식을 검토했습니다.',
        solution:
          'useCallback으로 마커 렌더링 함수를 메모이제이션해, 변경된 데이터가 있는 마커만 업데이트하도록 ' +
          '최적화했습니다.',
        result: '변경된 마커만 업데이트해 불필요한 렌더링을 제거했습니다.',
      },
      {
        title: '앱브릿지 기기별 Safe Area 처리',
        problem: '기기마다 노치·홈바 높이가 달라 앱바 여백이 기기별로 깨지는 문제가 있었습니다.',
        solution:
          '앱브릿지(App Bridge)로 네이티브에서 safe area 값을 웹으로 전달받아 동적으로 여백을 ' +
          '조정했습니다.',
        result: '전 기기에서 일관된 UI를 유지했습니다.',
      },
      {
        title: '토큰 보안 구조 개선',
        problem:
          '기존 로컬스토리지 방식은 XSS 공격 시 토큰 탈취가 가능한 구조였습니다. BFF 패턴 도입 ' +
          '필요성을 정리해 팀에 제안했습니다.',
        solution:
          'Next.js Route Handler를 BFF로 활용하고, HttpOnly·Secure·SameSite=strict 쿠키로 ' +
          '전환했습니다.',
        result: '클라이언트 JS에서 토큰 접근을 차단해, 배포 후 토큰 관련 오류 0건을 달성했습니다.',
      },
      {
        title: '크로스플랫폼 공통 컴포넌트 설계',
        problem:
          '앱·웹 환경마다 UI가 달라져 중복 코드가 누적되고 있었습니다. Shadcn UI + CVA 기반으로 ' +
          '플랫폼과 무관하게 동작하는 컴포넌트 설계를 검토했습니다.',
        solution: '33개 공통 컴포넌트를 개발해 중복 코드를 약 40% 감소시켰습니다.',
        result: '앱·웹 양쪽에서 재사용 가능한 컴포넌트 라이브러리를 구축했습니다.',
      },
    ],
    liveUrl: '',
    repoUrl: '',
  },
  {
    slug: 'fandom',
    year: '2024',
    title: 'Churrrrr · Dayoff',
    role: 'Frontend',
    summary:
      '팬덤 커뮤니티 앱 「Churrrrr」·「Dayoff」와 어드민 서비스 개발. iOS 16 렌더링 버그 대응부터 Docker 이미지 75% 감축까지.',
    description:
      '2024년 4월부터 2025년 4월까지 제네시스네스트에서 프론트엔드로 참여해 만든 팬덤 커뮤니티 앱 ' +
      '「Churrrrr」, 「Dayoff」와 어드민 서비스입니다. 실서비스 장애 대응부터 배포 최적화, 팀 코딩 ' +
      '컨벤션 정립까지, 개발 과정에서 마주한 핵심 문제 세 가지와 해결 과정은 아래와 같습니다.',
    tags: ['Next.js', 'TypeScript', 'Docker', 'CSS'],
    thumbnail: withBase('3.fandom/fandom_logo.png'),
    images: [
      { src: withBase('3.fandom/fandom1.png'), alt: 'Churrrrr Official 뉴스 피드 화면' },
      { src: withBase('3.fandom/fandom2.png'), alt: 'Dayoff 게시물 상세 화면' },
      { src: withBase('3.fandom/fandom3.png'), alt: 'Dayoff 자주 묻는 질문 화면' },
      { src: withBase('3.fandom/fandom4.png'), alt: 'Churrrrr 게시물 상세 화면' },
      { src: withBase('3.fandom/fandom5.png'), alt: 'Churrrrr 자주 묻는 질문 화면' },
    ],
    problems: [
      {
        title: 'iOS 16 CSS Nesting 호환성 버그 해결',
        problem:
          '스테이징 환경에서만, 그것도 특정 iOS 16 기기에서 SVG 아이콘 크기가 비정상적으로 표시되는 ' +
          '실서비스 장애가 발생했습니다. 로컬에서는 재현이 안 돼 웹킷 표준 문서와 Safari 릴리스 노트를 ' +
          '직접 추적해야 했습니다.',
        solution:
          'CSS Nesting이 iOS 16.5에서 지원되기 시작했지만 16.6에서도 완전히 적용되지는 않는다는 것을 ' +
          '확인하고, 중첩 선택자를 각 클래스별 독립 선택자로 분리했습니다.',
        result: '전 iOS 기기에서 일관된 UI 렌더링을 확보했습니다.',
      },
      {
        title: 'Docker 이미지 최적화',
        problem:
          '배포 시 Docker 이미지 크기가 273MB에 달해 빌드·배포 시간과 용량 문제가 있었습니다. ' +
          'multi-stage build와 Next.js standalone 옵션을 비교 검토했습니다.',
        solution: 'Next.js standalone 모드를 적용했습니다.',
        result: '이미지 크기를 273MB에서 68MB로 75% 줄이고, 배포 시간도 단축했습니다.',
      },
      {
        title: 'TypeScript enum → Union 타입 전환',
        problem:
          'enum은 트리 셰이킹이 되지 않아 사용하지 않는 코드까지 번들에 포함됐고, 숫자형 enum은 타입 ' +
          '안정성도 떨어졌습니다. 다양한 레퍼런스와 다른 팀 사례를 팀원들과 함께 검토했습니다.',
        solution: 'Union 타입 + as const 조합으로 패턴을 정리해 팀 표준으로 약속했습니다.',
        result: '번들 최적화와 타입 안정성이 향상되고, 팀 전체 코드 품질이 개선됐습니다.',
      },
    ],
    liveUrl: '',
    repoUrl: '',
  },
];
