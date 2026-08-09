import { createSingletonStore } from "./createSingletonStore";

export type RecordDraft = {
  templateId: string;
  studentName: string;
  content: string;
  updatedAt: string | null;
};

export type RecordTemplateRequest = {
  id: string;
  title: string;
  reason: string;
  createdAt: string;
};

type RecordState = {
  drafts: Record<string, RecordDraft>;
  requests: RecordTemplateRequest[];
};

const store = createSingletonStore<RecordState>(
  {
    drafts: {},
    requests: [],
  },
  { persistKey: "cp.workspace.recordDrafts" },
);

function nowISO() {
  return new Date().toISOString();
}

/** 생기부 초안 + 템플릿 요청 — 세션 메모리 */
export const recordDraftStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  getDraft(templateId: string): RecordDraft | undefined {
    return store.getState().drafts[templateId];
  },
  ensureDraft(templateId: string): RecordDraft {
    const existing = store.getState().drafts[templateId];
    if (existing) return existing;
    const draft: RecordDraft = {
      templateId,
      studentName: "",
      content: "",
      updatedAt: null,
    };
    store.setState((s) => ({
      ...s,
      drafts: { ...s.drafts, [templateId]: draft },
    }));
    return draft;
  },
  saveDraft(
    templateId: string,
    patch: { studentName: string; content: string },
  ) {
    const studentName = patch.studentName.trim();
    const content = patch.content.trim();
    if (!studentName) {
      return { ok: false as const, error: "학생 이름을 입력해 주세요." };
    }
    if (!content) {
      return { ok: false as const, error: "기록 내용을 입력해 주세요." };
    }
    const draft: RecordDraft = {
      templateId,
      studentName,
      content,
      updatedAt: nowISO(),
    };
    store.setState((s) => ({
      ...s,
      drafts: { ...s.drafts, [templateId]: draft },
    }));
    return { ok: true as const, draft };
  },
  listRequests() {
    return store.getState().requests;
  },
  addRequest(title: string, reason: string) {
    const t = title.trim();
    const r = reason.trim();
    if (!t) {
      return {
        ok: false as const,
        error: "요청할 템플릿 이름을 입력해 주세요.",
      };
    }
    if (!r) {
      return { ok: false as const, error: "요청 사유를 입력해 주세요." };
    }
    const req: RecordTemplateRequest = {
      id: `req-${Date.now()}`,
      title: t,
      reason: r,
      createdAt: nowISO(),
    };
    store.setState((s) => ({
      ...s,
      requests: [req, ...s.requests],
    }));
    return { ok: true as const, request: req };
  },
};
