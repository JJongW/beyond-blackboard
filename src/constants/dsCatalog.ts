/**
 * 크레파스 Design System 카탈로그
 * IA·문서 구조: Seed Design (https://seed-design.io) Foundations / Patterns / Components
 * 비주얼 톤: 크레파스 파스텔 Soft UI (세이지 brand ~10%)
 * 생성: 스크립트 — 내용 수정 시 이 파일 또는 생성 스크립트 갱신
 */

/** CrepassIcon 이름 레지스트리 — SVG Line/Fill (CrepassGlyphIcon). PNG 스티커 미사용 */
export const CREPASS_ICON_NAMES = [
  "home",
  "documents",
  "students",
  "attendance",
  "grading",
  "records",
  "notifications",
  "bell",
  "settings",
  "add",
  "search",
  "close",
  "chevron-left",
  "chevron-right",
  "chevron-down",
  "check",
  "trash",
  "calendar",
  "clipboard",
  "notebook",
  "user",
  "help",
  "menu",
  "crayon",
  "star",
  "star-outline",
] as const;

export type DsTable = { headers: string[]; rows: string[][] };

export type DsSection = {
  id: string;
  title: string;
  body?: string;
  bullets?: string[];
  table?: DsTable;
};

export type DsRelated = { title: string; href: string };

export type DsDoc = {
  slug: string;
  title: string;
  description: string;
  sections: DsSection[];
  dos?: string[];
  donts?: string[];
  related?: DsRelated[];
  demo?:
    | "button"
    | "chip"
    | "input"
    | "avatar"
    | "empty"
    | "skeleton"
    | "badge"
    | "controls"
    | "checkbox"
    | "radio"
    | "switch"
    | "select"
    | "tabs"
    | "menu"
    | "progress"
    | "segmented"
    | "list"
    | "loading"
    | "icons"
    | "color"
    | "type"
    | "spacing"
    | "elevation"
    | "motion"
    | "accordion"
    | "divider"
    | "page-banner"
    | "help-bubble"
    | "reaction"
    | "tag-group"
    | "fab"
    | "slider"
    | "attachment"
    | "bottom-sheet"
    | "side-panel"
    | "time-picker"
    | "quantity"
    | "placeholder"
    | "footer"
    | "input-button"
    | "image-frame"
    | "identity"
    | "scroll-fog"
    | "contextual-fab"
    | "menu-sheet"
    | "card";
};

export type DsGroupKey = "foundations" | "patterns" | "components";

