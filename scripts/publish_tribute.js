const fs = require('fs');
const path = require('path');

// Configuration
const PENDING_DIR = path.join(__dirname, '../data/pending-tributes');
const PUBLISHED_JSON_DIR = path.join(__dirname, '../data/published-tributes');
const PAGES_DIR = path.join(__dirname, '../pages/memorials');
const TEMPLATE_PATH = path.join(__dirname, '../templates/tribute-template.html');
const INDEX_PATH = path.join(PAGES_DIR, 'index.html');

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

            // Generate Card HTML for Index
            const cardHtml = `
            <div class="tribute-card">
                <a href="${slug}/index.html" class="tribute-link">
                    <div class="tribute-card-image">
                        <img src="images/${petPhotoUrl}" alt="${escapeHtml(petName)}" loading="lazy">
                    </div>
                    <div class="tribute-card-content">
                        <h3>${escapeHtml(petName)}</h3>
                        <div class="tribute-meta">${escapeHtml(petType)} ${breed ? '• ' + escapeHtml(breed) : ''}</div>
                    </div>
                </a>
            </div>`;

            newCardsHtml += cardHtml + '\n';

            // Move JSON file
            const destPath = path.join(PUBLISHED_JSON_DIR, file);
            fs.renameSync(filePath, destPath);
            console.log(`- Moved JSON to: ${destPath}`);

        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    // 3. Update Index Page
    if (newCardsHtml) {
        // Find the tribute-grid div
        const gridMarker = '<div class="tribute-grid"';
        const gridStartIndex = indexHtml.indexOf(gridMarker);

        if (gridStartIndex !== -1) {
            // Find the closing > of the opening tag
            const openTagEnd = indexHtml.indexOf('>', gridStartIndex);
            if (openTagEnd !== -1) {
                // Insert new cards immediately after opening tag
                const prefix = indexHtml.substring(0, openTagEnd + 1);
                const suffix = indexHtml.substring(openTagEnd + 1);
                indexHtml = prefix + '\n' + newCardsHtml + suffix;

                fs.writeFileSync(INDEX_PATH, indexHtml);
                console.log('Updated pages/memorials/index.html with new tributes.');
            } else {
                console.error('Could not find end of tribute-grid opening tag.');
            }
        } else {
            console.error('Could not find .tribute-grid div in index.html');
        }
    }

    console.log('Publication process complete.');
}

publishTributes();
