#!/usr/bin/env node
const fs = require('fs');
const _ = require('lodash')
const app = require('commander');
var pad = require('pad-number');

function fileNum(name){
  return name.replace(/\.txt$/, '')
}
function mergeFile(fileName, files){
  var e = files.map(path => fs.readFileSync(path,'utf8')).join('')
  fs.writeFile(fileName, e, (err) => {
      if (err) throw err;
  });
}

app
  .version('0.0.1')
  .option('-f, --from-path <path>', 'from file path')
  .option('-p, --filePrefix <name>', 'file prefix')
  .parse(process.argv);

fs.mkdirSync(`${app.fromPath}/aggre`)
fs.readdir(app.fromPath, (err, _files) => {
  var files = _files
    .filter(e => e.search(/\.txt$/)>-1)
    .map(e => fileNum(e))
    .map(e => parseInt(e))
    .sort((a,b) => a > b ? 1 : -1)
    .map(e => `${e}.txt`)
  _.chunk(files,50).forEach(chunk => {
    let fileName = `${app.fromPath}/aggre/${app.filePrefix}_${pad(fileNum(chunk[0]),4)}_${pad(fileNum(chunk[chunk.length-1]),4)}.txt`
    mergeFile(fileName, chunk.map(e => `${app.fromPath}/${e}`))
  })
})

