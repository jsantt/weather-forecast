const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
let content = fs.readFileSync(sitemapPath, 'utf8');

// Get current date/time in ISO format (YYYY-MM-DDTHH:MM:SSZ)
const currentDateTime = new Date().toISOString();

// Replace all lastmod with current date/time
content = content.replace(
  /<lastmod>[^<]*<\/lastmod>/g,
  `<lastmod>${currentDateTime}</lastmod>`
);

fs.writeFileSync(sitemapPath, content, 'utf8');
console.log(`Sitemap lastmod updated to ${currentDateTime}`);
