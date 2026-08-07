import React from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";
import type { CrepassIconName } from "@/constants/designSystemNav";

type CalloutTone = "neutral" | "informative" | "warning" | "critical";

type CalloutProps = {
  title?: string;
  children: React.ReactNode;
  tone?: CalloutTone;
  icon?: CrepassIconName;
  /** 아이콘 숨김 */
  hideIcon?: boolean;
  className?: string;
};

const TONE: Record<CalloutTone, { wrap: string; icon: string }> = {
  neutral: {
    wrap: "border-line bg-surface-elevated text-ink-secondary",
    icon: "text-ink-muted",
  },
  informative: {
    wrap: "border-line bg-brand-muted/50 text-brand-ink",
    icon: "text-brand-ink",
  },
  warning: {
    wrap: "border-line bg-[#F5F0E6] text-ink",
    icon: "text-[var(--cp-warning)]",
  },
  critical: {
    wrap: "border-line bg-[#F8EDEA] text-[var(--cp-danger)]",
    icon: "text-[var(--cp-danger)]",
  },
};

/**
 * Seed Callout — 팁·주의 인라인 메시지 (크레파스 파스텔 톤)
 */
/**
 * Seed Callout — 팁·주의 인라인 (tone / icon / hideIcon)
 */
export default function Callout({
  title,
  children,
  tone = "informative",
  icon = "help",
  hideIcon = false,
  className = "",
}: CalloutProps) {
  const t = TONE[tone];
  return (
    <aside
      className={`flex gap-3 rounded-md border px-4 py-3 ${t.wrap} ${className}`}
      role="note"
    >
      {!hideIcon && (
        <span className={`mt-0.5 shrink-0 ${t.icon}`}>
          <CrepassIcon name={icon} size={20} />
        </span>
      )}
      <div className="min-w-0 text-sm leading-relaxed">
        {title && <p className="mb-0.5 font-medium text-ink">{title}</p>}
        <div>{children}</div>
      </div>
    </aside>
  );
}
