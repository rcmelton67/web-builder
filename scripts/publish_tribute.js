const fs = require('fs');
const path = require('path');

// Configuration
const PENDING_DIR = path.join(__dirname, '../data/pending-tributes');
const PUBLISHED_JSON_DIR = path.join(__dirname, '../data/published-tributes');
const PAGES_DIR = path.join(__dirname, '../pages/memorials');
const ARCHIVE_DIR = path.join(__dirname, '../pet-tributes');
const TEMPLATE_PATH = path.join(__dirname, '../templates/tribute-template.html');
const INDEX_PATH = path.join(PAGES_DIR, 'index.html');
const ARCHIVE_INDEX_PATH = path.join(ARCHIVE_DIR, 'index.html');

// Helper to create slug from text
function createSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

// Helper to escape HTML special chars to prevent XSS in static pages
function escapeHtml(text) {
    if (!text) return "";
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

async function publishTributes() {
    console.log('Starting tribute publication process...');

    // 1. Verify directories exist
    if (!fs.existsSync(PENDING_DIR)) {
        console.error(`Pending directory not found: ${PENDING_DIR}`);
        return;
    }
    if (!fs.existsSync(PUBLISHED_JSON_DIR)) {
        fs.mkdirSync(PUBLISHED_JSON_DIR, { recursive: true });
    }

    // 2. Read contents
    const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    let indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

    // Find files
    const files = fs.readdirSync(PENDING_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
        console.log('No pending tributes found.');
        return;
    }

    console.log(`Found ${jsonFiles.length} tributes to publish.`);

    let newCardsHtml = '';

    for (const file of jsonFiles) {
        const filePath = path.join(PENDING_DIR, file);

        try {
            console.log(`Processing ${file}...`);
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);

            // Data extraction & cleaning
            const petName = data.petName || 'Unknown Pet';
            const petType = data.petType || 'Pet';
            const breed = data.breed || '';
            const yearsTogether = data.yearsTogether || '';
            const tributeStory = data.tributeStory || '';
            const firstName = data.firstName || data.ownerName || '';
            const state = data.state || '';

            // Handle Photo URL - Clean "File: " prefix if present
            let petPhotoUrl = data.petPhoto || '';
            if (petPhotoUrl.startsWith('File: ')) {
                petPhotoUrl = petPhotoUrl.substring(6);
            }
            // Assume image is in pages/memorials/images/ or relative to the page
            // We should use absolute path for OG tags, relative for src
            // Ideally, we move the image too, but for this script we assume the file name is correct 
            // and lives in ../images/ relative to the tribute page.
            // Since tribute page is in pages/memorials/slug/, images are in ../images/ (which is pages/memorials/images/)
            const photoSrc = `../images/${petPhotoUrl}`;

            // Memorial Photo
            let memorialPhotoUrl = data.memorialPhoto || '';
            if (memorialPhotoUrl.startsWith('File: ')) {
                memorialPhotoUrl = memorialPhotoUrl.substring(6);
            }
            const memorialPhotoSrc = memorialPhotoUrl ? `../images/${memorialPhotoUrl}` : '';

            // Generate Slug
            const slug = createSlug(petName);
            const tributeDir = path.join(PAGES_DIR, slug);
            const tributePagePath = path.join(tributeDir, 'index.html');
            const pageUrl = `https://meltonmemorials.com/memorials/${slug}/`;

            // Prepare replacements
            let html = template;
            html = html.replace(/{{Pet Name}}/g, escapeHtml(petName));
            html = html.replace(/{{Pet Name Slug}}/g, slug);
            html = html.replace(/{{Breed}}/g, escapeHtml(breed));
            html = html.replace(/{{Pet Type}}/g, escapeHtml(petType));
            html = html.replace(/{{Tribute Text Block}}/g, `<p>${escapeHtml(tributeStory).replace(/\n/g, '</p><p>')}</p>`);
            html = html.replace(/{{Tribute Snippet}}/g, escapeHtml(tributeStory.substring(0, 150)) + '...');
            html = html.replace(/{{Pet Photo URL}}/g, photoSrc);
            html = html.replace(/{{PAGE_URL}}/g, pageUrl);

            // Handle Conditional Block (Memorial Photo) manually since it's simple string replace
            if (memorialPhotoSrc) {
                html = html.replace(/{{#if Memorial Photo URL}}([\s\S]*?){{\/if}}/g, '$1'); // Show content
                html = html.replace(/{{Memorial Photo URL}}/g, memorialPhotoSrc);
            } else {
                html = html.replace(/{{#if Memorial Photo URL}}[\s\S]*?{{\/if}}/g, ''); // Remove content
            }

            // Create Directory
            if (!fs.existsSync(tributeDir)) {
                fs.mkdirSync(tributeDir, { recursive: true });
            }

            // Write HTML file
            fs.writeFileSync(tributePagePath, html);
            console.log(`- Created page: ${tributePagePath}`);

            // Generate dynamic date badge
            const now = new Date();
            const publishLabel = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            // Generate dynamic attribution
            let attributionHtml = '';
            if (firstName || state) {
                attributionHtml = '<div class="mm-archive-attribution">';
                if (firstName) {
                    attributionHtml += escapeHtml(firstName);
                    if (state) {
                        attributionHtml += `, ${escapeHtml(state)}`;
                    }
                } else {
                    attributionHtml += escapeHtml(state);
                }
                attributionHtml += '</div>';
            }

            // Generate Card HTML for Archive
            const excerpt = escapeHtml(tributeStory.substring(0, 120));
            const cardHtml = `
<article
  class="mm-archive-card"
  data-name="${escapeHtml(petName)}"
  data-breed="${escapeHtml(breed)}"
  data-years="${escapeHtml(yearsTogether)}"
  data-content="${escapeHtml(tributeStory.substring(0, 100))}"
>
  <a class="mm-archive-link" href="${slug}/">
    <div class="mm-archive-thumb">
      <span class="mm-date-badge">${publishLabel}</span>
      <img
        src="${slug}/${slug}.webp"
        alt="${escapeHtml(petName)} memorial tribute"
        loading="lazy"
      >
    </div>
    <div class="mm-archive-meta">
      <h2 class="mm-archive-title">${escapeHtml(petName)} \u2013 ${escapeHtml(breed)}</h2>
      <p class="mm-archive-excerpt">${excerpt}...</p>
      <p class="mm-archive-years">${escapeHtml(yearsTogether)}</p>
      ${attributionHtml}
    </div>
  </a>
</article>`;

            newCardsHtml += cardHtml + '\n';

            // Move JSON file
            const destPath = path.join(PUBLISHED_JSON_DIR, file);
            fs.renameSync(filePath, destPath);
            console.log(`- Moved JSON to: ${destPath}`);

        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    // 3. Update Archive Index Page
    if (newCardsHtml) {
        // Update pet-tributes/index.html using injection marker
        let archiveHtml = fs.readFileSync(ARCHIVE_INDEX_PATH, 'utf8');
        const archiveMarker = '<!-- MM:ARCHIVE_CARDS_START -->';
        const archiveMarkerIndex = archiveHtml.indexOf(archiveMarker);

        if (archiveMarkerIndex !== -1) {
            const insertPoint = archiveMarkerIndex + archiveMarker.length;
            const prefix = archiveHtml.substring(0, insertPoint);
            const suffix = archiveHtml.substring(insertPoint);
            archiveHtml = prefix + '\n\n' + newCardsHtml + '\n' + suffix;

            fs.writeFileSync(ARCHIVE_INDEX_PATH, archiveHtml);
            console.log('Updated pet-tributes/index.html with new tributes.');
        } else {
            console.error('Could not find MM:ARCHIVE_CARDS_START marker in pet-tributes/index.html');
        }
    }

    console.log('Publication process complete.');
}

publishTributes();
