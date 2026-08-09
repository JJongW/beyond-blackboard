import type { IngestFragment } from "./subjectDetailTypes";

export type { IngestFragment } from "./subjectDetailTypes";

type ParseCsvResult =
  { ok: true; fragments: IngestFragment[] } | { ok: false; error: string };

/** CSV 전체를 레코드·필드로 분리 (따옴표·이스케이프·개행·쉼표 단일 상태 머신) */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      currentRow.push(currentField);
      currentField = "";
    } else if (ch === "\r") {
      if (text[i + 1] === "\n") {
        currentRow.push(currentField);
        currentField = "";
        rows.push(currentRow);
        currentRow = [];
        i++;
      } else {
        currentRow.push(currentField);
        currentField = "";
        rows.push(currentRow);
        currentRow = [];
      }
    } else if (ch === "\n") {
      currentRow.push(currentField);
      currentField = "";
      rows.push(currentRow);
      currentRow = [];
    } else {
      currentField += ch;
    }
  }

  currentRow.push(currentField);
  rows.push(currentRow);

  return rows;
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

  const rows = parseCsvRows(normalized);
  if (rows.length < 1) {
    return { ok: false, error: "헤더가 없습니다." };
  }

  const headers = rows[0].map((h) => h.trim());
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

  for (let i = 1; i < rows.length; i++) {
    const fields = rows[i];
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
