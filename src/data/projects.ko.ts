import type { Project } from './types';
import { withBase } from '../lib/asset';

export const projectsKo: Project[] = [
  {
    slug: 'joayong',
    year: '2026',
    title: '춤춰용! 조아용~',
    role: '기획 · 개발 (단독)',
    summary:
      '용인 조아용 페스티벌 크로마키 체험 부스. 핸드트래킹으로 곡을 고르면 조아용 댄스 영상에 참여자를 실시간 합성해 유튜브로 송출. 축제 2일간 550명 이상 체험.',
    description:
      '2026년 9월부터 10월까지 단국대학교 산학협력단에서 기획부터 개발, 현장 운영까지 혼자 맡은 체험 ' +
      '부스입니다. 참여자가 손을 곡 카드 위에 올려 곡을 고르면, 그린스크린 앞에 선 참여자를 조아용 댄스 ' +
      '영상 위에 크로마키로 합성해 유튜브로 실시간 송출합니다. 축제 2일간 550명 이상이 체험했고, 운영 ' +
      '중 중단 없이 진행됐습니다. 개발 과정에서 마주한 핵심 문제 네 가지와 해결 과정은 아래와 같습니다.',
    tags: ['Next.js', 'TypeScript', 'MediaPipe', 'Python', 'OBS', 'Canvas'],
    thumbnail: withBase('7.Joayong/joayong_logo.jpg'),
    images: [
      { src: withBase('7.Joayong/joayong1.jpg'), alt: '핸드트래킹 손 커서로 곡 카드를 고르는 곡 선택 화면' },
      { src: withBase('7.Joayong/joayong2.jpg'), alt: '참여자 실루엣과 dwell 게이지가 표시된 곡 선택 화면' },
      { src: withBase('7.Joayong/joayong3.jpg'), alt: '경기장 배경에 참여자가 합성된 카운트다운 화면' },
      { src: withBase('7.Joayong/joayong4.jpg'), alt: '튤립 배경 조아용 댄스 영상에 참여자가 크로마키로 합성된 화면' },
      { src: withBase('7.Joayong/joayong5.jpg'), alt: '레몬 배경 조아용 댄스 영상에 참여자가 크로마키로 합성된 화면' },
    ],
    problems: [
      {
        title: '소켓 없이, UI가 멈춰도 이어지는 구조',
        problem:
          '처음에는 Node.js 제어 서버와 obs-websocket으로 OBS를 제어하려 했습니다. 하지만 소켓을 두면 ' +
          '재연결과 상태 재동기화 문제가 새로 생기고, 축제 현장에서 UI 하나가 멈추면 체험 전체가 멈출 수 ' +
          '있었습니다.',
        solution:
          '상태머신·씬 전환·미디어 교체·재생 종료 감지를 OBS 내장 Python 스크립트(obspython) 안으로 ' +
          '옮겼습니다. 곡 선택 화면(Next.js, OBS Browser Source)은 상태 없이 선택 확정 이벤트만 로컬 ' +
          '파일(command.json)에 기록하고, OBS 스크립트가 200ms 타이머로 이를 폴링합니다. 모든 구성 요소를 ' +
          '송출 PC 한 대의 localhost에 두어 네트워크 장애의 영향을 유튜브 업로드 구간으로 한정했습니다.',
        result:
          'UI 서버가 죽어도 진행 상태·카운트다운·로그는 영향받지 않고 운영자 단축키로 바로 우회할 수 있어, ' +
          '축제 2일간 중단 없이 운영했습니다.',
      },
      {
        title: 'MediaPipe 핸드 트래킹 기반 비접촉 곡 선택',
        problem:
          '처음에는 버튼 영역을 가린 사람 픽셀 비율로 선택을 판정했습니다. 그런데 곡 선택 화면이 카드형 ' +
          '가로 배치로 바뀌면서 카드가 화면 가운데에 오자, 참여자 몸통이 늘 카드를 가려 손을 올리지 않아도 ' +
          '선택되는 오발동이 생겼습니다.',
        solution:
          'MediaPipe HandLandmarker로 손바닥 중심(손목·손가락 뿌리 4점 평균)을 화면 커서로 바꾸고, 손이 ' +
          '실제로 닿는 범위를 화면 전체로 확대했습니다. 커서가 카드 위에 머문 정도를 dwell 판정에 넣고, ' +
          '두 개의 임계값을 둔 히스테리시스와 재발동 잠금으로 경계에서 게이지가 깜빡이거나 같은 카드가 반복 ' +
          '선택되지 않도록 했습니다.',
        result: '설명 없이도 손을 올려두기만 하면 곡이 선택되는, 오발동 없는 비접촉 UI를 만들었습니다.',
        code: {
          label: '히스테리시스 + dwell 판정',
          language: 'ts',
          code: `// 임계값을 둘로 나눠 경계에서 깜빡이지 않도록
if (ratio >= ENTER) active = true;      // 게이지 충전 시작
else if (ratio < EXIT) active = false;  // 충분히 벗어나야 리셋

// 1.8초 유지해야 확정, 확정 후에는 손을 떼야 다시 활성화
if (active && !locked && now - since >= DWELL_MS) {
  locked = true;
  onSelect(card);
}`,
        },
      },
      {
        title: '조명 변화에 강한 그린스크린 실루엣',
        problem:
          '참여자에게 자기 위치를 보여주는 실루엣을 RGB 고정값으로 판정했더니, 그림자·주름 진 그린스크린을 ' +
          '사람으로 잘못 세는 문제가 있었습니다. 현장 조명은 리허설 때와 또 달라질 수 있었습니다.',
        solution:
          'Canvas getImageData로 읽은 픽셀을 HSV로 변환해, 밝기(V)가 떨어져도 색상(H)이 초록이면 배경으로 ' +
          '판정했습니다. 설치 시 단축키 한 번으로 현장 그린스크린 색을 샘플링해 색상은 평균 ±3σ, 채도·밝기 ' +
          '하한은 관측 하위값 기준으로 범위를 보정하고, 영역에 사람이 있으면 보정을 거부하도록 했습니다.',
        result: '그림자와 현장 조명 변화에도 실루엣이 안정적으로 표시되고, 현장에서 바로 재보정할 수 있게 됐습니다.',
      },
      {
        title: 'OBS 스크립트의 GIL 교착과 일시정지 무시 문제',
        problem:
          '운영자가 씬을 직접 바꾸는 상황을 감지하려고 씬 변경 콜백을 등록했더니 OBS 전체가 멈췄습니다. ' +
          '그래픽 스레드의 타이머가 GIL을 쥔 채 UI 스레드를 기다리는 동안, UI 스레드는 콜백을 실행하려고 GIL을 ' +
          '기다리는 교착 상태였습니다. 또 카운트다운 중 영상을 멈춰 두어도, restart가 미디어 스레드에서 늦게 ' +
          '처리되면서 일시정지를 풀어 버렸습니다.',
        solution:
          '콜백을 쓰지 않고 기존 폴링 타이머 안에서 현재 씬을 직접 확인하도록 바꾸고, 스크립트가 직접 씬을 ' +
          '바꾼 직후 1.5초는 판정하지 않게 했습니다. 카운트다운 동안에는 50ms 타이머로 재생 상태를 감시해 ' +
          '재생이 감지될 때마다 다시 멈추도록 했습니다.',
        result: 'OBS가 멈추는 문제와 카운트다운 중 영상이 먼저 재생되는 문제를 모두 해결했습니다.',
      },
    ],
    repoUrls: [{ label: 'GitHub', url: 'https://github.com/beetrootfarmer/Joayong_dance' }],
  },
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
      '있습니다. 개발 과정에서 마주한 핵심 문제 다섯 가지와 해결 과정은 아래와 같습니다.',
    award: '국민체육진흥공단 공공데이터 경진대회 2위',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MediaPipe', 'Node.js', 'Docker'],
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
        title: '브라우저 실시간 포즈 추정과 렌더링 최적화',
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
      {
        title: 'Chart.js Radar 6각형 커스텀',
        problem:
          '국민체력100은 6개 항목으로 체력을 평가하는데, Chart.js Radar 차트는 기본적으로 원형 그리드로 ' +
          '그려져 6각형 시각화가 불가능했습니다. circular: false 옵션을 적용해봤지만 그리드선이 데이터 ' +
          '폴리곤과 어긋나 그대로 쓸 수 없었습니다. 등급 체계도 문제였습니다. 국민체력100은 1등급이 ' +
          '가장 좋은데, 레이더 차트는 값이 클수록 바깥으로 뻗기 때문에 그대로 넣으면 잘하는 항목이 ' +
          '안쪽으로 들어가버립니다.',
        solution:
          '내장 그리드를 투명 처리해 걷어내고, 6각형 그리드를 SVG 레이어로 직접 그려 차트 아래에 ' +
          '배치했습니다. 등급은 역매핑 테이블로 변환해 1등급이 가장 바깥에 오도록 했고, 기본 애니메이션을 ' +
          '끈 뒤 requestAnimationFrame 기반 선형 보간으로 직접 구현해 그리드와 폴리곤이 어긋나지 않게 ' +
          '했습니다.',
        result: '정확한 6각형 그리드 위에 등급이 직관적으로 표현되고, 진입 시 부드럽게 펼쳐지는 애니메이션을 확보했습니다.',
        code: {
          label: '6각형 그리드 + 등급 역매핑',
          language: 'ts',
          code: `// 내장 그리드를 숨기고 hex.svg 레이어로 대체
grid: { color: 'transparent' }

// 등급 역매핑 — 1등급(최고)이 가장 바깥에 오도록
const GRADE_TO_VALUE = [0, 3.6, 2.9, 2.2, 1.2, 0];

// 기본 애니메이션 대신 rAF 선형 보간
animation: false → requestAnimationFrame(animate)`,
        },
      },
      {
        title: '수상 이후, 서비스로 만들기까지',
        problem:
          '공모전 수상 이후 실제 서비스로 출시하기 위해 백엔드를 새로 구축해야 했습니다. Express는 ' +
          '자유도가 높은 만큼 혼자 개발하면 구조가 흐트러지기 쉽다고 판단했습니다.',
        solution:
          'Module·Controller·Service 구조가 강제되고 TypeScript를 자연스럽게 지원하는 Nest.js를 ' +
          '선택했습니다. 국민체력100 기준에 따라 성별·연령대별 6항목 등급을 계산하는 로직을 구현하고, ' +
          'Gemini API로 약점 분석 → 프롬프트 생성 → JSON 파싱 순의 운동 추천 알고리즘을 만들었습니다. ' +
          '응답이 예상 형식을 벗어날 때를 대비해 fallback도 함께 설계했습니다. 배포는 Cloud Run ' +
          '멀티스테이지 Docker 빌드로 자동화했습니다.',
        result: '기획부터 프론트엔드, 백엔드, 앱스토어 심사까지 2개월 만에 완주해 iOS에 정식 출시했습니다.',
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
      '팬덤 커뮤니티 앱 「Churrrrr」·「Dayoff」와 어드민 서비스 개발. iOS 16 렌더링 버그 대응부터 Docker 이미지 75% 감축까지.',
    description:
      '2024년 4월부터 2025년 4월까지 제네시스네스트에서 프론트엔드로 참여해 만든 팬덤 커뮤니티 앱 ' +
      '「Churrrrr」, 「Dayoff」와 어드민 서비스입니다. 실서비스 장애 대응부터 배포 최적화, 팀 코딩 ' +
      '컨벤션 정립까지, 개발 과정에서 마주한 핵심 문제 네 가지와 해결 과정은 아래와 같습니다.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker', 'CSS'],
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
      {
        title: '어드민 스케줄 타임존 처리 개선',
        problem:
          '어드민 스케줄 목록 페이지의 검색 기획을 검토하던 중, 기획서에 날짜·시간 기준이 KST로만 ' +
          '정의되어 있다는 것을 확인했습니다. 팬덤 앱 특성상 데이터에 해외 스케줄이 포함되는데, 목록에 ' +
          '표출되는 시간이 모호하게 보일 수 있다고 판단했습니다. 기획팀에 문의했고, 기획팀이 실사용자인 ' +
          '아이돌 기획사에 확인한 결과 현지 시간 기준으로 보고 싶다는 요구를 확인했습니다. 처음 정의된 ' +
          '요구사항이 실사용 맥락과 달랐던 것입니다.',
        solution:
          '기획서와 디자인을 수정한 뒤 다음과 같이 구현했습니다. 검색 필터는 사용자 로컬 타임존 기준으로 ' +
          '동작하도록 했고, 스케줄 표출은 기존에 날짜·시간만 노출하던 것을 UTC 오프셋을 병기해 등록된 ' +
          '시각 그대로 전달하도록 바꿨습니다.',
        result:
          "'기준 시간을 무엇으로 볼 것인가'는 데이터 정의의 문제였고, 개발 전에 확인하지 않으면 이후 " +
          '수정 비용이 훨씬 커진다는 것을 배웠습니다.',
      },
    ],
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
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn/CVA', 'App Bridge'],
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
  },
  {
    slug: 'memorial',
    year: '2023',
    title: 'Memorial Shower',
    role: 'Frontend',
    summary:
      '스튜디오 반달이 의뢰한 메모리얼 샤워 서비스의 프론트엔드를 단독 개발. SVG 인터랙션과 1만 건 이상 데이터의 필터링·무한스크롤 최적화.',
    description:
      '2023년 9월부터 11월까지 스튜디오 반달이 의뢰한 메모리얼 샤워 서비스의 프론트엔드를 단독으로 ' +
      '개발했습니다. React·TypeScript·React Query로 서비스 전체를 새로 구축했고, 작품 소개와 워크숍 ' +
      '페이지에서는 SVG 위에 사용자 이벤트 핸들러를 구현했습니다. \'김동일의 옷장\' 페이지에서는 1만 건이 ' +
      '넘는 데이터를 필터링 기능과 무한 스크롤로 최적화했습니다.',
    tags: ['React', 'TypeScript', 'React Query'],
    thumbnail: withBase('4.memorial/logo.svg'),
    images: [
      { src: withBase('4.memorial/memorial1.png'), alt: 'Memorial Shower 메인 화면' },
      { src: withBase('4.memorial/memorial2.png'), alt: 'Memorial Shower 작품 소개 화면' },
      { src: withBase('4.memorial/memorial3.png'), alt: 'Memorial Shower 워크숍 화면' },
      { src: withBase('4.memorial/memorial4.png'), alt: '김동일의 옷장 화면' },
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
      '원하는 선물을 펀딩받아 축하받는 서비스. 삼성청년SW아카데미에서 PM 겸 Frontend Lead로 참여해 Firebase 알림 시스템과 S3 이미지 스토리지를 구축.',
    description:
      '2023년 1월부터 2월까지 삼성청년SW아카데미에서 PM 겸 Frontend Lead로 참여해 만든, 원하는 선물을 ' +
      '펀딩받아 축하받는 서비스입니다. Firebase로 NoSQL 기반 알림 서비스를 구현했고, 폼·버튼·페이지 ' +
      '라벨 등 컴포넌트 단위로 UI를 최적화했습니다. S3 버킷을 생성해 이미지 파일을 저장하고 별도로 ' +
      '분리된 DB를 관리했습니다.',
    tags: ['Firebase', 'AWS S3'],
    thumbnail: withBase('5.tify/logo.svg'),
    images: [
      { src: withBase('5.tify/tify1.png'), alt: 'TIFY 회원가입 화면' },
      { src: withBase('5.tify/tify2.png'), alt: 'TIFY 선물 축하하기(펀딩) 화면' },
      { src: withBase('5.tify/tify3.png'), alt: 'TIFY 감사카드 보내기 화면' },
      { src: withBase('5.tify/tify4.png'), alt: 'TIFY 기념일 히스토리 및 카드함 화면' },
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
      '선호하는 영화를 기반으로 한 나만의 영화 SNS 서비스. 삼성청년SW아카데미 프로젝트 우수상(삼성전자) 수상.',
    description:
      '2022년 11월 삼성청년SW아카데미에서 진행한, 선호하는 영화를 기반으로 한 나만의 영화 SNS ' +
      '서비스입니다. 1만 4천여 개의 영화 썸네일을 랜덤하게 표출하고, Intersection Observer로 무한 ' +
      '스크롤을 구현했습니다. Python·Pandas로 영화 데이터를 웹크롤링했고, Vue.js·JavaScript·Vite로 ' +
      '프론트엔드를, Python·Django·SQLite로 백엔드를 구축했습니다.',
    award: '삼성전자 프로젝트 우수상',
    tags: ['Vue.js', 'JavaScript', 'Vite', 'Python', 'Django', 'SQLite'],
    thumbnail: withBase('6.fins/logo.svg'),
    images: [
      { src: withBase('6.fins/fins1.png'), alt: 'FINS 로그인/회원가입 화면' },
      { src: withBase('6.fins/fins2.png'), alt: 'FINS 영화 목록 화면' },
      { src: withBase('6.fins/fins3.png'), alt: 'FINS Finder(스와이프) 화면' },
      { src: withBase('6.fins/fins4.png'), alt: 'FINS 마이페이지 화면' },
    ],
    repoUrls: [{ label: 'GitHub', url: 'https://github.com/beetrootfarmer/fins_mr' }],
    more: true,
  },
];
