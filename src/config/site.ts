// 선생님 내용은 이 파일에만 적는다. scene(그림 장면)은 영어로 쓰면 그림이 잘 나온다.
export type IconName =
  | "community"
  | "naver-blog"
  | "instagram"
  | "kakao-chat"
  | "kakao-group"
  | "download"
  | "manual"
  | "privacy"
  | "school"
  | "docs"
  | "contact"
  | "magazine"
  | "code"
  | "game";

export type Thumb =
  | { kind: "image"; src: string; alt: string }
  | { kind: "icon"; icon: IconName };

export type LinkItem = {
  id: string; // 영문 소문자와 하이픈. 그림 파일 이름(art-raw/<id>.png)이 된다.
  name: string;
  tag: string; // 짧은 분류, 예: "퀴즈 게임"
  description?: string;
  href: string;
  thumb?: Thumb;
  scene?: string; // 그림 지시서에 들어갈 장면 설명
  cover?: string; // 그림 경로, 예: "/visuals/covers/quiz-game" (npm run art 뒤에 채운다)
};

export type LinkCard =
  | {
      kind: "group";
      id: string;
      number: string;
      name: string;
      shortName: string;
      description: string;
      thumb: Thumb;
      emblem?: string; // 묶음 표장 그림, 예: "/visuals/emblems/class-apps.webp"
      emblemScene?: string; // 표장 그림을 지시서에 넣고 싶을 때만
      items: LinkItem[];
    }
  | {
      kind: "link";
      id: string;
      number: string;
      name: string;
      description: string;
      href: string;
      thumb: Thumb;
    };

export type Credit = { text: string; href?: string };

export type Profile = {
  kicker: string; // 맨 위 칩과 브라우저 탭 제목, 예: "○○고 교사 홍길동"
  heroTitle: string; // 큰 제목
  description: string; // 한 줄 소개
  hero: "image" | "none"; // "image"면 첫 화면 조형물 그림(art-raw/hero-object.png)을 보여 준다
  heroScene: string; // 조형물 그림 장면
  backgroundScene?: string; // 첫 화면 배경 그림(선택)
  credits: Credit[]; // 화면 맨 아래 출처 문구. 비어 있으면 보이지 않는다
};

export const profile: Profile = {
  kicker: "○○고 교사 홍길동",
  heroTitle: "Hong Lab",
  description: "수업에서 바로 쓰는 웹앱과 자료를 모아 둔 홍길동 선생님의 쇼룸",
  hero: "image",
  heroScene:
    "A floating miniature island holding a tiny school building, a glowing lightbulb tower and small paper airplanes circling around it, shown as one standalone sculpture.",
  credits: []
};

export const cards: LinkCard[] = [
  {
    kind: "group",
    id: "dorms-activity",
    number: "01",
    name: "도름스 커뮤니티 나의 활동",
    shortName: "도름스 활동",
    description: "DoRms에서 나누고 있는 나의 활동을 모아두는 곳",
    thumb: { kind: "icon", icon: "community" },
    items: [
      {
        id: "dorms-profile",
        name: "내 DoRms 프로필",
        tag: "프로필",
        description: "DoRms에 쓴 글과 만든 앱을 한곳에서 모아 보는 프로필",
        href: "https://dorms.school/",
        thumb: { kind: "icon", icon: "community" },
        scene: "A miniature community bulletin board with small colorful blank note cards pinned to it and a tiny desk lamp, a cozy sharing corner."
      },
      {
        id: "sample-post",
        name: "예시 글: 수업 자료 나눔",
        tag: "자료 나눔",
        description: "DoRms에 올린 글 주소로 바꿔 주세요",
        href: "https://dorms.school/board",
        thumb: { kind: "icon", icon: "docs" },
        scene: "A miniature stack of neatly bound lesson handouts tied with a ribbon, a small open folder and a pencil cup."
      }
    ]
  },
  {
    kind: "group",
    id: "class-apps",
    number: "02",
    name: "수업에서 바로 쓰는 웹앱",
    shortName: "수업 웹앱",
    description: "설치 없이 링크 하나로 여는 수업용 웹앱",
    thumb: { kind: "icon", icon: "game" },
    items: [
      {
        id: "quiz-game",
        name: "예시 앱: 개념 퀴즈 게임",
        tag: "퀴즈 게임",
        description: "수업 개념을 퀴즈로 다지는 게임",
        href: "https://example.com/quiz",
        thumb: { kind: "icon", icon: "game" },
        scene: "A miniature game show stage with a big round buzzer button, colorful blank quiz cards and tiny spotlights."
      },
      {
        id: "class-timer",
        name: "예시 앱: 활동 타이머",
        tag: "수업 도구",
        description: "모둠 활동 시간을 크게 보여 주는 타이머",
        href: "https://example.com/timer",
        thumb: { kind: "icon", icon: "school" },
        scene: "A miniature classroom desk with a large friendly hourglass, a round timer with a blank face and small colorful sticky notes."
      },
      {
        id: "idea-board",
        name: "예시 앱: 아이디어 모음판",
        tag: "참여 도구",
        description: "학생 생각을 한 화면에 모으는 게시판",
        href: "https://example.com/board",
        thumb: { kind: "icon", icon: "magazine" },
        scene: "A miniature corkboard covered with blank colorful speech-bubble notes connected by thin strings, with a tiny step ladder beside it."
      }
    ]
  },
  {
    kind: "link",
    id: "instagram",
    number: "03",
    name: "인스타그램",
    description: "만드는 과정과 소식을 짧게 남기는 곳",
    href: "https://www.instagram.com/",
    thumb: { kind: "icon", icon: "instagram" }
  },
  {
    kind: "link",
    id: "contact",
    number: "04",
    name: "연락처",
    description: "teacher@example.com",
    href: "mailto:teacher@example.com",
    thumb: { kind: "icon", icon: "contact" }
  }
];
