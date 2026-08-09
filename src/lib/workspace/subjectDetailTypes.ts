export type JobStatus = "ingesting" | "drafting" | "ready" | "failed";

export type SubjectDetailJob = {
  id: string;
  status: JobStatus;
  createdAt: string;
  notifiedAt?: string;
  errorMessage?: string;
  entries: SubjectDetailEntry[];
};

export type SubjectDetailEntry = {
  id: string;
  studentId?: string;
  unmatchedName?: string;
  rawText: string;
  aiText: string;
  reviewStatus: "pending" | "edited" | "copied";
  /** DraftProvider(Ollama 등) 실패 시 메시지 — 있으면 aiText는 rawText로 폴백된 상태 */
  draftError?: string;
};

export type IngestFragment = {
  studentName: string;
  studentNumber?: string;
  rawText: string;
};
