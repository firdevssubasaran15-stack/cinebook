const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (filePath.endsWith('.js')) {
      results.push(filePath);
    }
  });
  return results;
}

const allJsFiles = walkDir(srcDir);

allJsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let hasChanges = false;
  
  // require('./...') or require('../...') regex
  content = content.replace(/require\(['"](\.[^'"]+)['"]\)/g, (match, p1) => {
    // Resolve absolute path
    const absolutePath = path.resolve(path.dirname(file), p1);
    
    // Check if it's inside srcDir
    if (absolutePath.startsWith(srcDir)) {
      // Calculate relative path from srcDir
      let relativeToSrc = path.relative(srcDir, absolutePath);
      relativeToSrc = relativeToSrc.replace(/\\/g, '/'); // Normalize for Windows
      hasChanges = true;
      return `require('@/${relativeToSrc}')`;
    }
    return match; // Keep as is if it goes outside src somehow
  });

  if (hasChanges) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Refactored: ${file}`);
  }
});
