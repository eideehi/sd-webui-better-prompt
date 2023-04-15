import fs from "fs-extra";
import path from "path";

const __dirname = path.resolve();

const dir = path.join(__dirname, "tmp");

fs.readdir(dir).then((files) => {
  const jsonFiles = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.resolve(dir, file));

  Promise.all(jsonFiles.map((pathname) => fs.readJson(pathname))).then((allTags) => {
    let merge = [];

    allTags.forEach((tags) => {
      if (Array.isArray(tags)) {
        const map = new Map(tags.map((tag) => [tag.name, tag]));
        map.forEach((tag) => merge.push(tag));
      }
    });

    fs.writeJson(path.resolve(dir, "danbooru-tags.json"), merge);
  });
});
