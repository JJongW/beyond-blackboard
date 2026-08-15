import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type {
  AdoptResult,
  DpoExportRow,
  GoldPair,
  SftExportRow,
} from "./types";

export function toSftRows(golds: GoldPair[]): SftExportRow[] {
  return golds.map((g) => ({ rawText: g.rawText, goldText: g.goldText }));
}

export function toDpoRows(adopt: AdoptResult): DpoExportRow[] {
  return adopt.dpoPairs.map((p) => ({
    rawText: p.rawText,
    chosen: p.chosen,
    rejected: p.rejected,
  }));
}

export function toJsonl(rows: object[]): string {
  return (
    rows.map((r) => JSON.stringify(r)).join("\n") + (rows.length ? "\n" : "")
  );
}

export function writeJsonlFile(filePath: string, rows: object[]): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, toJsonl(rows), "utf-8");
}
