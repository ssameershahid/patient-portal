const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist', 'public');

function flatten(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '_next' || entry.name === '404') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const indexHtml = path.join(full, 'index.html');
      if (fs.existsSync(indexHtml)) {
        const htmlDest = full + '.html';
        if (!fs.existsSync(htmlDest)) {
          fs.copyFileSync(indexHtml, htmlDest);
        }
      }
      flatten(full);
    }
  }
}

flatten(distDir);
console.log('Static files flattened successfully');
