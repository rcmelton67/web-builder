
const fs = require('fs');
const path = require('path');

const r1 = JSON.parse(fs.readFileSync('reviews-1.json', 'utf8'));
const r2 = JSON.parse(fs.readFileSync('reviews-2.json', 'utf8'));
const allReviews = [...r1, ...r2];

const keywords = ['dog', 'puppy', 'pup', 'fur baby'];
const exclude = ['necklace', 'pendant', 'urn', 'jewelry'];

let filtered = allReviews.filter(r => {
    const msg = (r.message || "").toLowerCase();
    if (exclude.some(bad => msg.includes(bad))) return false;
    return keywords.some(k => msg.includes(k));
});

// Sort Newest First (assuming date_reviewed is MM/DD/YYYY)
filtered.sort((a, b) => {
    const d1 = new Date(a.date_reviewed);
    const d2 = new Date(b.date_reviewed);
    return d2 - d1;
});

filtered = filtered.slice(0, 15);

let html = '';
filtered.forEach(r => {
    const stars = '★'.repeat(r.star_rating);
    html += `
    <article class="review-card">
        <div class="stars">${stars}</div>
        <p style="margin: 0.5rem 0; font-style:italic;">"${r.message.replace(/"/g, '&quot;')}"</p>
        <div style="font-size:0.9rem; color:#666;">
            <span>- ${r.reviewer || "Customer"}</span>
            <span style="float:right;">${r.date_reviewed}</span>
        </div>
    </article>
    `;
});

fs.writeFileSync('temp_reviews.html', html);
console.log("Reviews written to temp_reviews.html");
