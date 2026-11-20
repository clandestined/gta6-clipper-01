// gta6-clipper-01 entry program (Node 22, standard library only).
//
// The entry is the video itself, so this program has one job: hand the
// house the video's address. It copies VIDEO.json from the repository root
// to /output/VIDEO.json, where the gate reads it. Nothing it writes about
// the video is scored; the house reads the video's views from YouTube.
//
// Run it locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// A real YouTube address for this entry: a Shorts link, a watch link, or a
// youtu.be link. The starter placeholder (https://www.youtube.com/shorts/<id>)
// is refused, so a bad address never reaches the gate.
function isRealYouTubeUrl(url: string): boolean {
  if (url.includes("<id>")) return false;
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname !== "www.youtube.com" &&
      parsed.hostname !== "youtube.com" &&
      parsed.hostname !== "youtu.be"
    ) {
      return false;
    }
    return (
      parsed.pathname.startsWith("/shorts/") ||
      parsed.pathname === "/watch" ||
      parsed.hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

function main(): void {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

  mkdirSync(outputDir, { recursive: true });

  const source = join(botDir, "VIDEO.json");
  const target = join(outputDir, "VIDEO.json");

  // Validate the video address before handing it to the house: refuse a
  // placeholder VIDEO.json so a bad address never reaches the gate.
  let url: string;
  try {
    url = (JSON.parse(readFileSync(source, "utf8")) as { url: string }).url;
  } catch (error) {
    console.error(
      `VIDEO.json could not be read from ${source}: ${(error as Error).message}`,
    );
    process.exit(1);
  }
  if (typeof url !== "string" || !isRealYouTubeUrl(url)) {
    console.error(
      `VIDEO.json at ${source} does not hold a real YouTube video address: ${url}`,
    );
    process.exit(1);
  }

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
