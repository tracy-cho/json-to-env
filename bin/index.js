#!/usr/bin/env node

const fs = require('fs');
const {argv} = require('node:process');

const rCheckKey = /^--/g;

function readJson(obj, prefix) {
  return Object.keys(obj).reduce((accm, curr) => [...accm, `${[...curr].reduce((a, c) => {
    const code = c.charCodeAt(0);
    if (65 <= code && code <= 90) {
      return a + "_" + c
    } else {
      return a + String.fromCharCode(code - 32);
    }
  }, prefix ?? "")}=${obj[curr]}`], [])
}


(async function () {
  const {
    importFile,
    exportFile,
    staging,
    prefix
  } = argv.reduce((accm, curr, index) => {
      if (rCheckKey.exec(curr)) {
        const val = argv[index + 1];
        return {
          ...accm,
          [curr.replace(rCheckKey, "")]: rCheckKey.exec(val) ? true : val
        }
      }
      return {
        ...accm
      }
    },
    {
      importFile: "./env.json",
      staging: "development",
      exportFile: "./.env"
    }
  );

  fs.readFile(importFile, 'utf8', (error, jsonFile) => {
    if (error) return console.error(error);
    try {
      //@ts-ignore
      const {common, env} = JSON.parse(jsonFile);
      fs.writeFile(`${exportFile}.${staging}`, [...readJson(common), ...readJson(env[staging], prefix)].join('\n'), () => {
      })
    } catch (e) {
      console.error(e);
    }
  });
})();