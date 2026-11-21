// Twin Vista — Spot the Difference: hand-in program (Node 22, standard library only).
// The playable game lives in game/ as plain static files (game/index.html plus its
// ES modules and stylesheet — no build step, no network). This program copies game/
// and screenshots/ from beside this file into the output directory and writes
// dossier.json there with buildDossier from the kit's vendor/makefun-game.ts,
// exactly as the kit prescribes.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail early with a readable message when the repository is incomplete,
// instead of letting buildDossier trip over a missing folder later.
for (const required of ['game/index.html', 'screenshots', 'vendor/makefun-game.ts']) {
  if (!existsSync(join(rootDir, required))) {
    throw new Error(`Twin Vista hand-in: missing ${required} beside main.ts — the entry is incomplete.`);
  }
}

/** Every regular file under a directory, as paths relative to it (sorted). */
function listFiles(dir: string, prefix = ''): string[] {
  const found: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const rel = prefix === '' ? name : `${prefix}/${name}`;
    if (statSync(join(dir, name)).isDirectory()) found.push(...listFiles(join(dir, name), rel));
    else found.push(rel);
  }
  return found;
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(rootDir, 'game'), join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(rootDir, 'screenshots'))) {
  cpSync(join(rootDir, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// Caps mirror the scorer's gate: at most 4 screenshots of 256 KiB each, at most
// 993 entries / 48 MiB under game/, no game/ path over 1,000 UTF-8 bytes, and
// the dossier text capped at 163,840 bytes. Passing them here makes this
// program fail loudly wherever the scorer would refuse the entry.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);

// A one-line inventory so a local run shows at a glance what was handed in:
// the game files copied, the screenshots carried, and the dossier size.
const gameFiles = listFiles(join(outputDir, 'game'));
const shotFiles = listFiles(join(outputDir, 'screenshots'));
console.log(
  `Twin Vista dossier written to ${join(outputDir, 'dossier.json')} (${dossier.length} bytes); ` +
  `${gameFiles.length} game files (${gameFiles.join(', ')}); ` +
  `${shotFiles.length} screenshots (${shotFiles.join(', ')}).`,
);
