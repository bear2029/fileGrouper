#!/usr/bin/env node
const testFolder = '../Documents/eye/';
const fs = require('fs');
const _ = require('lodash')
var pad = require('pad-number');

const PREFIX = 'eye'

function fileNum(name){
  return name.replace(/\.txt$/, '')
}
function mergeFile(fileName, files){
  var e = files.map(path => fs.readFileSync(path,'utf8')).join('')
  fs.writeFile(fileName, e, (err) => {
      if (err) throw err;
  });
}
fs.readdir(testFolder, (err, _files) => {
  var files = _files
    .filter(e => e.search(/\.txt$/)>-1)
    .map(e => fileNum(e))
    .map(e => parseInt(e))
    .sort((a,b) => a > b ? 1 : -1)
    .map(e => `${e}.txt`)
  _.chunk(files,50).forEach(chunk => {
    let fileName = `${testFolder}aggre/${PREFIX}_${pad(fileNum(chunk[0]),4)}_${pad(fileNum(chunk[chunk.length-1]),4)}.txt`
    mergeFile(fileName, chunk.map(e => testFolder+e))
  })
})

