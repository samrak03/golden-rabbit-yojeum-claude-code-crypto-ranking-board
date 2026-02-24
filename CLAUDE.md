# CLAUDE.md

Claude Code가 이 저장소에서 작업할 때 참고하는 가이드 문서입니다.

## 프로젝트 개요

Next.js 15.2.4와 React 19로 구축한 한국어 암호화폐 순위 대시보드. 8개 코인의 가격, 시가총액, 거래량, 24시간 변동률을 정적 목업 데이터로 표시한다. UI 텍스트와 코인 이름은 모두 한국어로 작성되어 있다.

## 개발 명령어

```bash
pnpm install       # 의존성 설치
pnpm dev           # 개발 서버 실행
pnpm build         # 프로덕션 빌드
pnpm lint          # ESLint 검사

# 테스트 (package.json에 "test" 스크립트 없음 — Jest 직접 호출)
pnpm exec jest                    # 전체 테스트 실행
pnpm exec jest --watch            # 워치 모드
pnpm exec jest path/to/file       # 특정 파일만 실행
pnpm exec jest --coverage         # 커버리지 포함 실행
```

`jest.config.mjs`와 `jest.setup.js`로 Jest가 완전히 설정되어 있으며, `ts-jest`, `jest-environment-jsdom`, `@testing-library/react`를 사용한다. 테스트 파일은 `**/__tests__/**` 또는 `**/*.{spec,test}.{ts,tsx}` 패턴을 따른다.

## 아키텍처

### 컴포넌트 구조
- `crypto-ranking-board.tsx` — 단일 루트 컴포넌트 (`default function Component()`로 export). `CoinData` 인터페이스, `mockCoinData` 배열, `formatNumber`/`formatPrice` 유틸리티, 테이블 JSX가 모두 이 파일에 포함되어 있다.
- `app/page.tsx` — 위 컴포넌트를 import해서 렌더링하는 얇은 래퍼.
- `app/layout.tsx` — `next-themes`의 `ThemeProvider`를 포함한 루트 레이아웃 (기본값: 다크 모드).
- `components/ui/` — shadcn/ui 컴포넌트 라이브러리 (Radix UI + Tailwind).
- `lib/utils.ts` — `cn()` 헬퍼 (clsx + tailwind-merge).
- `hooks/` — `components/ui/`에서 re-export된 `use-mobile.tsx`, `use-toast.ts`.

### 데이터
목업 데이터는 `crypto-ranking-board.tsx`에 하드코딩되어 있다. 코인 로고는 `public/coin/[name].png` (`.png`, `.webp` 혼용)에서 제공된다. 푸터에 CoinAPI가 언급되어 있지만 실제 API 연동은 아직 구현되지 않았다.

### 코인 추가 방법
1. 코인 로고 이미지를 `public/coin/[코인이름].png` 또는 `.webp`로 추가한다.
2. `crypto-ranking-board.tsx`의 `mockCoinData` 배열에 `CoinData` 형식으로 항목을 추가한다.

## 주요 설정

- `next.config.mjs`: 빌드 시 ESLint·TypeScript 오류 무시 (`ignoreDuringBuilds: true`, `ignoreBuildErrors: true`). 이미지 최적화 비활성화.
- `tsconfig.json`: `@/` 경로 별칭이 프로젝트 루트를 가리킨다.
- Tailwind 다크 모드는 `app/globals.css`에 정의된 CSS 변수를 사용한다.

## 코딩 컨벤션

- **주석**: 항상 한글로 작성합니다.
- **변수 이름**: 항상 카멜 케이스(camelCase)로 작성합니다.

## 주의 사항

- `components/ui/` — shadcn/ui 컴포넌트는 커스터마이징 목적이 아니면 수정하지 않는다.
- `next.config.mjs`의 ESLint·TypeScript 오류 무시 설정은 임시 조치이므로, 실제 오류가 발생하면 근본 원인을 수정한다.
- 목업 데이터 기반이므로 실제 API 연동 전까지 데이터는 정적으로 유지된다.
