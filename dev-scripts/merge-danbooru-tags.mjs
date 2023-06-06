import fs from "fs-extra";
import path from "path";

const __dirname = path.resolve();

const dir = path.join(__dirname, "tmp");

const omit = ({ name, post_count, category }) => {
  return { name, post_count, category };
};

fs.readdir(dir).then((files) => {
  const jsonFiles = files
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => path.resolve(dir, file));

  Promise.all(jsonFiles.map((pathname) => fs.readJson(pathname))).then((allTags) => {
    let merge = new Map();

    allTags.forEach((tags) => {
      if (Array.isArray(tags)) {
        const map = new Map(tags.map((tag) => [tag.name, tag]));
        merge = new Map([...merge, ...map]);
      }
    });

    const tags = Array.from(merge.values());
    fs.writeJson(path.resolve(dir, "danbooru-tags.json"), tags.map(omit));
  });
});