export const DS_FOUNDATIONS: DsDoc[] = [
  {
    slug: "color",
    title: "Color",
    description:
      "크레파스 색상 시스템은 역할 기반 색상과 파스텔 팔레트로 계층·상태·브랜드를 표현합니다. Seed Color IA를 따르되, 형광 그린 대신 세이지·크레용 톤을 씁니다.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: "역할 기반 색상은 UI 요소와 기능의 관계를 고정해 예측 가능한 Soft UI를 만듭니다. 임의의 hex를 쓰지 말고 역할 토큰(--cp-*)을 사용합니다.",
      },
      {
        id: "role-based",
        title: "Role Based Color",
        body: "Ink / Surface / Border / Brand / Danger / Warning / Focus 역할로 나눕니다. Brand는 화면의 약 10%만 — CTA, active, 오늘 표시, focus ring.",
        bullets: [
          "접근성: 본문 ink on surface 조합을 기본으로 유지",
          "업데이트: 값이 아니라 의미(역할) 단위로 교체",
          "테마: 역할만 바꾸면 라이트 Soft UI를 유지한 채 확장 가능",
        ],
      },
      {
        id: "palette",
        title: "Palette Color",
        body: "역할로 표현하기 어려운 예외(차트 시리즈, 과목 태그 등)에만 파스텔 팔레트를 씁니다. 순수 #000/#FFF는 쓰지 않습니다.",
      },
    ],
    demo: "color",
    dos: ["CTA·active·focus에만 brand", "본문·아이콘 기본은 ink"],
    donts: ["배경·테두리 전면에 brand", "구 #1CCF60 형광톤 재도입"],
  },
  {
    slug: "design-token",
    title: "Design Token",
    description:
      "디자인 토큰은 디자인 결정을 사람과 기계가 같은 이름으로 공유하는 방법입니다. 크레파스는 designTokens.ts와 globals.css --cp-* 를 단일 출처로 둡니다.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: "토큰 계층: Primitive(값) → Semantic(역할) → Component(cp-btn 등). 문서·코드·Figma가 같은 이름을 쓰도록 맞춥니다.",
      },
      {
        id: "reference",
        title: "Reference",
        body: "주요 시맨틱 토큰은 Color, Spacing, Radius, Elevation, Motion, Type입니다. 컴포넌트 클래스는 시맨틱 토큰만 참조합니다.",
        table: {
          headers: ["Layer", "예시", "위치"],
          rows: [
            ["Primitive", "#3D8B6E", "designTokens.ts COLOR"],
            ["Semantic", "--cp-brand", "globals.css :root"],
            ["Component", ".cp-btn-primary", "globals.css @layer"],
          ],
        },
      },
    ],
    dos: [
      "새 색/간격은 토큰부터 추가",
      "하드코딩 hex를 컴포넌트에 직접 넣지 않기",
    ],
    donts: ["페이지마다 다른 그림자·라디우스 즉흥 지정"],
  },
  {
    slug: "typography",
    title: "Typography",
    description:
      "타이포는 콘텐츠를 명확히 전달하는 요소입니다. 교사 Soft UI이므로 본문 16px(t5) 이상을 기본으로 합니다. Pretendard를 본문·UI에 사용합니다.",
    sections: [
      {
        id: "overview",
        title: "개요",
        body: "Seed처럼 크기·줄높이·두께를 토큰으로 두고, 시맨틱 스타일(cp-h1, cp-h2, body, caption)로 조합합니다.",
      },
      {
        id: "font",
        title: "글꼴",
        body: "웹: Pretendard → Apple SD Gothic Neo → Malgun Gothic. 디스플레이용 별도 세리프는 쓰지 않습니다(템플릿형 크림+세리프 룩 회피).",
      },
      {
        id: "scale",
        title: "시맨틱 스케일",
        table: {
          headers: ["Style", "Size", "Line", "Weight", "용도"],
          rows: [
            ["h1", "26px", "34", "600", "페이지 제목"],
            ["h2", "20px", "28", "600", "섹션"],
            ["h3", "17px", "26", "600", "카드 제목"],
            ["body", "16px", "26", "400", "본문 최소"],
            ["caption", "14px", "22", "400", "보조·메타"],
          ],
        },
      },
    ],
    demo: "type",
    dos: ["본문 16px+", "시맨틱 클래스 우선"],
    donts: ["본문 14px 이하", "임의 rem/px 혼용으로 계층 깨기"],
  },
  {
    slug: "spacing",
    title: "Spacing",
    description:
      "Spacing은 컴포넌트·콘텐츠 간 간격을 표현합니다. 4px 그리드(SPACE 1–12)를 따릅니다.",
    sections: [
      {
        id: "scale",
        title: "스케일",
        body: "1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 10=40 · 12=48. 페이지 패딩 32, 섹션 갭 32를 기본으로 합니다.",
      },
    ],
    demo: "spacing",
    dos: ["인접 요소는 같은 스케일 단계로"],
    donts: ["홀수 px(7, 13) 즉흥 간격"],
  },
  {
    slug: "radius",
    title: "Radius",
    description:
      "Radius는 모서리 둥글기입니다. Soft UI이지만 과한 pill은 액션·칩에만 제한합니다.",
    sections: [
      {
        id: "tokens",
        title: "토큰",
        table: {
          headers: ["Token", "Value", "용도"],
          rows: [
            ["sm", "8px", "버튼·인풋·리스트"],
            ["md", "12px", "카드"],
            ["lg", "16px", "시트·대형 패널"],
            ["full", "9999", "아바타·아이콘 버튼"],
          ],
        },
      },
    ],
    dos: ["같은 계층끼리 같은 radius"],
    donts: ["카드마다 다른 둥글기"],
  },
  {
    slug: "elevation",
    title: "Elevation",
    description:
      "UI 요소의 상대 깊이를 표현합니다. Soft UI에서는 경계선(border)을 우선하고, 그림자는 떠 있는 UI에만 씁니다.",
    sections: [
      {
        id: "levels",
        title: "레벨",
        table: {
          headers: ["Level", "Shadow", "용도"],
          rows: [
            ["flat", "none", "페이지 배경, 인라인"],
            ["raised", "가벼운 1단", "기본 카드(필요 시)"],
            ["floating", "중간", "드롭다운·알림"],
            ["overlay", "강함", "모달·시트"],
          ],
        },
      },
    ],
    demo: "elevation",
    dos: ["모달·메뉴에만 floating 이상"],
    donts: ["모든 카드에 큰 그림자"],
  },
  {
    slug: "motion",
    title: "Motion",
    description:
      "모션은 표현력을 높이되, 교사용 Soft UI에서는 짧고 조용하게. Seed duration 축을 축소 적용합니다.",
    sections: [
      {
        id: "duration",
        title: "Duration",
        table: {
          headers: ["Token", "ms", "용도"],
          rows: [
            ["quick", "120", "호버·색"],
            ["normal", "180", "메뉴·패널"],
            ["moderate", "220", "시트·오버레이"],
          ],
        },
      },
      {
        id: "reduced",
        title: "Reduced motion",
        body: "prefers-reduced-motion: reduce 시 전환을 끄거나 즉시 전환합니다.",
      },
    ],
    demo: "motion",
    dos: ["의미 있는 상태 변화에만 모션"],
    donts: ["장식용 무한 루프 애니메이션"],
  },
  {
    slug: "iconography",
    title: "Iconography",
    description:
      "Seed Iconography: 모노크롬 Line/Fill. 기본 24px, 최소 12px, ≤15px는 Fill. Top Nav=Line. 터치 ≥40px. UI에 배경 네모·스티커 PNG 금지. 브랜드 마크·프로필만 이미지.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: "Seed Usage(Size · Touch Area · Line/Fill · With Typography)를 따릅니다. currentColor로 잉크/브랜드 상속.",
      },
      {
        id: "library",
        title: "Library",
        body: "CrepassIcon + CrepassGlyphIcon. weight=line|fill. CREPASS_ICON_NAMES 레지스트리.",
      },
      {
        id: "usage",
        title: "Usage",
        body: "상단 내비 Line · 카드/버튼 안 Fill · 단독 버튼은 IconButton(44px).",
        bullets: [
          "최소 12px, 기본 24px",
          "≤15px → Fill 자동",
          "터치 타깃 ≥40px (24 아이콘은 44 권장)",
        ],
      },
    ],
    demo: "icons",
    dos: [
      "CrepassIcon(Line/Fill)만 사용",
      "아이콘 버튼에 aria-label + 충분한 터치 영역",
    ],
    donts: ["파스텔 배경 네모 PNG를 UI에 사용", "Heroicons 혼용"],
  },
  {
    slug: "gradient",
    title: "Gradient",
    description:
      "그라디언트는 배경·아이콘에서 입체감이나 강조를 줄 때 씁니다. 크레파스는 파스텔 종이감의 아주 약한 그라데이션만 허용합니다.",
    sections: [
      {
        id: "usage",
        title: "사용",
        body: "문서 셸 히어로·빈 상태 배경에 soft paper wash(surface → brand-muted 8%) 정도. 네온·퍼플 그라데이션 금지.",
      },
    ],
    dos: ["약한 파스텔 wash만"],
    donts: ["다층 glow, 퍼플-인디고 그라데이션"],
  },
  {
    slug: "layout",
    title: "Layout",
    description:
      "레이아웃은 콘텐츠를 구조화하는 뼈대입니다. 앱은 Header + 본문, 디자인 시스템은 docs 사이드바 + 본문입니다.",
    sections: [
      {
        id: "breakpoints",
        title: "Breakpoints",
        table: {
          headers: ["Name", "Min", "용도"],
          rows: [
            ["sm", "640", "2열 시작"],
            ["md", "768", "태블릿"],
            ["lg", "1024", "docs 사이드바 고정"],
          ],
        },
      },
      {
        id: "app",
        title: "앱 셸",
        body: "우측 앱 사이드바는 기본 숨김. 본문 max 폭과 페이지 패딩(32)으로 호흡을 맞춥니다.",
      },
    ],
    dos: ["모바일에서 먼저 한 열"],
    donts: ["첫 화면에 카드·통계 과다 배치"],
  },
  {
    slug: "state",
    title: "State",
    description:
      "상태는 컴포넌트의 가능성과 현재 조건을 전달합니다. Enabled / Hover / Pressed / Focus / Disabled / Loading / Error.",
    sections: [
      {
        id: "interactive",
        title: "인터랙션 상태",
        body: "Focus는 --cp-focus 링. Disabled는 투명도·포인터 제한. Loading은 Progress Circle 또는 버튼 내 인디케이터.",
      },
      {
        id: "data",
        title: "데이터 상태",
        body: "Empty → Empty/Result Section, Error → 원인+다음 행동, Success → Snackbar 또는 인라인 확인.",
      },
    ],
    dos: ["에러에 복구 행동 제공"],
    donts: ["Disabled만 하고 이유 미설명"],
  },
  {
    slug: "inclusive-design",
    title: "Inclusive Design",
    description:
      "모든 교사가 쉽게 접근·사용할 수 있도록 합니다. 대비, 터치 크기, 키보드, 스크린리더, 모션 감소를 기본으로 둡니다.",
    sections: [
      {
        id: "principles",
        title: "원칙",
        bullets: [
          "본문 16px+, 충분한 줄간격",
          "터치 타깃 ≥ 40px",
          "키보드로 모든 주요 흐름 가능",
          "아이콘만 있는 컨트롤에 접근 가능 이름",
          "prefers-reduced-motion 존중",
        ],
      },
    ],
    dos: ["대비·포커스·라벨 점검"],
    donts: ["색만으로 상태 전달"],
  },
  {
    slug: "international-design",
    title: "International Design",
    description:
      "현재 제품 카피는 한국어가 기본입니다. 레이아웃은 긴 라벨·번역 확장을 가정해 Hug/Fill 버튼을 준비합니다.",
    sections: [
      {
        id: "copy",
        title: "카피",
        body: "교사 친화적 구어체, 전문 용어 최소화. 버튼은 동사형(저장, 출석 확인).",
      },
    ],
    dos: ["짧은 동사 라벨"],
    donts: ["시스템/영문 개발 용어를 UI에 노출"],
  },
  {
    slug: "voice-and-tone",
    title: "Voice and Tone",
    description:
      "크레파스가 말하는 방식입니다. 차분하고, 명확하고, 교사를 재촉하지 않습니다.",
    sections: [
      {
        id: "voice",
        title: "Voice",
        body: "동료 교사처럼 — 친절하되 가벼우지 않게. Soft UI와 같은 호흡의 문장.",
      },
      {
        id: "tone",
        title: "Tone by context",
        table: {
          headers: ["상황", "톤"],
          rows: [
            ["성공", "짧게 확인 (저장됨)"],
            ["오류", "원인 + 다음 행동"],
            ["빈 화면", "초대 (새 문서 만들기)"],
            ["파괴 확인", "결과 명시, 사과문 남발 금지"],
          ],
        },
      },
    ],
    dos: ["능동태, 한 컨트롤=한 동사"],
    donts: ["모호한 Submit/확인만 반복"],
  },
  {
    slug: "writing",
    title: "Writing",
    description:
      "일관된 글쓰기 규칙입니다. Seed Writing 구조를 교사 제품 맥락으로 옮겼습니다.",
    sections: [
      {
        id: "rules",
        title: "규칙",
        bullets: [
          "버튼·토스트에 같은 동사 유지 (게시 → 게시됨)",
          "문장 부호 최소화, 명료한 구어",
          "숫자·날짜는 읽기 쉬운 한글 표기 우선",
          "학생 실명·민감정보는 예시 카피에 넣지 않기",
        ],
      },
    ],
    dos: ["사용자가 통제하는 말로 이름 짓기"],
    donts: ["웹훅·API 등 구현 용어"],
  },
];

