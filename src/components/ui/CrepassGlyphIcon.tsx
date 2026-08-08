/**
 * Seed Iconography — Monochrome Line / Fill
 * https://seed-design.io/foundations/iconography/usage
 *
 * - 기본 24px, 최소 12px
 * - ≤15px → Fill 권장
 * - Top Navigation → Line
 * - 컨테이너 안·하단 탭·상태 ON → Fill
 * - 배경 네모/스티커 PNG 없음. currentColor만.
 */
import type { ReactNode } from "react";
import type { CrepassIconName } from "@/constants/designSystemNav";

export type IconWeight = "line" | "fill";

/**
 * Seed 권장 사이즈 토큰
 * - 기본 단독 글리프: 2xl(24) + IconButton 44
 * - 인라인 액션/닫기: inline(18)
 * - chevron: xl(22) 허용
 * - 28px 금지 (스케일 상한 24)
 */
export const ICON_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  /** 인라인 액션 · 닫기 · Help 글리프 */
  inline: 18,
  lg: 20,
  xl: 22,
  "2xl": 24,
} as const;

export type IconSizeToken = keyof typeof ICON_SIZE;

type GlyphProps = {
  size: number;
  className?: string;
  title?: string;
  children: ReactNode;
};

function GlyphSvg({ size, className, title, children }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`inline-block shrink-0 ${className ?? ""}`}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

const line = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Seed: ≤15px는 Fill — 자동 승격 */
export function resolveIconWeight(
  size: number,
  weight?: IconWeight,
): IconWeight {
  if (weight) return weight;
  return size <= 15 ? "fill" : "line";
}

