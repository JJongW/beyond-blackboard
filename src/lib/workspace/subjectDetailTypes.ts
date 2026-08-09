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
};

export type IngestFragment = {
  studentName: string;
  studentNumber?: string;
  rawText: string;
};
