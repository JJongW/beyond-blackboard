# 🤖 AI 학교 행정 자동화 도우미 (Beyond Blackboard)

교사의 반복적인 행정 업무를 줄이고 수업 준비 시간을 확보하기 위한 AI 기반의 학급 행정 자동화 시스템입니다.

## 📋 프로젝트 개요

본 서비스는 교사들이 다양한 행정 업무를 효율적으로 처리할 수 있도록 돕는 웹 기반 플랫폼입니다. AI 기술을 활용하여 문서 생성, 수행평가 채점, 민원 처리 등의 업무를 자동화합니다.

### 🎯 주요 목표
- 행정 업무 처리 시간 50% 이상 단축
- 문서 작성의 표준화와 품질 향상
- 교사 업무 스트레스 감소
- 수행평가 채점의 객관성과 효율성 확보

## ✨ 주요 기능

### 📄 행정 업무 자동화
- **문서 템플릿 제공**: 가정통신문, 창의적 체험활동 계획서, 수행평가 기준표 등
- **AI 자동 완성**: 필수 정보만 입력하면 AI가 자동으로 문서 완성
- **다중 포맷 지원**: HWP, PDF, DOCX 등 다양한 형식으로 다운로드
- **커스텀 템플릿**: 사용자 맞춤형 문서 템플릿 생성

### 🎓 수행평가 AI 채점
- **자동 답안 분석**: 스캔된 답안지 자동 인식 및 분석
- **다중 평가 기준**: 구성, 문법, 창의성 등 항목별 채점 옵션
- **점수 조정 기능**: 교사가 직접 점수 수정 가능
- **통계 및 분석**: 학급별, 개인별 성취도 분석

### 🔧 민원 처리 자동화
- **AI 민원 분석**: 민원 내용 자동 분류 및 분석
- **자동 응답 생성**: 유형별 표준 응답 템플릿 제공
- **처리 현황 추적**: 민원 처리 진행 상황 실시간 모니터링

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: Headless UI, Heroicons, Lucide React
- **상태 관리**: React Hooks (향후 Zustand 또는 Redux Toolkit 고려)

### Backend (계획)
- **런타임**: Node.js
- **프레임워크**: Express.js 또는 FastAPI (Python)
- **데이터베이스**: PostgreSQL, MongoDB
- **AI/ML**: OpenAI GPT, TensorFlow, PyTorch
- **파일 처리**: LibreOffice API, HWP 변환 라이브러리

### DevOps & 배포
- **클라우드**: AWS 또는 Azure
- **컨테이너**: Docker
- **CI/CD**: GitHub Actions
- **모니터링**: Vercel Analytics

## 📁 프로젝트 구조

```
beyond-blackboard/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── documents/          # 문서 생성 페이지
│   │   ├── evaluation/         # 수행평가 채점 페이지
│   │   ├── grades/             # 성적 관리 페이지
│   │   ├── attendance/         # 출결 관리 페이지
│   │   ├── complaints/         # 민원 처리 페이지
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 메인 대시보드
│   │   └── globals.css         # 전역 스타일
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── layout/             # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx      # 상단 네비게이션
│   │   │   ├── Sidebar.tsx     # 사이드바
│   │   │   ├── MainLayout.tsx  # 메인 레이아웃
│   │   │   └── MobileMenu.tsx  # 모바일 메뉴
│   │   ├── ui/                 # UI 컴포넌트
│   │   │   ├── DocumentCard.tsx        # 문서 카드
│   │   │   └── AddNewTemplateCard.tsx  # 새 템플릿 카드
│   │   ├── common/             # 공통 컴포넌트
│   │   └── forms/              # 폼 컴포넌트
│   ├── types/                  # TypeScript 타입 정의
│   ├── constants/              # 상수 및 설정값
│   ├── utils/                  # 유틸리티 함수
│   ├── hooks/                  # 커스텀 훅
│   ├── lib/                    # 라이브러리 설정
│   └── styles/                 # 스타일 파일
├── public/                     # 정적 자산
├── tailwind.config.ts          # Tailwind CSS 설정
├── next.config.ts              # Next.js 설정
└── package.json                # 프로젝트 의존성
```

## 🚀 설치 및 실행

