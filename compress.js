// 压缩文件
const fs = require('fs')
const zlib = require('zlib')

fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('imput.txt.rar'))

  console.log('sucessfull...');
