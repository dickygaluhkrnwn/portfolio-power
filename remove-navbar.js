const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  content = content.replace(/import { Navbar } from "@\/components\/layout\/navbar";\r?\n/g, '');
  content = content.replace(/<Navbar \/>\r?\n/g, '');
  content = content.replace(/[ \t]*<Navbar \/>/g, '');
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (file === 'page.tsx') {
      replaceInFile(fullPath);
    }
  }
}

scanDir('./app');
