import type { IngestFragment } from "./subjectDetailTypes";

export type { IngestFragment } from "./subjectDetailTypes";

type ParseCsvResult =
  { ok: true; fragments: IngestFragment[] } | { ok: false; error: string };

/** 한 줄 CSV를 필드 배열로 분리 (따옴표 필드 최소 지원) */
function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
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

  const lines = normalized.split(/\r?\n/);
  if (lines.length < 1) {
    return { ok: false, error: "헤더가 없습니다." };
  }

  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
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

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;

    const fields = splitCsvLine(line);
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
