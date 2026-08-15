import { createSingletonStore } from "./createSingletonStore";

export type DocumentDraft = {
  templateId: string;
  title: string;
  body: string;
  updatedAt: string | null;
};

type DocumentDraftState = {
  byId: Record<string, DocumentDraft>;
};

const store = createSingletonStore<DocumentDraftState>(
  { byId: {} },
  { persistKey: "cp.workspace.documentDrafts" },
);

function nowISO() {
  return new Date().toISOString();
}

/** 템플릿별 문서 초안 — 세션 메모리 */
export const documentDraftStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  getServerSnapshot: store.getServerSnapshot,
  get(templateId: string): DocumentDraft | undefined {
    return store.getState().byId[templateId];
  },
  ensure(templateId: string, defaultTitle: string): DocumentDraft {
    const existing = store.getState().byId[templateId];
    if (existing) return existing;
    const draft: DocumentDraft = {
      templateId,
      title: defaultTitle,
      body: "",
      updatedAt: null,
    };
    store.setState((s) => ({
      byId: { ...s.byId, [templateId]: draft },
    }));
    return draft;
  },
  save(templateId: string, patch: { title: string; body: string }) {
    const title = patch.title.trim();
    const body = patch.body.trim();
    if (!title) {
      return { ok: false as const, error: "제목을 입력해 주세요." };
    }
    const draft: DocumentDraft = {
      templateId,
      title,
      body,
      updatedAt: nowISO(),
    };
    store.setState((s) => ({
      byId: { ...s.byId, [templateId]: draft },
    }));
    return { ok: true as const, draft };
  },
};
