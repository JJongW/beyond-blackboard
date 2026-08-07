"use client";

import React, { useId, useState } from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";

export type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

type AccordionProps = {
  items: AccordionItem[];
  /** 하나만 열림 */
  exclusive?: boolean;
  className?: string;
};

/**
 * Seed Accordion — FAQ·채점 기준 등 접이식 섹션
 */
export default function Accordion({
  items,
  exclusive = false,
  className = "",
}: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(items.filter((i) => i.defaultOpen).map((i) => i.id)),
  );
  const baseId = useId();

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(exclusive ? [] : prev);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className={`divide-y divide-line rounded-md border border-line bg-surface-card ${className}`}
    >
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const panelId = `${baseId}-${item.id}-panel`;
        const headerId = `${baseId}-${item.id}-header`;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-ink hover:bg-surface-elevated"
              >
                {item.title}
                <CrepassIcon
                  name="chevron-right"
                  size={18}
                  className={`shrink-0 text-ink-muted transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="border-t border-line px-4 py-3 text-sm text-ink-secondary"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
