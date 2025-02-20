const fs = require('fs');
const util = require('util');
const glob = require('glob');

const globUtil = util.promisify(glob);
const readdir = util.promisify(fs.readdir);

const testURL = `http://host.docker.internal:3010`;

export default async () => {
  let urls = [];
  const directories = [
    {
      path: './src/components',
    },
    {
      path: './src/patterns',
    },
    {
      path: './src/foundations',
    },
  ];
  for (const directory of directories) {
    const folders = await readdir(directory.path);
    for (const folder of folders) {
      const files = await globUtil(`${directory.path}/${folder}/**/example-*.njk`);
      for (const file of files) {
        const urlPath = file.replace(/^\.\/src\/(.*\/example-.*?)\.njk$/, '/$1');
        urls.push({ url: `${testURL}${urlPath}`, label: urlPath, delay: 1000 });
      }
    }
  }
  return urls;
};
