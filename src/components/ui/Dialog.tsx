"use client";

import React, { useEffect } from "react";
import ActionButton from "@/components/ui/ActionButton";
import CrepassIcon from "@/components/ui/CrepassIcon";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** 하단 액션 슬롯 */
  actions?: React.ReactNode;
  className?: string;
};

/**
 * Seed Dialog — 스크림 + 패널. 흐름을 멈추고 작업 완료를 유도
 */
export default function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  className = "",
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="cp-scrim fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby="cp-dialog-title"
        className={`cp-panel-overlay w-full max-w-md p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="cp-dialog-title" className="cp-h3">
            {title}
          </h2>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-elevated hover:text-ink"
            aria-label="닫기"
            onClick={onClose}
          >
            <CrepassIcon name="close" size={18} />
          </button>
        </div>
        <div className="text-sm text-ink-secondary">{children}</div>
        {actions && (
          <div className="mt-6 flex flex-wrap justify-end gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

type AlertDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "neutral" | "critical";
  onConfirm: () => void;
  loading?: boolean;
};

/**
 * Seed Alert Dialog — 되돌리기 어려운 확인
 */
export function AlertDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  tone = "neutral",
  onConfirm,
  loading,
}: AlertDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <ActionButton variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </ActionButton>
          <ActionButton
            variant={tone === "critical" ? "criticalSolid" : "brandSolid"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </ActionButton>
        </>
      }
    >
      <p>{description}</p>
    </Dialog>
  );
}
