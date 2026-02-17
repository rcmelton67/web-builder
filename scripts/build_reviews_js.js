const fs = require('fs');
const path = require('path');

const r1Path = path.join(__dirname, '../reviews-1.json');
const r2Path = path.join(__dirname, '../reviews-2.json');
const outPath = path.join(__dirname, '../assets/js/reviews-data.js');

const r1 = JSON.parse(fs.readFileSync(r1Path, 'utf8'));
const r2 = JSON.parse(fs.readFileSync(r2Path, 'utf8'));
const allReviews = [...r1, ...r2];

const content = `window.ALL_REVIEWS = ${JSON.stringify(allReviews)};`;

fs.writeFileSync(outPath, content);
console.log(`Created ${outPath} with ${allReviews.length} reviews.`);