export const DS_PATTERNS: DsDoc[] = [
  {
    slug: "loading",
    title: "Loading",
    description:
      "로딩을 관리하는 요소·시간대별 선택·단계별 UX입니다. Seed Loading 패턴을 교사 앱 맥락으로 옮겼습니다.",
    sections: [
      {
        id: "components",
        title: "Components",
        table: {
          headers: ["", "Progress Circle", "Progress Bar", "Skeleton"],
          rows: [
            ["형태", "원형 인디케이터", "선형 막대", "콘텐츠 윤곽"],
            [
              "특징",
              "짧은 프로세스",
              "업로드·변환 등 연속",
              "목록·카드 구조 예고",
            ],
            ["시간", "1–4초", "1–10초+", "1–10초"],
          ],
        },
      },
      {
        id: "use-cases",
        title: "Use Cases",
        bullets: [
          "첫 진입: Skeleton 또는 Indeterminate Circle",
          "페이지 전환: Circle / Skeleton",
          "더 보기·무한 스크롤: Circle",
          "저장·제출: 버튼 내 Loading",
        ],
      },
      {
        id: "time",
        title: "Time-based Recommendations",
        table: {
          headers: ["시간", "권장"],
          rows: [
            ["1초 이내", "표시하지 않음 (플리커 방지)"],
            ["1–4초", "Circle 또는 Skeleton"],
            ["4–10초", "Skeleton + 안내 문구"],
            ["10초+", "Determinate + 예상 시간"],
            ["1분+", "진행률 + 취소 옵션"],
          ],
        },
      },
      {
        id: "steps",
        title: "Loading Process Steps",
        body: "시작 → 진행 → 완료/실패. 실패 시 원인과 재시도 행동을 Result Section으로 제공합니다.",
      },
    ],
    demo: "loading",
    dos: ["1초 미만 스피너 금지", "실패에 재시도 제공"],
    donts: ["레이아웃 모르는 화면에 Skeleton 억지"],
  },
];

