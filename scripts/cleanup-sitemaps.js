const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');

// Delete old sitemap files
const cleanupSitemaps = () => {
  const files = fs.readdirSync(publicDir);
  files.forEach(file => {
    if (file.startsWith('sitemap') || file === 'robots.txt') {
      const filePath = path.join(publicDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
  });
};

cleanupSitemaps();
