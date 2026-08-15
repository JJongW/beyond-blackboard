/** 세부특기사항 오프라인 학습 파이프라인 공통 타입 */

export type GoldPair = {
  id: string;
  rawText: string;
  goldText: string;
  meta?: {
    subject?: string;
    source?: string;
    [key: string]: unknown;
  };
};

/**
 * 학습용 프롬프트 변형.
 * userTemplate에는 반드시 `{{rawText}}` 플레이스홀더를 포함한다.
 */
export type PromptVariant = {
  id: string;
  system: string;
  userTemplate: string;
};

export type Attempt = {
  goldId: string;
  promptId: string;
  temperature: number;
  candidateText: string;
  score: number;
  createdAt: string;
};

export type ScoreResult = {
  score: number;
  /** 디버그용 — 정규화 후 자카드 등 */
  detail?: {
    jaccard: number;
    lengthRatio: number;
  };
};

export type PromptStat = {
  promptId: string;
  meanScore: number;
  n: number;
};

export type DpoPair = {
  goldId: string;
  rawText: string;
  chosen: string;
  rejected: string;
};

export type AdoptResult = {
  winningPromptId: string | null;
  promptStats: PromptStat[];
  dpoPairs: DpoPair[];
  createdAt: string;
};

export type SftExportRow = {
  rawText: string;
  goldText: string;
};

export type DpoExportRow = {
  rawText: string;
  chosen: string;
  rejected: string;
};
