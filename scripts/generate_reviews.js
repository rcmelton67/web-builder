const fs = require('fs');
const path = require('path');

const REVIEWS_DIR = path.join(__dirname, '../pages/reviews');
const OUT_DIR = path.join(REVIEWS_DIR, 'page');
const PAGE_SIZE = 50;

// Read Reviews
const r1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../reviews-1.json'), 'utf8'));
const r2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../reviews-2.json'), 'utf8'));
const allReviews = [...r1, ...r2].filter(r => typeof r.star_rating === 'number' && r.message);
const totalReviews = allReviews.length;
const totalPages = Math.ceil(totalReviews / PAGE_SIZE);

console.log(`Total Reviews: ${totalReviews}`);
console.log(`Total Pages: ${totalPages}`);

// Ensure Output Directory
if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Helper to generate Pagination HTML
function generatePagination(currentPage) {
    let html = '<nav class="pagination">';

    // Previous Link
    if (currentPage > 1) {
        const prevLink = currentPage === 2 ? '../../' : `../${currentPage - 1}/`;
        html += `<a href="${prevLink}">Prv</a>`;
    }

    // Pages
    // Show 1, current-2, current-1, current, current+1, current+2, last
    const showPages = new Set([1, totalPages]);
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        if (i > 1 && i < totalPages) showPages.add(i);
    }
    const sorted = [...showPages].sort((a, b) => a - b);

    let prev = 0;
    for (const p of sorted) {
        if (prev > 0 && p - prev > 1) {
            html += `<span style="padding:0 8px; display:flex; align-items:center;">...</span>`;
        }

        const isActive = p === currentPage;
        let link = '';
        if (p === 1) link = '../../';
        else link = `../${p}/`; // relative from page/X/ -> page/Y/ ? No.
        // If we are at page/5/, ../../ goes to reviews/.
        // ../5/ stays in page/? No.

        // Correct Relative Links for Page 2+ (located in /pages/reviews/page/X/)
        // Link to Page 1: ../../
        // Link to Page Y: ../Y/

        if (p === 1) link = '../../index.html';
        else link = `../${p}/index.html`;

        html += `<a href="${link}" class="${isActive ? 'active' : ''}">${p}</a>`;
        prev = p;
    }

    // Next Link
    if (currentPage < totalPages) {
        html += `<a href="../${currentPage + 1}/index.html">Nxt</a>`;
    }

    html += '</nav>';
    return html;
}

// Generate Page 1 (Modify existing file or overwriting it?)
// User wants page 1 to just be /reviews/index.html
// But I need to update its pagination HTML. I'll read it, replace pagination placeholder if exists, or append.
// Better: Read index.html as template.

const page1Path = path.join(REVIEWS_DIR, 'index.html');
let page1Content = fs.readFileSync(page1Path, 'utf8');

// Update Page 1 JS to handle pagination
// Replace the script logic to aware of page number
// Or I can inject a global var `window.reviewsPage = 1`
// And `window.reviewsTotalPages = 77`

const commonScript = `
    const REVIEWS_PER_PAGE = 50;
    // Determine page from URL or global
    let currentPage = 1;
    if (window.location.pathname.includes('/page/')) {
        const match = window.location.pathname.match(/\\/page\\/(\\d+)\\//);
        if (match) currentPage = parseInt(match[1]);
    }

    // ... inside renderReviews ...
    // Calculate slice
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    const end = start + REVIEWS_PER_PAGE;
    
    // Only slice if NOT searching/filtering
    if (!searchTerm && !activeStarFilter && !activePill) {
        // We are in default paginated view
        // But wait, the JSON has ALL reviews.
        // We just slice what we render.
        //filtered = filtered.slice(start, end); // Logic to be added
    }
`;

// Actually, I will generate the files.
// For Page 2+, the HTML structure is reduced.

const templatePage2 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pet Memorial Stone Reviews – Page {{PAGE_NUM}} | Melton Memorials</title>
    <meta name="description" content="Read real customer reviews of our handcrafted granite pet memorial stones. Page {{PAGE_NUM}}.">
    <link rel="canonical" href="https://meltonmemorials.com/reviews/page/{{PAGE_NUM}}/">
    <link rel="stylesheet" href="../../../../assets/css/styles.css">
    <link rel="stylesheet" href="../../../../assets/css/memorial-theme.css">
    <script src="../../../../assets/js/reviews-data.js"></script>
