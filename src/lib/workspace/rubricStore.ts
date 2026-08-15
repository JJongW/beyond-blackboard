import { createSingletonStore } from "./createSingletonStore";

export type RubricCriterion = {
  id: string;
  label: string;
  description: string;
  maxScore: number;
};

type RubricState = {
  title: string;
  criteria: RubricCriterion[];
  updatedAt: string | null;
};

const DEFAULT_CRITERIA: RubricCriterion[] = [
  {
    id: "c1",
    label: "내용의 정확성",
    description: "핵심 개념을 정확히 설명했는가",
    maxScore: 40,
  },
  {
    id: "c2",
    label: "논리·구성",
    description: "주장과 근거가 체계적인가",
    maxScore: 30,
  },
  {
    id: "c3",
    label: "표현·형식",
    description: "맞춤법·형식 준수",
    maxScore: 30,
  },
];

const store = createSingletonStore<RubricState>(
  {
    title: "수행평가 루브릭 (데모)",
    criteria: DEFAULT_CRITERIA,
    updatedAt: null,
  },
  { persistKey: "cp.workspace.rubric" },
);

function nowISO() {
  return new Date().toISOString();
}

/** 채점 기준(루브릭) — 세션 메모리 */
export const rubricStore = {
  subscribe: store.subscribe,
  getState: store.getState,
  getServerSnapshot: store.getServerSnapshot,
  save(title: string, criteria: RubricCriterion[]) {
    const t = title.trim();
    if (!t) {
      return { ok: false as const, error: "루브릭 제목을 입력해 주세요." };
    }
    if (criteria.length === 0) {
      return { ok: false as const, error: "기준을 하나 이상 남겨 주세요." };
    }
    for (const c of criteria) {
      if (!c.label.trim()) {
        return { ok: false as const, error: "기준 이름을 모두 입력해 주세요." };
      }
      if (!Number.isFinite(c.maxScore) || c.maxScore < 1 || c.maxScore > 100) {
        return {
          ok: false as const,
          error: "배점은 1–100 사이 숫자여야 합니다.",
        };
      }
    }
    store.setState({
      title: t,
      criteria: criteria.map((c) => ({
        ...c,
        label: c.label.trim(),
        description: c.description.trim(),
      })),
      updatedAt: nowISO(),
    });
    return { ok: true as const };
  },
  addCriterion() {
    const id = `c-${Date.now()}`;
    store.setState((s) => ({
      ...s,
      criteria: [
        ...s.criteria,
        {
          id,
          label: "새 기준",
          description: "",
          maxScore: 10,
        },
      ],
    }));
  },
  removeCriterion(id: string) {
    store.setState((s) => ({
      ...s,
      criteria: s.criteria.filter((c) => c.id !== id),
    }));
  },
};
