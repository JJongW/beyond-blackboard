"use client";

import React, { useId, useRef } from "react";
import CrepassIcon from "@/components/ui/CrepassIcon";
import Field from "@/components/ui/Field";

type AttachmentInputProps = {
  id?: string;
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  files?: File[];
  onChange: (files: File[]) => void;
  className?: string;
};

/**
 * Seed Attachment Input — 파일 첨부 (채점 답안지 등)
 */
export default function AttachmentInput({
  id,
  label = "파일 첨부",
  hint = "이미지 또는 PDF",
  accept = "image/*,.pdf",
  multiple = true,
  disabled,
  files = [],
  onChange,
  className = "",
}: AttachmentInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Field label={label} htmlFor={inputId} hint={hint} className={className}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []);
          onChange(list);
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line-strong bg-surface px-4 py-8 text-center transition-colors hover:border-brand hover:bg-brand-muted/40 disabled:opacity-50"
      >
        <CrepassIcon name="add" size={28} className="text-ink-muted" />
        <span className="text-sm font-medium text-ink">파일을 선택하세요</span>
        <span className="text-xs text-ink-muted">{hint}</span>
      </button>
      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((f) => (
            <li
              key={`${f.name}-${f.size}`}
              className="flex items-center justify-between rounded-md border border-line bg-surface-card px-3 py-2 text-sm text-ink"
            >
              <span className="truncate">{f.name}</span>
              <span className="cp-caption shrink-0 ml-2">
                {Math.max(1, Math.round(f.size / 1024))}KB
              </span>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}