### 환경 요구사항
- Node.js 18.17 이상
- npm 9.0 이상 또는 yarn 1.22 이상

### 설치
```bash
# 저장소 클론
git clone https://github.com/your-username/beyond-blackboard.git
cd beyond-blackboard

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 스크립트
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅
npm run lint

# 타입 체크
npm run type-check
```

## 📱 반응형 디자인

프로젝트는 다양한 디바이스에서 최적화된 사용자 경험을 제공합니다:

- **Desktop (1280px+)**: 풀 레이아웃 (헤더 + 메인 콘텐츠 + 사이드바)
- **Tablet (768px - 1279px)**: 적응형 레이아웃 (사이드바 숨김)
- **Mobile (< 768px)**: 모바일 최적화 (슬라이드 메뉴, 터치 친화적 UI)

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: #1ccf60 (메인 브랜드 컬러)
- **Secondary**: #6b7280 (보조 텍스트)
- **Background**: #f9fafb (배경색)
- **Text**: #333333 (기본 텍스트)

### 타이포그래피
- **폰트**: Inter (주 폰트), Malgun Gothic (한글 폰트)
- **크기**: 반응형 타이포그래피 스케일 적용

## 🔧 개발 가이드

### 코딩 컨벤션
- **컴포넌트**: PascalCase (예: `DocumentCard.tsx`)
- **파일명**: kebab-case 또는 PascalCase
- **함수**: camelCase
- **상수**: UPPER_SNAKE_CASE

### 아키텍처 원칙
- **Clean Architecture**: 계층 분리 및 의존성 역전
- **컴포넌트 기반**: 재사용 가능한 컴포넌트 설계
- **타입 안전성**: TypeScript 엄격 모드 사용
- **성능 최적화**: 코드 스플리팅, 지연 로딩 적용

### 주석 및 문서화
모든 컴포넌트와 함수에는 JSDoc 형식의 주석을 포함하여 목적과 사용법을 명시합니다.

```typescript
/**
 * 문서 템플릿 카드 컴포넌트
 * 
 * 각 문서 템플릿을 시각적으로 표현하는 카드 컴포넌트입니다.
 * 
 * @param template - 문서 템플릿 정보
 * @param className - 추가 CSS 클래스
 */
const DocumentCard: React.FC<DocumentCardProps> = ({ template, className }) => {
  // 구현 내용...
};
```

## 📊 성능 최적화

- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 스플리팅**: 동적 임포트 및 lazy loading
- **번들 최적화**: Tree shaking 및 minification
- **캐싱**: 적절한 캐싱 전략 적용

## 🔐 보안 고려사항

- **XSS 방지**: 사용자 입력 데이터 검증 및 이스케이프
- **CSRF 보호**: 토큰 기반 인증
- **데이터 암호화**: 민감한 정보 암호화 저장
- **접근 제어**: 역할 기반 권한 관리

## 🤝 기여 가이드

1. 이슈 생성 또는 확인
2. 기능 브랜치 생성 (`feature/새로운-기능`)
3. 변경사항 커밋 (`git commit -m '새로운 기능 추가'`)
4. 브랜치 푸시 (`git push origin feature/새로운-기능`)
5. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의 및 지원

- **이메일**: support@beyond-blackboard.edu
- **이슈 트래커**: [GitHub Issues](https://github.com/your-username/beyond-blackboard/issues)
- **문서**: [위키](https://github.com/your-username/beyond-blackboard/wiki)

## 🚀 로드맵

### v1.0 (현재)
- [x] 기본 문서 템플릿 시스템
- [x] 반응형 웹 디자인
- [x] 기본 네비게이션 및 레이아웃

### v1.1 (계획)
- [ ] AI 문서 생성 기능
- [ ] 사용자 인증 시스템
- [ ] 데이터베이스 연동

### v1.2 (계획)
- [ ] 수행평가 채점 AI
- [ ] 파일 업로드 및 변환
- [ ] 실시간 알림 시스템

### v2.0 (장기)
- [ ] 모바일 앱 (React Native)
- [ ] 고급 AI 분석 기능
- [ ] 다국어 지원

---

**Beyond Blackboard** - 교육의 미래를 만들어가는 AI 기반 행정 자동화 솔루션