function paths(name: CrepassIconName, weight: IconWeight): ReactNode {
  const filled = weight === "fill";

  switch (name) {
    case "home":
      return filled ? (
        <path
          fill="currentColor"
          d="M12 3.2L4.5 9.2V20a1 1 0 001 1h4.2v-6.2h4.6V21H18.5a1 1 0 001-1V9.2L12 3.2z"
        />
      ) : (
        <path
          {...line}
          d="M4.5 10.2L12 4l7.5 6.2V19.5a1 1 0 01-1 1H15v-5.5H9V20.5H5.5a1 1 0 01-1-1V10.2z"
        />
      );
    case "documents":
      return filled ? (
        <path
          fill="currentColor"
          d="M7 3.5h7.2L19 8.3V19.5a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1zm7 1.2v3.6h3.6"
        />
      ) : (
        <>
          <path
            {...line}
            d="M8 4h6.5L18 7.5V19a1 1 0 01-1 1H8a1 1 0 01-1-1V5a1 1 0 011-1z"
          />
          <path {...line} d="M14 4.2V8h3.8" />
          <path {...line} d="M9.5 12h5M9.5 15.5h5" />
        </>
      );
    case "students":
      return filled ? (
        <>
          <circle cx="9" cy="9" r="2.6" fill="currentColor" />
          <circle cx="15.5" cy="9.5" r="2.2" fill="currentColor" />
          <path
            fill="currentColor"
            d="M4.5 18.5c.8-2.8 2.6-4.2 4.5-4.2s3.7 1.4 4.5 4.2H4.5zm7.2-.3c.5-1.7 1.7-2.9 3.4-2.9 1.5 0 2.7 1 3.3 2.5l.1.3h-6.8z"
          />
        </>
      ) : (
        <>
          <circle cx="9" cy="9" r="2.5" {...line} />
          <circle cx="15.5" cy="9.5" r="2.1" {...line} />
          <path
            {...line}
            d="M4.8 18.5c.9-2.6 2.6-3.9 4.2-3.9s3.3 1.3 4.2 3.9"
          />
          <path
            {...line}
            d="M13.2 18.2c.5-1.6 1.6-2.6 3-2.6 1.3 0 2.4.8 3 2.2"
          />
        </>
      );
    case "attendance":
    case "calendar":
      return filled ? (
        <path
          fill="currentColor"
          d="M7.5 3.5h1.5V5h6V3.5H16.5V5H18a1 1 0 011 1v12.5a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h1.5V3.5zM6.5 9.5h11v9h-11v-9z"
        />
      ) : (
        <>
          <path
            {...line}
            d="M7 4.5V6M17 4.5V6M5.5 8.5h13M6.5 5.5h11A1.5 1.5 0 0119 7v11.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 18.5V7a1.5 1.5 0 011.5-1.5z"
          />
          <path
            {...line}
            d="M9 12h.01M12 12h.01M15 12h.01M9 15.5h.01M12 15.5h.01"
          />
        </>
      );
    case "grading":
    case "clipboard":
      return filled ? (
        <path
          fill="currentColor"
          d="M9.5 3.5h5a1.5 1.5 0 011.5 1.5v1h1.5A1.5 1.5 0 0119 7.5v12A1.5 1.5 0 0117.5 21h-11A1.5 1.5 0 015 19.5v-12A1.5 1.5 0 016.5 6H8V5A1.5 1.5 0 019.5 3.5zm1.2 3V5.2h2.6v1.3h-2.6z"
        />
      ) : (
        <>
          <path
            {...line}
            d="M9 5.5h6M8 5.5H6.5A1.5 1.5 0 005 7v12.5A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V7A1.5 1.5 0 0017.5 5.5H16"
          />
          <path {...line} d="M9 5.5V4.5a1 1 0 011-1h4a1 1 0 011 1v1" />
          <path {...line} d="M9 12h6M9 15.5h4" />
        </>
      );
    case "records":
    case "notebook":
      return filled ? (
        <path
          fill="currentColor"
          d="M7 3.5h11A1.5 1.5 0 0119.5 5v14a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 19V5A1.5 1.5 0 017 3.5zm2.5 4.5v1.5h7V8h-7zm0 4v1.5h7V12h-7z"
        />
      ) : (
        <>
          <path
            {...line}
            d="M7 4h10.5A1.5 1.5 0 0119 5.5v13A1.5 1.5 0 0117.5 20H7A1.5 1.5 0 015.5 18.5v-13A1.5 1.5 0 017 4z"
          />
          <path {...line} d="M9 9h6.5M9 12.5h6.5M9 16h4.5" />
        </>
      );
    case "crayon":
      return filled ? (
        <path
          fill="currentColor"
          d="M14.8 3.6l5.6 5.6-9.2 9.2H5.6v-5.6l9.2-9.2zm-1.3 3.1l-7.2 7.2v2.2h2.2l7.2-7.2-2.2-2.2z"
        />
      ) : (
        <path
          {...line}
          d="M14.5 4.2l5.3 5.3-9.4 9.4H5.1v-5.3l9.4-9.4zM8.2 15.2l5.6-5.6"
        />
      );
    case "search":
      return (
        <>
          <circle
            cx="11"
            cy="11"
            r={filled ? 6.2 : 6.5}
            {...(filled
              ? { fill: "none", stroke: "currentColor", strokeWidth: 2.25 }
              : line)}
          />
          <path
            d="M16.5 16.5L20 20"
            {...(filled ? { ...line, strokeWidth: 2.25 } : line)}
          />
        </>
      );
    case "menu":
      return (
        <path
          d="M5 7h14M5 12h14M5 17h14"
          {...(filled ? { ...line, strokeWidth: 2.25 } : line)}
        />
      );
    case "close":
      return (
        <path
          d="M6 6l12 12M18 6L6 18"
          {...(filled ? { ...line, strokeWidth: 2.25 } : line)}
        />
      );
    case "chevron-left":
      return <path d="M14.5 6L9 12l5.5 6" {...line} />;
    case "chevron-right":
      return <path d="M9.5 6L15 12l-5.5 6" {...line} />;
    case "chevron-down":
      return <path d="M6 9.5L12 15l6-5.5" {...line} />;
    case "add":
      return (
        <path
          d="M12 5v14M5 12h14"
          {...(filled ? { ...line, strokeWidth: 2.25 } : line)}
        />
      );
    case "check":
      return (
        <path
          d="M5 12.5l4.5 4.5L19 7"
          {...(filled ? { ...line, strokeWidth: 2.25 } : line)}
        />
      );
    case "trash":
      return filled ? (
        <path
          fill="currentColor"
          d="M9 4.5h6l.8 1.5H19v1.8H5V6h3.2L9 4.5zM6.8 9h10.4l-.7 10.2a1.5 1.5 0 01-1.5 1.4H9a1.5 1.5 0 01-1.5-1.4L6.8 9z"
        />
      ) : (
        <>
          <path
            {...line}
            d="M9 5h6M6 7h12M9 7v11a1 1 0 001 1h4a1 1 0 001-1V7"
          />
          <path {...line} d="M11 10v6M13 10v6" />
        </>
      );
    case "bell":
    case "notifications":
      return filled ? (
        <>
          <path
            fill="currentColor"
            d="M12 3.2a5.3 5.3 0 015.3 5.3v3.2c0 .7.2 1.4.7 2L19.2 15H4.8l1.2-1.3c.5-.6.7-1.3.7-2V8.5A5.3 5.3 0 0112 3.2z"
          />
          <path fill="currentColor" d="M10 16.8a2 2 0 004 0H10z" />
        </>
      ) : (
        <>
          <path
            {...line}
            d="M12 4a5 5 0 015 5v3.5c0 .8.3 1.6.8 2.2L19 16H5l1.2-1.3c.5-.6.8-1.4.8-2.2V9a5 5 0 015-5z"
          />
          <path {...line} d="M10 17a2 2 0 004 0" />
        </>
      );
    case "settings":
      return filled ? (
        <>
          <circle cx="12" cy="12" r="3.2" fill="currentColor" />
          <path
            fill="currentColor"
            d="M11.2 2.8h1.6l.4 2.2 1.8.7 1.8-1.3 1.1 1.1-1.3 1.8.7 1.8 2.2.4v1.6l-2.2.4-.7 1.8 1.3 1.8-1.1 1.1-1.8-1.3-1.8.7-.4 2.2h-1.6l-.4-2.2-1.8-.7-1.8 1.3-1.1-1.1 1.3-1.8-.7-1.8-2.2-.4v-1.6l2.2-.4.7-1.8L4.9 5.5 6 4.4l1.8 1.3 1.8-.7.4-2.2z"
            opacity={0.9}
          />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="3" {...line} />
          <path
            {...line}
            d="M12 3.5v2.2M12 18.3v2.2M4.9 7.1l1.6 1.5M17.5 15.4l1.6 1.5M3.5 12h2.2M18.3 12h2.2M4.9 16.9l1.6-1.5M17.5 8.6l1.6-1.5"
          />
        </>
      );
    case "help":
      return (
        <>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            {...(filled ? { fill: "currentColor" } : line)}
          />
          {filled ? (
            <>
              <path
                d="M9.8 9.6a2.3 2.3 0 114 1.8c-.6.4-1.3.9-1.3 2v.4"
                stroke="#FBFBFA"
                strokeWidth="1.75"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16.8" r="0.9" fill="#FBFBFA" />
            </>
          ) : (
            <>
              <path
                {...line}
                d="M9.5 9.5a2.5 2.5 0 114 2c-.7.5-1.5 1-1.5 2.2V14"
              />
              <circle cx="12" cy="17" r="0.8" fill="currentColor" />
            </>
          )}
        </>
      );
    case "user":
      return filled ? (
        <>
          <circle cx="12" cy="9" r="3.6" fill="currentColor" />
          <path
            fill="currentColor"
            d="M5.5 19.5c1.6-3.2 3.8-4.8 6.5-4.8s4.9 1.6 6.5 4.8H5.5z"
          />
        </>
      ) : (
        <>
          <circle cx="12" cy="9" r="3.5" {...line} />
          <path {...line} d="M6 19c1.5-3 3.5-4.5 6-4.5S16.5 16 18 19" />
        </>
      );
    case "star":
      return (
        <path
          d="M12 4.5l2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 15.6 7.7 17.8l.8-4.8-3.5-3.4 4.8-.7L12 4.5z"
          fill="currentColor"
          stroke="none"
        />
      );
    case "star-outline":
      return (
        <path
          d="M12 4.5l2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 15.6 7.7 17.8l.8-4.8-3.5-3.4 4.8-.7L12 4.5z"
          {...line}
        />
      );
    default:
      return <circle cx="12" cy="12" r="7" {...line} />;
  }
}

export function CrepassGlyphIcon({
  name,
  size = 24,
  weight,
  className = "",
}: {
  name: CrepassIconName;
  size?: number;
  weight?: IconWeight;
  className?: string;
}) {
  const resolved = resolveIconWeight(size, weight);
  return (
    <GlyphSvg size={size} className={className}>
      {paths(name, resolved)}
    </GlyphSvg>
  );
}
