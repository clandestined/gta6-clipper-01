// gta6-clipper-01 entry program (Node 22, standard library only).
//
// The entry is the video itself, so this program has one job: hand the
// house the video's address. It copies VIDEO.json from the repository root
// to /output/VIDEO.json, where the gate reads it. Nothing it writes about
// the video is scored; the house reads the video's views from YouTube.
//
// Run it locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

function main(): void {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

  mkdirSync(outputDir, { recursive: true });

  const source = join(botDir, "VIDEO.json");
  const target = join(outputDir, "VIDEO.json");

  try {
    copyFileSync(source, target);
  } catch (error) {
    console.error(
      `VIDEO.json could not be copied from ${source}: ${(error as Error).message}`,
    );
    process.exit(1);
  }

  console.log(`VIDEO.json copied to ${target}`);
}

main();
