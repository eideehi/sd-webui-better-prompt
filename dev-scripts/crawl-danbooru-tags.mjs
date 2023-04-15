import fetch from "node-fetch";
import https from "https";
import { URLSearchParams } from "url";
import { setTimeout } from "timers/promises";
import { program } from "commander";
import fs from "fs-extra";
import path from "path";

const __dirname = path.resolve();

/**
 * @typedef {"general" | "artist" | "copyright" | "character"} Category
 * @typedef {{
 *   id: number;
 *   name: string;
 *   post_count: number;
 *   category: number;
 *   created_at: string;
 *   updated_at: string;
 *   is_deprecated: boolean;
 *   words: string[];
 * }} DanbooruTag
 */

let firstProgressUpdate = true;

/**
 * @param current {number}
 * @param total {number}
 */
function updateProgressBar(current, total) {
  const width = 50;
  const percent = (current / total) * 100;
  const progress = Math.round((width * current) / total);
  const empty = width - progress;
  const bar = "=".repeat(progress) + "-".repeat(empty);
  if (!firstProgressUpdate) {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(0);
  } else {
    firstProgressUpdate = false;
  }
  process.stdout.write(`[${bar}] | ${percent.toFixed()}% | ${current} / ${total}\n`);
}

/**
 * @param filename {string}
 * @param data {DanbooruTag[]}
 */
function writeToFile(filename, data) {
  const dir = path.resolve(__dirname, "tmp");
  const outData = data.map(({ name, post_count, category, is_deprecated, words }) => ({
    name,
    post_count,
    category,
    is_deprecated,
    words,
  }));
  fs.outputFileSync(path.resolve(dir, `${filename}.json`), JSON.stringify(outData), {
    flag: "a",
  });
}

/**
 * @param category {Category}
 */
function categoryAsParameter(category) {
  // 0, 1, 3, 4 (general, artist, copyright, character respectively)
  switch (category) {
    case "general":
      return "0";
    case "artist":
      return "1";
    case "copyright":
      return "3";
    case "character":
      return "4";
  }
}

/**
 * @param array {DanbooruTag[]}
 * @return {DanbooruTag[]}
 */
function removeDuplicateObjects(array) {
  let result = [];
  const map = new Map(array.map((tag) => [tag.id, tag]));
  map.forEach((tag) => result.push(tag));
  return result;
}

/**
 * @param category {Category}
 * @param options {{
 *   start?: number;
 *   end?: number;
 *   interval?: number;
 *   retry?: boolean;
 * }}
 */
async function crawlDanbooruTags(category, options) {
  const { start, end, interval, retry } = options;

  if (!retry) {
    fs.removeSync(path.resolve(__dirname, "tmp", `${category}.json`));
  }

  const keepAliveAgent = new https.Agent({
    keepAlive: true,
  });

  const params = new URLSearchParams();
  params.append("search[category]", categoryAsParameter(category));
  params.append("search[hide_empty]", "yes");
  params.append("search[order]", "count");

  let dataCache = [];
  for (let i = start; i <= end; i++) {
    params.set("page", i.toString());

    const response = await fetch(`https://danbooru.donmai.us/tags.json?${params}`, {
      method: "GET",
      agent: keepAliveAgent,
    });

    if (!response.ok) {
      console.error(`Failed to acquire data: [page=${i}]`);
      console.error(JSON.stringify(await response.json(), null, "  "));
      break;
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error(`Data is not array: [${params}]`);
      console.error(JSON.stringify(data, null, "  "));
      break;
    }

    updateProgressBar(i, end);
    dataCache.push(...data);
    await setTimeout(interval);
  }

  if (dataCache.length > 0) {
    writeToFile(category, removeDuplicateObjects(dataCache));
  }
}

program
  .argument("<string>", "One of general, artist, copyright, character")
  .option("-s, --start <number>", "", "1")
  .option("-e, --end <number>", "", "1000")
  .option("-i, --interval <number>", "", "7000")
  .option("--retry", "Start working from where you left off at the end of the previous session")
  .action(async (category, options) => {
    await crawlDanbooruTags(category, options);
  });

program.parse();