export const DS_COMPONENTS: DsDoc[] = [
  {
    slug: "accordion",
    title: "Accordion",
    description:
      "세부 정보를 점진적으로 여는 세로 목록입니다. 설정·FAQ·학생 상세 접기에 사용합니다.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Accordion은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "accordion",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "action-button",
    title: "Action Button",
    description:
      "명확한 액션을 수행하는 기본 버튼입니다. cp-btn-primary / secondary / ghost에 대응합니다.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Action Button은(는) 다음 파트로 구성됩니다: Container · Label · Prefix Icon · Suffix Icon. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "button",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "alert-dialog",
    title: "Alert Dialog",
    description:
      "되돌리기 어려운 확인이 필요할 때 쓰는 강한 경고 대화상자입니다.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Alert Dialog은(는) 다음 파트로 구성됩니다: Container · Icon · Title · Description · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "attachment-input",
    title: "Attachment Input",
    description: "파일·사진 첨부와 업로드 진행·실패·삭제를 다룹니다.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Attachment Input은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "attachment",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "avatar",
    title: "Avatar",
    description:
      "교사·학생 프로필 이미지. 크레파스 파스텔 아바타 에셋을 기본으로 합니다.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Avatar은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "avatar",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "badge",
    title: "Badge",
    description: "상태·속성을 짧게 표시하는 라벨입니다.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Badge은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "badge",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "bottom-navigation",
    title: "Bottom Navigation",
    description: "모바일 루트 탭 전환. 상위 목적지 5개 이하.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Bottom Navigation은(는) 다음 파트로 구성됩니다: Container · Items · Active indicator · Optional badge. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "bottom-sheet",
    title: "Bottom Sheet",
    description: "하단에서 올라오는 보조 패널. 맥락 유지한 채 액션 제공.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Bottom Sheet은(는) 다음 파트로 구성됩니다: Scrim · Panel · Header · Body · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "bottom-sheet",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "callout",
    title: "Callout",
    description: "팁·주의 등 인라인 강조 메시지.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Callout은(는) 다음 파트로 구성됩니다: Container · Icon · Title · Description · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description: "다중 선택·동의 체크.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Checkbox은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "checkbox",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "chip",
    title: "Chip",
    description:
      "필터·선택 값을 표현. 액션 실행이 목적이면 Action Button을 씁니다.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Chip은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "chip",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "content-placeholder",
    title: "Content Placeholder",
    description: "이미지/콘텐츠 로드 전 영역 성격 전달.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Content Placeholder은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "placeholder",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "contextual-floating-button",
    title: "Contextual Floating Button",
    description: "특정 맥락에서만 뜨는 보조 FAB.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Contextual Floating Button은(는) 다음 파트로 구성됩니다: Container · Label · Prefix Icon · Suffix Icon. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "contextual-fab",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "dialog",
    title: "Dialog",
    description: "흐름을 멈추고 정보 전달·작업 완료를 강제하는 모달.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Dialog은(는) 다음 파트로 구성됩니다: Container · Icon · Title · Description · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "divider",
    title: "Divider",
    description: "콘텐츠 구획 선.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Divider은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "divider",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "field",
    title: "Field",
    description: "라벨·도움말·오류를 묶는 입력 컨테이너.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Field은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "input",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "floating-action-button",
    title: "Floating Action Button",
    description: "화면 위 주요 생성 액션.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Floating Action Button은(는) 다음 파트로 구성됩니다: Container · Label · Prefix Icon · Suffix Icon. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "fab",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "footer",
    title: "Footer",
    description: "하단 정책·탐색 링크 영역.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Footer은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "footer",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "help-bubble",
    title: "Help Bubble",
    description: "기능 설명 툴팁/버블.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Help Bubble은(는) 다음 파트로 구성됩니다: Container · Icon · Title · Description · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "help-bubble",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "identity-placeholder",
    title: "Identity Placeholder",
    description: "인물 이미지 없을 때 대체 시각.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Identity Placeholder은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "identity",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "image-frame",
    title: "Image Frame",
    description: "업로드 이미지 표시 프레임.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Image Frame은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "image-frame",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "input-button",
    title: "Input Button",
    description: "피커를 여는 입력형 버튼. 선택값이 라벨에 반영.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Input Button은(는) 다음 파트로 구성됩니다: Container · Label · Prefix Icon · Suffix Icon. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "input-button",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "list",
    title: "List",
    description: "가로 행 기반 콘텐츠 목록.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "List은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "list",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "menu",
    title: "Menu",
    description: "액션·선택지 목록.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Menu은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "menu",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "menu-sheet",
    title: "Menu Sheet",
    description: "시트형 액션 목록.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Menu Sheet은(는) 다음 파트로 구성됩니다: Scrim · Panel · Header · Body · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "menu-sheet",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "notification-badge",
    title: "Notification Badge",
    description: "읽지 않은 수·새 알림 점.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Notification Badge은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "badge",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "page-banner",
    title: "Page Banner",
    description: "페이지 상단 전역 상태 메시지.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Page Banner은(는) 다음 파트로 구성됩니다: Container · Icon · Title · Description · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "page-banner",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "progress-circle",
    title: "Progress Circle",
    description: "짧은 로딩·진행 표시.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Progress Circle은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "progress",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "quantity-picker",
    title: "Quantity Picker",
    description: "수치 ± 조절.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Quantity Picker은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "quantity",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "radio",
    title: "Radio",
    description: "단일 선택.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Radio은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "radio",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "reaction-button",
    title: "Reaction Button",
    description: "즐겨찾기 등 감정/반응. 별 아이콘은 Crepass star.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Reaction Button은(는) 다음 파트로 구성됩니다: Container · Label · Prefix Icon · Suffix Icon. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "reaction",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "result-section",
    title: "Result Section",
    description: "빈 결과·완료·오류 등 결과 템플릿. Empty State와 연결.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Result Section은(는) 다음 파트로 구성됩니다: Container · Icon · Title · Description · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "empty",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "scroll-fog",
    title: "Scroll Fog",
    description: "스크롤 영역에 더 있음 힌트.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Scroll Fog은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "scroll-fog",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "segmented-control",
    title: "Segmented Control",
    description: "즉시 필터/뷰 전환.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Segmented Control은(는) 다음 파트로 구성됩니다: Container · Items · Active indicator · Optional badge. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "segmented",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "select",
    title: "Select",
    description: "폼 제출용 옵션 선택.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Select은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "select",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "select-box",
    title: "Select Box",
    description: "테두리 컨테이너형 단일/다중 선택.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Select Box은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "select",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "side-navigation",
    title: "Side Navigation",
    description: "앱·문서 최상위 탐색.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Side Navigation은(는) 다음 파트로 구성됩니다: Container · Items · Active indicator · Optional badge. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "side-panel",
    title: "Side Panel",
    description: "측면 상세·보조 작업 패널.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Side Panel은(는) 다음 파트로 구성됩니다: Scrim · Panel · Header · Body · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "side-panel",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    description: "콘텐츠 윤곽 로딩.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Skeleton은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "skeleton",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "slider",
    title: "Slider",
    description: "범위 값 입력.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Slider은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "slider",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "snackbar",
    title: "Snackbar",
    description: "하단 일시 피드백.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Snackbar은(는) 다음 파트로 구성됩니다: Container · Icon · Title · Description · Actions. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "switch",
    title: "Switch",
    description: "즉시 on/off 설정.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Switch은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "switch",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "tabs",
    title: "Tabs",
    description: "동일 화면 내 콘텐츠 전환.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Tabs은(는) 다음 파트로 구성됩니다: Container · Items · Active indicator · Optional badge. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "tabs",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "tag-group",
    title: "Tag Group",
    description: "속성·메타 태그 나열.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Tag Group은(는) 다음 파트로 구성됩니다: Container · Content · Optional leading/trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "tag-group",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "text-input",
    title: "Text Input & Textarea",
    description: "텍스트 입력. cp-input 대응.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Text Input & Textarea은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "input",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "time-picker",
    title: "Time Picker",
    description: "시·분 선택.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Time Picker은(는) 다음 파트로 구성됩니다: Label · Control · Helper/Error · Optional trailing. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    demo: "time-picker",
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "top-navigation",
    title: "Top Navigation",
    description: "상단 탐색(헤더).",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Top Navigation은(는) 다음 파트로 구성됩니다: Container · Items · Active indicator · Optional badge. Seed Components 스펙 구조를 따르며, 시각 톤은 크레파스 파스텔 Soft UI입니다.",
      },
      {
        id: "properties",
        title: "Properties",
        body: "Size · Variant · State · Width(Hug/Fill)를 기본 축으로 둡니다. Brand 컬러 Variant는 화면당 강조 CTA 1개 규칙을 지킵니다.",
        table: {
          headers: ["Property", "Crepass 적용"],
          rows: [
            ["Size", "sm / md(기본) — 교사 터치 여유"],
            ["Variant", "Brand Solid · Neutral · Outline · Ghost · Critical"],
            ["State", "Enabled · Hover · Pressed · Focus · Disabled · Loading"],
            ["Width", "Hug 기본, 모바일 CTA는 Fill"],
          ],
        },
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 화면에 High emphasis 버튼은 1개. 라벨은 동사형. Icon Only는 aria-label 필수. 학교 행정 맥락 예시로 검증합니다.",
        bullets: [
          "Brand는 핵심 행동에만 (출석 확인, 저장, 생성)",
          "Critical는 삭제·초기화 + Alert Dialog와 짝",
          "Chip은 필터/선택, Button은 실행 — 역할 혼동 금지",
        ],
      },
    ],
    dos: ["역할에 맞는 컴포넌트 선택", "토큰·CrepassIcon 사용"],
    donts: ["한 줄에 primary 남발", "Karrot/Seed 원색 그대로 붙이기"],
    related: [
      {
        title: "Color",
        href: "/design-system/foundations/color",
      },
      {
        title: "State",
        href: "/design-system/foundations/state",
      },
      {
        title: "Loading 패턴",
        href: "/design-system/patterns/loading",
      },
    ],
  },
  {
    slug: "card",
    title: "Card",
    description:
      "크레파스 Soft UI 콘텐츠 컨테이너. Seed 목록에는 별도 Card가 없으나 교사 앱의 기본 표면으로 cp-card를 문서화합니다.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        body: "Container · Header · Body · Optional actions. 경계선 우선, 그림자는 raised가 필요할 때만.",
      },
      {
        id: "guidelines",
        title: "Guidelines",
        body: "한 카드 = 한 목적. 히어로에 카드를 쓰지 않습니다. 상호작용 단위일 때만 카드로 묶습니다.",
      },
    ],
    dos: ["목록·폼 그룹에 cp-card"],
    donts: ["장식용 카드 남발", "카드 안에 또 강한 그림자 중첩"],
    demo: "card",
    related: [
      { title: "Elevation", href: "/design-system/foundations/elevation" },
      { title: "Radius", href: "/design-system/foundations/radius" },
    ],
  },
];

export const DS_DOCS_BY_GROUP: Record<DsGroupKey, DsDoc[]> = {
  foundations: DS_FOUNDATIONS,
  patterns: DS_PATTERNS,
  components: DS_COMPONENTS,
};

export function getDsDoc(group: DsGroupKey, slug: string): DsDoc | undefined {
  return DS_DOCS_BY_GROUP[group].find((d) => d.slug === slug);
}

export function getDsNav() {
  return (["foundations", "patterns", "components"] as const).map((key) => {
    const title = key[0].toUpperCase() + key.slice(1);
    const items = DS_DOCS_BY_GROUP[key].map((d) => ({
      title: d.title,
      href: `/design-system/${key}/${d.slug}`,
    }));
    return {
      title,
      href: `/design-system/${key}`,
      items,
    };
  });
}
