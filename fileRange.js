/**
 * Created by zhangsong on 18/01/29.
 */

const fs = require('fs');
const Path = require('path');

// ------------------请修改下面内容------------------------------------
// 将要查询的文件夹路径
const inputPath = '/Users/xrain/Desktop/ubuntu';
// 输出的文件夹路径
const outputPath = '/Users/xrain/Desktop/lol20171102/a';
// ------------------------------------------------------------------


// keyword 文本
const keywordFile = 'keyword.txt';
// 关键字
let keyword = [''];
let count = 1;
let total = 1;

readKeyword(keywordFile);

function readKeyword(file) {
  let fb = fs.readFileSync(keywordFile, "utf-8");
  keyword = fb.split(/\s+?/);
  keyword = keyword.filter((item) => {
    return item.length > 0;
  });
  console.log(keyword);
  isFile(inputPath)
}

// isFile(inputPath);

// 检查路径是文件夹,还是文件
function isFile(path, fileName='') {
  const filePath = Path.join(path ,fileName);
  const stats = fs.statSync(filePath);
  if (stats.isFile()) { // 是否是文件
    logger(`第${total++}个文件,文件路径:${filePath}`);
    // 循环关键字数组
    keyword.some((item) => {
      // 搜索文件名中是否包含关键字
      if (fileName.search(item)!==-1) {
        moveFile(path, fileName, item);
        return true;
      } else {
        return false;
      }
    });
  } else if (stats.isDirectory()) { // 是否是目录
    // 如果是目录,取出该目录下全部文件递归调用
    fs.readdirSync(filePath).forEach((item) => {
      // 递归调用
      isFile(filePath, item);
    });
  } else {
    logger(`该路径,既不是文件,也不是文件夹:${path}`);
  }
}

// 移动文件
function moveFile(fileDirectory, fileName, keyword) {
  const filePath = Path.join(fileDirectory, fileName); // 旧文件路径
  const outputDir =  Path.join(outputPath, keyword);
  // 判断文件夹是否存在
  if (!fs.existsSync(outputDir)) {
    // 创建目录
    fs.mkdirSync(outputDir);
  }
  const newFilePath = Path.join(outputDir, fileName);
  // 移动文件
  fs.renameSync(filePath, newFilePath);
  logger(`第${count++}文件移动成功,原路径:${filePath}   新路径:${newFilePath}`);
}

// 输出日志
function logger(str) {
  console.log(str);
  fs.appendFileSync('log.txt', `${new Date().getTime()}  ${str}\r\n`);
}
