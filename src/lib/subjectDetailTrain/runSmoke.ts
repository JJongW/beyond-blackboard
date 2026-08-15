/**
 * 오프라인 학습 스모크 러너.
 *
 * 사용:
 *   npm run train:smoke
 *
 * 프롬프트가 비어 있으면 Ollama를 호출하지 않고 안내 후 exit 2.
 * Ollama가 없으면 dry-run으로 gold 파싱·디렉터리 I/O만 검증.
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { adoptFromAttempts } from "./adopt";
import { toDpoRows, toJsonl, toSftRows, writeJsonlFile } from "./exportDataset";
import { parseGoldJsonl } from "./goldParser";
import {
  PROMPT_SLOTS,
  assertPromptsReady,
  setActiveTrainPromptId,
} from "./promptRegistry";
import { scoreCandidate } from "./scorer";
import { generateCandidate, isOllamaReachable } from "./studentAgent";
import type { Attempt, GoldPair } from "./types";

const ROOT = process.cwd();
const DEFAULT_GOLD = path.join(ROOT, "data/subject-details/gold.example.jsonl");

export type SmokeResult =
  | { status: "blocked_empty_prompts"; message: string }
  | { status: "dry_run"; goldCount: number; message: string }
  | {
      status: "ok";
      attempts: number;
      winningPromptId: string | null;
      outDir: string;
    };

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function runTrainSmoke(options?: {
  goldPath?: string;
  outRoot?: string;
  fetchImpl?: typeof fetch;
}): Promise<SmokeResult> {
  const promptCheck = assertPromptsReady(PROMPT_SLOTS);
  if (!promptCheck.ok) {
    return {
      status: "blocked_empty_prompts",
      message: promptCheck.message,
    };
  }

  const goldPath =
    options?.goldPath ?? process.env.TRAIN_GOLD_PATH ?? DEFAULT_GOLD;
  if (!existsSync(goldPath)) {
    throw new Error(`gold 파일이 없습니다: ${goldPath}`);
  }

  const allGolds = parseGoldJsonl(readFileSync(goldPath, "utf-8"));
  const maxGolds = envInt("TRAIN_SMOKE_MAX_GOLDS", 2);
  const golds: GoldPair[] = allGolds.slice(0, maxGolds);
  const attemptsPerPrompt = envInt("TRAIN_SMOKE_ATTEMPTS_PER_PROMPT", 2);
  const temperature = Number(process.env.TRAIN_SMOKE_TEMPERATURE ?? "0.2");

  const outRoot = options?.outRoot ?? path.join(ROOT, "data/subject-details");
  const attemptsDir = path.join(outRoot, "attempts");
  const adoptedDir = path.join(outRoot, "adopted");
  const exportDir = path.join(outRoot, "export");
  mkdirSync(attemptsDir, { recursive: true });
  mkdirSync(adoptedDir, { recursive: true });
  mkdirSync(exportDir, { recursive: true });

  const reachable = await isOllamaReachable(
    process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
    options?.fetchImpl,
  );

  if (!reachable) {
    // dry-run: 스키마·경로만 검증
    writeJsonlFile(path.join(exportDir, "sft.dry-run.jsonl"), toSftRows(golds));
    writeFileSync(
      path.join(adoptedDir, "dry-run.json"),
      JSON.stringify(
        {
          mode: "dry_run",
          goldCount: golds.length,
          promptCount: PROMPT_SLOTS.length,
          reason: "Ollama unreachable",
        },
        null,
        2,
      ),
      "utf-8",
    );
    return {
      status: "dry_run",
      goldCount: golds.length,
      message:
        "Ollama에 연결할 수 없어 dry-run만 수행했습니다. 서버 기동 후 다시 실행하세요.",
    };
  }

  const attempts: Attempt[] = [];
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");

  for (const gold of golds) {
    for (const prompt of PROMPT_SLOTS) {
      for (let i = 0; i < attemptsPerPrompt; i++) {
        const { candidateText } = await generateCandidate({
          rawText: gold.rawText,
          prompt,
          temperature,
          fetchImpl: options?.fetchImpl,
        });
        const { score } = scoreCandidate(candidateText, gold.goldText);
        attempts.push({
          goldId: gold.id,
          promptId: prompt.id,
          temperature,
          candidateText,
          score,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  const attemptsPath = path.join(attemptsDir, `attempts-${stamp}.jsonl`);
  writeFileSync(attemptsPath, toJsonl(attempts), "utf-8");

  const adopted = adoptFromAttempts(golds, attempts);
  setActiveTrainPromptId(adopted.winningPromptId);
  writeFileSync(
    path.join(adoptedDir, `adopted-${stamp}.json`),
    JSON.stringify(adopted, null, 2),
    "utf-8",
  );

  writeJsonlFile(path.join(exportDir, `sft-${stamp}.jsonl`), toSftRows(golds));
  writeJsonlFile(
    path.join(exportDir, `dpo-${stamp}.jsonl`),
    toDpoRows(adopted),
  );

  return {
    status: "ok",
    attempts: attempts.length,
    winningPromptId: adopted.winningPromptId,
    outDir: outRoot,
  };
}

async function main() {
  const enabled = (process.env.TRAIN_SMOKE_ENABLED ?? "true").toLowerCase();
  if (enabled === "false" || enabled === "0") {
    console.log("TRAIN_SMOKE_ENABLED=false — 스모크를 건너뜁니다.");
    process.exit(0);
  }

  const result = await runTrainSmoke();
  if (result.status === "blocked_empty_prompts") {
    console.error(result.message);
    process.exit(2);
  }
  if (result.status === "dry_run") {
    console.warn(result.message);
    console.log(`goldCount=${result.goldCount}`);
    process.exit(0);
  }
  console.log(
    `train smoke ok: attempts=${result.attempts} winning=${result.winningPromptId} out=${result.outDir}`,
  );
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return path.resolve(entry) === fileURLToPath(import.meta.url);
  } catch {
    return /(?:^|[/\\])runSmoke\.[cm]?[jt]s$/.test(entry);
  }
})();

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