</head>
<body>
    <header class="site-header">
        <div class="container header-inner">
            <div class="brand">
                <a href="../../../../pages/home/index.html">
                    <div class="brand-main">
                        <span class="brand-top">MELTON</span>
                        <span class="brand-bottom">MEMORIALS</span>
                    </div>
                </a>
            </div>
             <nav class="main-nav">
                <a href="../../../../pages/custom-pet-memorial-stones/index.html">Memorials</a>
                <a href="../../../../pages/pet-memorial-guides/index.html">Guides</a>
                <a href="../../index.html">Reviews</a>
                <a href="#">About</a>
                <a href="#">Contact</a>
            </nav>
        </div>
    </header>
    <div class="page-band-dark"></div>

    <nav class="breadcrumb container">
        <a href="../../../../pages/home/index.html">Home</a> › <a href="../../index.html">Reviews</a> › <span>Page {{PAGE_NUM}}</span>
    </nav>

    <main class="container">
        <!-- Filter/Search UI (Preserved) -->
         <div class="reviews-topline">
          <div></div>
          <div class="search-box">
            <input type="text" id="review-search" placeholder="Search reviews..." aria-label="Search reviews">
            <button id="clear-search" class="clear-btn" aria-label="Clear search">×</button>
          </div>
        </div>
        <div id="search-status" class="search-status"></div>

        <div class="rating-secondary">
          <div class="pills-block">
            <div class="pills-label">Most Mentioned:</div>
            <div class="review-pills" id="review-pills"></div>
          </div>
        </div>

        <section class="review-grid" id="review-grid">
            <!-- Content loaded via JS -->
        </section>

        <!-- Pagination -->
        {{PAGINATION}}
    </main>

    <footer class="site-footer">
        <div class="container footer-content">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <div class="brand-main">
                            <span class="brand-top">MELTON</span>
                            <span class="brand-bottom">MEMORIALS</span>
                        </div>
                        <div class="brand-tagline">Love • Honor • Remembrance</div>
                    </div>
                    <p class="footer-description">
                        Handcrafted pet memorial stones, including granite, cast stone, and natural river rock designs,
                        crafted for lasting outdoor placement.
                        Each memorial stone is deeply engraved with care in Alma, Arkansas —
                        creating a permanent tribute for dogs, cats, and beloved companions.
                    </p>
                    <div class="footer-rating">★★★★★ <span>3,800+ Five-Star Reviews from Pet Memorial Families</span>
                    </div>
                </div>

                <div class="footer-column">
                    <h3>Shop</h3>
                    <a href="../../../../pages/custom-pet-memorial-stones/index.html">Pet Memorial Stones</a>
                    <a href="../../../../pages/products/granite-pet-memorial-stone/index.html">Granite Pet Memorial Stones</a>
                    <a href="../../../../pages/products/granite-pet-memorial-stone/create-your-memorial/index.html">Create Your
                        Memorial</a>
                </div>

                <div class="footer-column">
                    <h3>Resources</h3>
                    <a href="../../../../pages/pet-memorial-guides/index.html">Memorial Guides</a>
                    <a href="../../index.html">Customer Reviews</a>
                    <a href="#">About Us</a>
                    <a href="#">FAQ</a>
                </div>

                <div class="footer-column">
                    <h3>Contact</h3>
                    <p class="footer-contact-info">
                        <strong>Melton Memorials — Alma, Arkansas</strong><br><br>
                        <a href="mailto:rodney@meltonmemorials.com"
                            class="footer-email">rodney@meltonmemorials.com</a><br>
                        <a href="tel:+14794300716" class="footer-phone">(479) 430-0716</a>
                    </p>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <p>© 2026 Melton Memorials. All rights reserved.</p>
                    <div class="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <span>•</span>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <!-- Dev Panel -->
    <script src="../../../../dev/dev-panel.js"></script>

    <script>
    (function () {
      const grid = document.getElementById("review-grid");
      try {
        // Data loaded via <script src="...reviews-data.js">
        if (!window.ALL_REVIEWS) {
            console.error("Reviews data not loaded");
            return;
        }
        const reviews = window.ALL_REVIEWS;
        const searchInput = document.getElementById("review-search");
        const pillsEl = document.getElementById("review-pills");
        let activePill = null;
        let searchTerm = "";
        
        const validReviews = reviews.filter(r => typeof r.star_rating === "number" && r.message);
        
        // --- PAGINATION LOGIC ---
        const PAGE_SIZE = 50;
        const currentPage = {{PAGE_NUM}}; // Injected
        
        function normalizeText(s) { return (s || "").toLowerCase(); }

        function matchesFilters(r) {
          const msg = normalizeText(r.message);
          
          if (searchTerm) {
             const escaped = searchTerm.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
             // Use string concatenation to avoid template string nesting hell
             // We want the generated code to be: new RegExp('\\b' + escaped + '\\b', 'i')
             // So in the backticked Node script string:
             const regex = new RegExp('\\\\b' + escaped + '\\\\b', 'i');
             if (!regex.test(r.message)) return false;
          }

          if (activePill) {
             const pill = normalizeText(activePill);
             if (!msg.includes(pill)) return false;
          }
          return true;
        }

        const clearBtn = document.getElementById("clear-search");
        const statusEl = document.getElementById("search-status");

        function updateSearchUI() {
           if (searchInput && searchInput.value) {
             if (clearBtn) clearBtn.style.display = "block";
           } else {
             if (clearBtn) clearBtn.style.display = "none";
           }
        }
        
        if (clearBtn) {
           clearBtn.addEventListener("click", () => {
             if (searchInput) searchInput.value = "";
             searchTerm = "";
             updateSearchUI();
             renderReviews(validReviews);
           });
        }

        function renderReviews(list) {
          grid.innerHTML = "";
          let filtered = list.filter(matchesFilters);
          
          if (statusEl) {
             if (searchTerm || activePill) {
               statusEl.textContent = \`Found \${filtered.length} matches\`;
             } else {
               statusEl.textContent = '';
             }
          }
          
          // Apply Pagination Slice ONLY if defaults are active
          // If searching/filtering, show all results (or client-side page 1?)
          // For now, if searching, show all. If default, show slice.
          if (!searchTerm && !activePill) {
              const start = (currentPage - 1) * PAGE_SIZE;
              // Slice
              filtered = filtered.slice(start, start + PAGE_SIZE);
          }

          filtered.forEach(review => {
            const card = document.createElement("article");
            card.className = "review-card";
            const stars = "★".repeat(review.star_rating || 0);
            card.innerHTML = \`
              <div class="review-stars">\${stars}</div>
              <p class="review-text">\${review.message}</p>
              <div class="review-meta">
                <span class="review-author">\${review.reviewer || ""}</span>
                <span class="review-date">\${review.date_reviewed || ""}</span>
              </div>
            \`;
            grid.appendChild(card);
          });
          
          if (filtered.length === 0) {
             grid.innerHTML = '<div style="opacity:0.7; margin-top:1rem;">No reviews match your filters.</div>';
          }
        }
        
        // Pills Logic
        const defaultPills = ["Beautiful Memorial Stone","Highly Recommend","Customer Service","Exceeded Expectations","High Quality","Fast Shipping","Excellent Customer Service","Absolutely Beautiful"];
        function renderPills() {
          if (!pillsEl) return;
          pillsEl.innerHTML = "";
          defaultPills.forEach(label => {
            const pill = document.createElement("div");
            pill.className = "review-pill" + (activePill === label ? " active" : "");
            pill.textContent = label;
            pill.addEventListener("click", () => {
              activePill = (activePill === label) ? null : label;
              renderPills();
              renderReviews(validReviews);
            });
            pillsEl.appendChild(pill);
          });
        }

        if (searchInput) {
          searchInput.addEventListener("input", (e) => {
            searchTerm = normalizeText(e.target.value);
            updateSearchUI();
            renderReviews(validReviews);
          });
        }
        
        renderPills();
        renderReviews(validReviews);

      } catch (e) {
        console.error("Error rendering reviews:", e);
      }
    })();
    </script>
</body>
</html>`;

// --- GENERATE PAGES 2...N ---
for (let i = 2; i <= totalPages; i++) {
    const pageDir = path.join(OUT_DIR, i.toString());
    if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

    let content = templatePage2
        .replace(/{{PAGE_NUM}}/g, i)
        .replace('{{PAGINATION}}', generatePagination(i));

    fs.writeFileSync(path.join(pageDir, 'index.html'), content);
    console.log(`Generated Page ${i}`);
}

// --- UPDATE PAGE 1 ---
// We need to inject the pagination nav into Pages 1
// And update its script to slice the first 50.

// Helper for page 1 pagination (links need to be ./page/2/ etc)
function generatePaginationPage1() {
    let html = '<nav class="pagination">';
    // No prev

    const showPages = new Set([1, totalPages]);
    for (let i = 1; i <= 3; i++) { // show 1, 2, 3...
        if (i < totalPages) showPages.add(i);
    }
    const sorted = [...showPages].sort((a, b) => a - b);

    let prev = 0;
    for (const p of sorted) {
        if (prev > 0 && p - prev > 1) {
            html += `<span style="padding:0 8px; display:flex; align-items:center;">...</span>`;
        }
        const isActive = p === 1;
        let link = '';
        if (p === 1) link = './index.html'; // self
        else link = `page/${p}/index.html`; // relative to reviews/

        html += `<a href="${link}" class="${isActive ? 'active' : ''}">${p}</a>`;
        prev = p;
    }

    if (totalPages > 1) {
        html += `<a href="page/2/index.html">Nxt</a>`;
    }
    html += '</nav>';
    return html;
}

// Modify Page 1 contents
// 1. Add Pagination HTML before closing main
// 2. Update Script to slice 0-50

let p1 = page1Content;

// Inject or Replace Pagination
const paginationRegex = /<nav class="pagination">[\s\S]*?<\/nav>/;
const newPagination = generatePaginationPage1();

if (paginationRegex.test(p1)) {
    p1 = p1.replace(paginationRegex, newPagination);
} else {
    p1 = p1.replace('</section>\n\n    <section class="reviews-faq">',
        '</section>\n\n    ' + newPagination + '\n\n    <section class="reviews-faq">');
}

// Update Script logic for Page 1
// We need to insert the slicing logic into renderReviews in Page 1
const sliceLogic = `
          // Pagination Slice (Page 1)
          if (!searchTerm && !activePill && !activeStarFilter) {
              const start = 0; 
              filtered = filtered.slice(start, start + 50);
          }
`;

if (!p1.includes('// Pagination Slice')) {
    p1 = p1.replace('let filtered = list.filter(matchesFilters);',
        'let filtered = list.filter(matchesFilters);' + sliceLogic);
}

// Update Script logic for Page 1
// We need to inject the script tag for data
if (!p1.includes('src="../../assets/js/reviews-data.js"')) {
    p1 = p1.replace('</head>', '<script src="../../assets/js/reviews-data.js"></script>\n</head>');
}

// Replace the fetch logic in Page 1 with window.ALL_REVIEWS
const newScriptStart = `
    <script>
    (function () {
      const grid = document.getElementById("review-grid");
      try {
        if (!window.ALL_REVIEWS) return;
        const reviews = window.ALL_REVIEWS;
`;

// Regex to replace the async function up to const reviews...
const fetchRegex = /<script>\s*\(async function \(\) \{[\s\S]*?const reviews = \[...r1, ...r2\];/;

if (fetchRegex.test(p1)) {
    p1 = p1.replace(fetchRegex, newScriptStart);
} else {
    // Fallback if regex fails (maybe it was already modified or slightly different)
    // Try simpler replacement if the file was just reset or in consistent state
    p1 = p1.replace(/async function \(\) \{/, 'function() {');
    p1 = p1.replace(/const \[r1, r2\] = await Promise.all\(\[[\s\S]*?\]\);/, '');
    p1 = p1.replace(/const reviews = \[...r1, ...r2\];/, 'const reviews = window.ALL_REVIEWS;');
}

fs.writeFileSync(page1Path, p1);
console.log('Updated Page 1');
