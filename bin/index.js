#!/usr/bin/env node

const fs = require('fs');
const {argv} = require('node:process');

const rCheckKey = /^--/g;


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

  const caseChange = (text) => `${[...text].reduce((a, c) => {
    const code = c.charCodeAt(0);
    if (65 <= code && code <= 90) {
      return a + "_" + c
    } else {
      return a + String.fromCharCode(code - 32);
    }
  }, "")}`;

  const recursive = (data, pre = "", isReverse = false) => (
    Object.keys(data).map(key => {
      const value = data[key];
      const _prefix = isReverse ? `${pre}_${caseChange(key)}` : `${caseChange(key)}${pre ? `_${pre}` : pre}`
      if (typeof value === 'object') {
        return recursive(value, _prefix)
      } else {
        return `${_prefix}=${value}`;
      }
    }).flat(1)
  )

  fs.readFile(importFile, 'utf8', (error, jsonFile) => {
    if (error) return console.error(error);
    try {
      //@ts-ignore
      const {common, env} = JSON.parse(jsonFile);
      const data = [...recursive(common), ...recursive(env[staging], prefix, true)].join('\n')
      fs.writeFile(`${exportFile}.${staging}`, data, () => {
        console.log("COMPLETE!🎉")
        console.log("---")
        console.log(data)
        console.log("---")
      })
    } catch (e) {
      console.error(e);
    }
  });
})();