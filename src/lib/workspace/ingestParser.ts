import type { IngestFragment } from "./subjectDetailTypes";

export type { IngestFragment } from "./subjectDetailTypes";

type ParseCsvResult =
  { ok: true; fragments: IngestFragment[] } | { ok: false; error: string };

/** 따옴표 상태를 존중하며 CSV 레코드(행) 분리 — quoted 필드 내 개행 유지 */
function splitCsvRecords(text: string): string[] {
  const records: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === "\r") {
      if (text[i + 1] === "\n") {
        if (inQuotes) {
          current += "\n";
          i++;
        } else {
          records.push(current);
          current = "";
          i++;
        }
      } else if (inQuotes) {
        current += ch;
      } else {
        records.push(current);
        current = "";
      }
    } else if (ch === "\n") {
      if (inQuotes) {
        current += "\n";
      } else {
        records.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }

  records.push(current);
  return records;
}

/** 한 레코드를 필드 배열로 분리 (따옴표 필드 최소 지원) */
function splitCsvFields(record: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < record.length; i++) {
    const ch = record[i];

    if (inQuotes) {
      if (ch === '"') {
        if (record[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  fields.push(current);
  return fields;
}

function isBlankRow(fields: string[]): boolean {
  return fields.every((f) => f.trim() === "");
}

/** UTF-8 CSV → IngestFragment[] (studentName, rawText 필수) */
export function parseCsv(text: string): ParseCsvResult {
  const normalized = text.replace(/^\uFEFF/, "").trim();
  if (!normalized) {
    return { ok: false, error: "빈 파일입니다." };
  }

  const records = splitCsvRecords(normalized);
  if (records.length < 1) {
    return { ok: false, error: "헤더가 없습니다." };
  }

  const headers = splitCsvFields(records[0]).map((h) => h.trim());
  const nameIdx = headers.indexOf("studentName");
  const numberIdx = headers.indexOf("studentNumber");
  const textIdx = headers.indexOf("rawText");

  if (nameIdx === -1 || textIdx === -1) {
    return {
      ok: false,
      error: "studentName, rawText 컬럼이 필요합니다.",
    };
  }

  const fragments: IngestFragment[] = [];

  for (let i = 1; i < records.length; i++) {
    const record = records[i];
    if (record.trim() === "") continue;

    const fields = splitCsvFields(record);
    if (isBlankRow(fields)) continue;

    const studentName = (fields[nameIdx] ?? "").trim();
    const rawText = (fields[textIdx] ?? "").trim();
    const studentNumber =
      numberIdx !== -1 ? (fields[numberIdx] ?? "").trim() : undefined;

    if (!studentName || !rawText) continue;

    const fragment: IngestFragment = { studentName, rawText };
    if (studentNumber) {
      fragment.studentNumber = studentNumber;
    }
    fragments.push(fragment);
  }

  if (fragments.length === 0) {
    return { ok: false, error: "유효한 데이터 행이 없습니다." };
  }

  return { ok: true, fragments };
}

/** .txt 파일명(stem)을 학생 이름 힌트로 사용 */
export function parseTxtFile(filename: string, text: string): IngestFragment {
  const stem = filename.replace(/\.txt$/i, "");
  return {
    studentName: stem,
    rawText: text,
  };
}
