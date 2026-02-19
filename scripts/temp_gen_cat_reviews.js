const fs = require('fs');
const path = require('path');

// Load reviews
const reviewsPath = path.join(__dirname, '../data/reviews.json');
const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));

// Filter for Cat related reviews
// Keywords: cat, kitty, kitten
// Exclude: necklace, pendant, jewelry, urn
const catReviews = reviews.filter(review => {
    const textContent = (review.text || "").toLowerCase() + " " + (review.title || "").toLowerCase();
    const isCat = textContent.includes('cat') || textContent.includes('kitty') || textContent.includes('kitten');
    const isExcluded = textContent.includes('necklace') || textContent.includes('pendant') || textContent.includes('jewelry') || textContent.includes('urn');
    return isCat && !isExcluded;
});

// Sort by date (newest first)
// Parsing format "YYYY-MM-DD"
function parseDate(dateStr) {
    if (!dateStr) return 0;
    return new Date(dateStr).getTime();
}

catReviews.sort((a, b) => parseDate(b.date) - parseDate(a.date));

// Limit to 15
const selectedReviews = catReviews.slice(0, 15);

// Generate HTML
let html = '';
selectedReviews.forEach(review => {
    // Generate stars visual
    let stars = '★★★★★';
    if (review.rating && review.rating < 5) {
        stars = '★'.repeat(review.rating);
    }

    // Format date from YYYY-MM-DD to MM/DD/YYYY for display if needed, or keep as is.
    // The previous file had MM/DD/YYYY. Let's try to match that.
    let displayDate = review.date;
    try {
        const d = new Date(review.date);
        // Manual formatting to ensure MM/DD/YYYY
        // const month = (d.getMonth() + 1).toString().padStart(2, '0');
        // const day = (d.getDate() + 1).toString().padStart(2, '0'); // Helper handling timezone offset issues? 
        // Actually just split and reorder if YYYY-MM-DD
        const parts = review.date.split('-');
        if (parts.length === 3) {
            displayDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
        }
    } catch (e) { }

    html += `
    <article class="review-card">
        <div class="stars">${stars}</div>
        <p style="margin: 0.5rem 0; font-style:italic;">"${review.text}"</p>
        <div style="font-size:0.9rem; color:#666;">
            <span>- ${review.reviewer}</span>
            <span style="float:right;">${displayDate}</span>
        </div>
    </article>
    `;
});

fs.writeFileSync('temp_cat_reviews.html', html);
console.log("Cat reviews generated to temp_cat_reviews.html");
