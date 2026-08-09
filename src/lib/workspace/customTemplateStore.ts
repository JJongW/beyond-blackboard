import type { DocumentCategory } from "@/types";
import { createSingletonStore } from "./createSingletonStore";

export type CustomTemplate = {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  createdAt: string;
};

type CustomTemplateState = {
  templates: CustomTemplate[];
};

const store = createSingletonStore<CustomTemplateState>(
  { templates: [] },
  { persistKey: "cp.workspace.customTemplates" },
);

function nowISO() {
  return new Date().toISOString();
}

const CATEGORIES: DocumentCategory[] = [
  "communication",
  "activity",
  "evaluation",
  "life",
  "meeting",
  "other",
];

export function isDocumentCategory(v: string): v is DocumentCategory {
  return (CATEGORIES as string[]).includes(v);
}

/** 사용자가 만든 문서 양식 — 세션 메모리 */
export const customTemplateStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  list() {
    return store.getState().templates;
  },
  add(input: {
    title: string;
    description: string;
    category: DocumentCategory;
  }) {
    const title = input.title.trim();
    const description = input.description.trim();
    if (!title) {
      return { ok: false as const, error: "양식 이름을 입력해 주세요." };
    }
    if (!description) {
      return { ok: false as const, error: "설명을 입력해 주세요." };
    }
    const template: CustomTemplate = {
      id: `custom-${Date.now()}`,
      title,
      description,
      category: input.category,
      createdAt: nowISO(),
    };
    store.setState((s) => ({
      templates: [template, ...s.templates],
    }));
    return { ok: true as const, template };
  },
};
