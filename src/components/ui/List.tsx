import React from "react";

type ListProps = {
  children: React.ReactNode;
  className?: string;
  /** 카드 테두리 컨테이너 */
  bordered?: boolean;
};

/**
 * Seed List — 행 단위 정보 나열 컨테이너
 */
export default function List({
  children,
  className = "",
  bordered = true,
}: ListProps) {
  return (
    <ul
      className={`${
        bordered
          ? "cp-card !p-0 divide-y divide-line overflow-hidden"
          : "divide-y divide-line"
      } ${className}`}
    >
      {children}
    </ul>
  );
}

type ListItemProps = {
  children?: React.ReactNode;
  leading?: React.ReactNode;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

/**
 * List 행 — leading · title/description · trailing
 */
export function ListItem({
  children,
  leading,
  title,
  description,
  trailing,
  onClick,
  className = "",
}: ListItemProps) {
  const Comp = onClick ? "button" : "div";
  return (
    <li className={className}>
      <Comp
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className={`flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-surface-elevated ${
          onClick ? "cursor-pointer" : ""
        }`}
      >
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">{title}</p>
          {description && (
            <p className="text-sm text-ink-muted line-clamp-2">{description}</p>
          )}
          {children}
        </div>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </Comp>
    </li>
  );
}
