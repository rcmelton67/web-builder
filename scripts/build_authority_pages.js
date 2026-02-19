const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const REVIEWS_DIR = path.join(__dirname, '../pages');
const R1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../reviews-1.json'), 'utf8'));
const R2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../reviews-2.json'), 'utf8'));
const ALL_REVIEWS = [...R1, ...R2].filter(r => typeof r.star_rating === 'number' && r.message);

const CAT_INCLUDE = /\b(cat|kitty|kitten)\b/i;
const EXCLUDE = /\b(necklace|pendant|jewelry|urn)\b/i;

function filterCatReviews(reviews) {
    const filtered = reviews.filter(r => {
        const text = (r.message || "") + " " + (r.title || "");
        return CAT_INCLUDE.test(text) && !EXCLUDE.test(text);
    });



    return filtered
        .sort((a, b) => new Date(b.date_reviewed) - new Date(a.date_reviewed))
        .slice(0, 15);
}

const PAGES = [
    {
        slug: 'dog-memorial-stones',
        title: 'Dog Memorial Stones for Garden & Outdoor Tribute | Melton Memorials',
        h1: 'Dog Memorial Stones for Garden & Outdoor Tribute',
        meta_desc: 'Handcrafted dog memorial stones and grave markers. Create a lasting granite or river rock tribute for your beloved dog. Weatherproof & deeply engraved.',
        keywords: ['dog', 'pup', 'puppy', 'canine'],
        related_links: `
          Explore related memorial options including 
          <a href="../../pages/products/granite-pet-memorial-stone/index.html" style="color: #2c5282; text-decoration: underline;">granite memorial stones</a>, 
          <a href="../../pages/custom-pet-memorial-stones/index.html" style="color: #2c5282; text-decoration: underline;">natural river rock memorials</a>, 
          or browse all 
          <a href="../../pages/custom-pet-memorial-stones/index.html" style="color: #2c5282; text-decoration: underline;">custom pet memorial stones</a>.
        `,
        intro: `
            <p class="lead-text">Honoring the unconditional love of a faithful companion requires a tribute that endures as long as the memories.</p>
            <p>At Melton Memorials, we specialize in <strong>handcrafted dog memorial stones</strong> designed specifically for outdoor garden placement. Unlike temporary markers that fade or crack, our memorials are crafted from solid <strong>granite</strong>, durable <strong>cast stone</strong>, and natural <strong>river rock</strong>.</p>
            <p>Each stone features <strong>deep engraving</strong> that withstands rain, sun, and snow, ensuring your dog's name and tribute remain legible for generations. whether you need a subtle garden accent or a substantial <strong>dog grave marker</strong>, our collection offers a dignified way to mark their resting place.</p>
        `,
        faqs: [
            { q: "How long will a dog memorial stone last outdoors?", a: "Our granite and cast stone memorials are engineered for permanence. They are weatherproof, freeze-thaw resistant, and built to last safely outdoors for decades without fading or cracking." },
            { q: "Can I include my dog's paw print?", a: "Yes. We can engrave custom paw prints. You can upload a photo of your dog's actual paw print, or choose from our library of breed-specific designs." },
            { q: "what is the best material for a dog garden marker?", a: "Granite is the gold standard for durability and contrast. However, natural river rock offers a more organic, subtle look that blends beautifully into flower beds and gardens." },
            { q: "Do you offer different sizes for large dogs?", a: "Yes. We offer stones ranging from small 6-inch markers up to large 12-inch+ monuments suitable for larger breeds or longer inscriptions." },
            { q: "How do I clean my dog's memorial stone?", a: "Simple water and a soft brush are usually sufficient. For granite, you can use a mild dish soap. Avoid harsh chemicals or wire brushes that could damage the lithichrome paint." }
        ]
    },
    {
        slug: 'cat-memorial-stones',
        title: 'Cat Memorial Stones & Grave Markers | Melton Memorials',
        h1: 'Cat Memorial Stones for Garden & Outdoor Tribute',
        reviews: filterCatReviews(ALL_REVIEWS),
        meta_desc: 'Beautiful cat memorial stones and grave markers. Honor your feline friend with a durable, engraved granite or river rock memorial. Perfect for gardens.',
        keywords: ['cat', 'kitty', 'kitten', 'feline'],
        related_links: `
          Consider our durable 
          <a href="../../pages/products/granite-pet-memorial-stone/index.html" style="color: #2c5282; text-decoration: underline;">granite pet memorial stones</a> 
          for a permanent tribute, or view our full collection of 
          <a href="../../pages/custom-pet-memorial-stones/index.html" style="color: #2c5282; text-decoration: underline;">custom pet memorial stones</a> 
          for more design options.
        `,
        intro: `
            <p class="lead-text">A quiet engaging presence in the garden, a cat's memory deserves a touch of permanence.</p>
            <p>Our collection of <strong>cat memorial stones</strong> is designed to reflect the elegance and spirit of your feline companion. Crafted from <strong>solid granite</strong> and natural stone, these markers provide a weatherproof tribute that blends naturally with your landscape.</p>
            <p>We use <strong>deep engraving</strong> techniques to ensure that your cat's name and epitaph are permanently etched into the stone. From sleeping cat motifs to simple, elegant text, our <strong>cat grave markers</strong> are built to withstand the elements year-round.</p>
        `,
        faqs: [
            { q: "Are these stones safe for outdoor cat graves?", a: "Absolutely. We use only outdoor-rated granite, river rock, and cast stone. They are impervious to moisture and frost, making them perfect for marking a backyard resting place." },
            { q: "Can I engrave a cat silhouette?", a: "Yes. We have a wide selection of cat silhouettes, including sitting cats, sleeping cats, and playful poses. You can also upload your own custom design." },
            { q: "How heavy are the cat memorial stones?", a: "Weights vary by size and material. Our river rocks typically weigh 5-15 lbs, while solid granite markers can weigh 15-25 lbs, ensuring they stay in place even in strong winds." },
            { q: "What is the turnaround time for a cat memorial?", a: "Because every stone is custom engraved in our Arkansas studio, production typically takes 7-10 business days before shipping." },
            { q: "Do you make markers for other small pets?", a: "Yes. While we specialize in dog and cat memorials, we frequently craft stones for rabbits, guinea pigs, and other beloved small companions." }
        ]
    },
    {
        slug: 'pet-memorial-gifts',
        title: 'Pet Memorial Gifts & Sympathy Stones | Melton Memorials',
        h1: 'Pet Memorial Gifts & Sympathy Stones',
        meta_desc: 'Meaningful pet memorial gifts for those grieving the loss of a dog or cat. deep engraved natural stones made in the USA. A lasting alternative to flowers.',
        keywords: ['gift', 'present', 'loss', 'sympathy', 'grieving'],
        related_links: `
          Browse specific tributes for 
          <a href="../../pages/dog-memorial-stones/index.html" style="color: #2c5282; text-decoration: underline;">dog memorial stones</a> 
          or 
          <a href="../../pages/cat-memorial-stones/index.html" style="color: #2c5282; text-decoration: underline;">cat memorial stones</a>, 
          or see our complete 
          <a href="../../pages/custom-pet-memorial-stones/index.html" style="color: #2c5282; text-decoration: underline;">memorial stone collection</a>.
        `,
        intro: `
            <p class="lead-text">When words fail, a lasting tribute speaks volumes.</p>
            <p>Finding the right <strong>pet memorial gift</strong> for a grieving friend or family member can be difficult. Flowers fade, but a custom engraved stone is a permanent reminder of the love they shared. Our <strong>sympathy stones</strong> are handcrafted in Alma, Arkansas, and designed to last a lifetime.</p>
            <p>Whether it's a small river rock with a simple message like "Always in our Hearts" or a personalized <strong>granite marker</strong>, these gifts provide a tangible place for healing and remembrance in a favorite garden spot.</p>
        `,
        faqs: [
            { q: "Is a memorial stone a good gift for pet loss?", a: "Yes. Unlike flowers or cards, a memorial stone is a permanent tribute. It offers the grieving owner a physical place to visit and remember their pet, aiding in the healing process." },
            { q: "Can I have the gift shipped directly to the recipient?", a: "Yes. We can ship directly to the grieving family. We do not include pricing in the packing slip for gift orders." },
            { q: "What if I don't know the dates?", a: "It is common to gift a stone with just the pet's name or a simple phrase like 'Forever Loved'. You don't need dates to create a beautiful, meaningful tribute." },
            { q: "Do these gifts work for apartments?", a: "Yes. Our smaller river rocks and cast stones are perfect for balconies, patios, or even indoor display on a bookshelf or mantle." },
            { q: "Can I add a gift message?", a: "Yes. You can include a personalized gift note at checkout, which we will include with the package." }
        ]
    },
    {
        slug: 'pet-memorial-markers',
        title: 'Pet Memorial Markers & Grave Headstones | Melton Memorials',
        h1: 'Pet Memorial Markers & Grave Headstones',
        meta_desc: 'Durable pet memorial markers and headstones. Solid granite and natural stone grave markers for dogs and cats. Deeply engraved for permanent outdoor use.',
        keywords: ['marker', 'grave', 'headstone', 'burial'],
        related_links: `
           View our durable 
           <a href="../../pages/products/granite-pet-memorial-stone/index.html" style="color: #2c5282; text-decoration: underline;">granite headstones</a> 
           or explore our specific 
           <a href="../../pages/dog-memorial-stones/index.html" style="color: #2c5282; text-decoration: underline;">dog memorial markers</a> 
           for more tribute ideas.
        `,
        intro: `
            <p class="lead-text">Marking a final resting place is a sacred act of remembrance.</p>
            <p>Our <strong>pet memorial markers</strong> are built to serve as permanent, dignified headstones for your beloved companion. We understand that a grave marker needs to withstand the test of time, weather, and seasons.</p>
            <p>Utilizing <strong>solid granite</strong>—the same material used in human monuments—and natural river rock, we create <strong>pet grave markers</strong> that are impervious to freeze-thaw cycles. Each marker is deep-engraved, ensuring the epitaph remains clear and legible for decades to come.</p>
        `,
        faqs: [
            { q: "What makes a good pet grave marker?", a: "Durability is key. Granite and natural hard stone are the best choices because they do not absorb moisture, preventing cracking during freezing temperatures." },
            { q: "Can these markers be placed flat on the ground?", a: "Yes. Our markers are heavy and stable enough to be placed directly on the earth, sod, or within a garden bed. They do not require a poured concrete foundation." },
            { q: "How deep is the engraving?", a: "We deep-engrave all our stones, cutting well below the surface. We then treat the lettering with monument-grade lithichrome paint for maximum contrast and longevity." },
            { q: "Do you make custom shapes?", a: "Our natural river rocks come in unique, organic shapes. For granite, we offer standard rectangular and square sizes that provide a traditional headstone appearance." },
            { q: "Can I install the marker myself?", a: "Yes. No special tools are needed. simply clear a small area of ground to ensure it sits level, and place the stone. It's an easy DIY process." }
        ]
    }
];

// --- HTML TEMPLATE ---
const HTML_TEMPLATE = (page, reviewsHtml, faqHtml, schemaJson) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <meta name="description" content="${page.meta_desc}">
    <link rel="canonical" href="https://meltonmemorials.com/pages/${page.slug}/">
    <link rel="stylesheet" href="../../assets/css/styles.css">
    <link rel="stylesheet" href="../../assets/css/memorial-theme.css">
    <!-- Reviews CSS override for static display if needed -->
    <style>
        .review-card { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .review-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
        .stars { color: #d4a017; letter-spacing: 2px; }
        .faq-item { margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
        .faq-question { font-weight: 700; font-size: 1.1rem; color: #333; margin-bottom: 0.5rem; cursor: pointer; }
        .faq-answer { color: #555; line-height: 1.6; }
        .hero-section { background: #f9f9f9; padding: 4rem 0; text-align: center; margin-bottom: 3rem; }
        .hero-section h1 { margin-bottom: 1.5rem; }
        .lead-text { font-size: 1.2rem; color: #444; max-width: 800px; margin: 0 auto; }
        .materials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 3rem 0; }
        @media(max-width:768px) { .materials-grid { grid-template-columns: 1fr; } }
        .material-card { background: #eee; padding: 2rem; text-align: center; border-radius: 8px; text-decoration: none; color: #333; transition: background .2s; }
        .material-card:hover { background: #e0e0e0; }
        .cta-box { background: #333; color: #fff; padding: 3rem; text-align: center; border-radius: 8px; margin: 4rem 0; }
        .cta-btn { display: inline-block; background: #fff; color: #333; padding: 1rem 2rem; text-decoration: none; font-weight: bold; border-radius: 4px; margin-top: 1rem; }
        .cta-btn:hover { background: #f0f0f0; }
    </style>
    ${schemaJson}
</head>
<body>
    <header class="site-header">
        <div class="container header-inner">
             <div class="brand">
                <a href="../../pages/home/index.html">
                    <div class="brand-main">
                        <span class="brand-top">MELTON</span>
                        <span class="brand-bottom">MEMORIALS</span>
                    </div>
                </a>
            </div>
             <nav class="main-nav">
                <a href="../../pages/custom-pet-memorial-stones/index.html">Memorials</a>
                <a href="../../pages/pet-memorial-guides/index.html">Guides</a>
                <a href="../../pages/reviews/index.html">Reviews</a>
                <a href="#">About</a>
                <a href="#">Contact</a>
            </nav>
        </div>
    </header>

    <div class="page-band-dark"></div>

    <nav class="breadcrumb container">
        <a href="../../pages/home/index.html">Home</a> › <span>${page.h1}</span>
    </nav>

    <main class="container">
        
        <section class="hero-section">
            <h1>${page.h1}</h1>
            <div class="intro-content">
                ${page.intro}
            </div>
        </section>

        <section class="materials-section">
            <h2 style="text-align:center;">Materials Available</h2>
            <div class="materials-grid">
                <a href="../../pages/products/granite-pet-memorial-stone/index.html" class="material-card">
                    <h3>Granite</h3>
                    <p>Standard for durability</p>
                </a>
                <a href="../../pages/custom-pet-memorial-stones/index.html" class="material-card">
                    <h3>River Rock</h3>
                    <p>Natural & Organic</p>
                </a>
                <a href="../../pages/custom-pet-memorial-stones/index.html" class="material-card">
                    <h3>Cast Stone</h3>
                    <p>Classic & Smooth</p>
                </a>
            </div>
        </section>

        <section class="reviews-section">
            <h2 style="text-align:center;">Real Customer Reviews</h2>
            <!-- START REVIEWS -->
            <div class="review-grid">
                ${reviewsHtml}
            </div>
            <!-- END REVIEWS -->
            <div style="text-align:center; margin-top:2rem;">
                <a href="../../pages/reviews/index.html" style="text-decoration:underline;">Read All Reviews</a>
            </div>
        </section>

        <section class="faq-section">
            <h2 style="text-align:center; margin-top:4rem; margin-bottom:2rem;">Frequently Asked Questions</h2>
            ${faqHtml}
        </section>

        <div class="cta-box">
            <h2>Ready to Create a Lasting Tribute?</h2>
            <p>Design your custom pet memorial stone today.</p>
            <a href="../../pages/products/granite-pet-memorial-stone/create-your-memorial/index.html" class="cta-btn">Create Your Memorial</a>
        </div>

    </main>

    <section class="related-silos subtle-silo">
      <div class="container">
        <p>
          ${page.related_links}
        </p>
      </div>
    </section>

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
                    <a href="../../pages/custom-pet-memorial-stones/index.html">Pet Memorial Stones</a>
                    <a href="../../pages/products/granite-pet-memorial-stone/index.html">Granite Pet Memorial Stones</a>
                    <a href="../../pages/products/granite-pet-memorial-stone/create-your-memorial/index.html">Create Your
                        Memorial</a>
                </div>

                <div class="footer-column">
                    <h3>Resources</h3>
                    <a href="../../pages/pet-memorial-guides/index.html">Memorial Guides</a>
                    <a href="../../pages/reviews/index.html">Customer Reviews</a>
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
    <script src="../../dev/dev-panel.js"></script>
</body>
</html>`;

// --- BUILDER ---

PAGES.forEach(page => {
    console.log(`Building: ${page.title}`);

    // 1. Filter Reviews
    // 1. Filter Reviews
    let filtered;
    if (page.reviews) {
        filtered = page.reviews;
    } else {
        const keywords = page.keywords;
        filtered = ALL_REVIEWS.filter(r => {
            const msg = (r.message || "").toLowerCase();
            // Exclusion Logic
            if (msg.includes('necklace') || msg.includes('pendant') || msg.includes('jewelry') || msg.includes('urn')) return false;

            return keywords.some(k => msg.includes(k));
        });

        // Sort Newest First
        filtered.sort((a, b) => {
            const d1 = new Date(a.date_reviewed);
            const d2 = new Date(b.date_reviewed);
            return d2 - d1;
        });

        filtered = filtered.slice(0, 15); // Max 15
    }

    let reviewsHtml = '';
    filtered.forEach(r => {
        const stars = '★'.repeat(r.star_rating);
        reviewsHtml += `
            <article class="review-card">
                <div class="stars">${stars}</div>
                <p style="margin: 0.5rem 0; font-style:italic;">"${r.message}"</p>
                <div style="font-size:0.9rem; color:#666;">
                    <span>- ${r.reviewer || "Customer"}</span>
                    <span style="float:right;">${r.date_reviewed}</span>
                </div>
            </article>
        `;
    });

    if (filtered.length === 0) {
        reviewsHtml = '<p>No specific reviews found, but we have thousands of verified 5-star reviews.</p>';
    }

    const outDir = path.join(REVIEWS_DIR, page.slug);
    const outFile = path.join(outDir, 'index.html');

    if (fs.existsSync(outFile)) {
        // PARTIAL UPDATE
        let existing = fs.readFileSync(outFile, 'utf8');
        // Regex to replace content between markers
        const reviewRegex = /<!-- START REVIEWS -->[\s\S]*?<!-- END REVIEWS -->/;

        if (reviewRegex.test(existing)) {
            const newGrid = `<!-- START REVIEWS -->
            <div class="review-grid">
                ${reviewsHtml}
            </div>
            <!-- END REVIEWS -->`;
            existing = existing.replace(reviewRegex, newGrid);
            fs.writeFileSync(outFile, existing);
            console.log(`Updated Reviews in: ${outFile}`);
        } else {
            console.log(`WARNING: Could not find review markers in ${outFile}. Skipping update.`);
        }
    } else {
        // FULL GENERATION (First Run)

        // 2. Generate FAQ HTML & Schema (Only for initial creation)
        let faqHtml = '';
        const schemaFAQ = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
        };

        page.faqs.forEach(item => {
            faqHtml += `
                <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <div class="faq-question" itemprop="name">${item.q}</div>
                    <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <div itemprop="text">${item.a}</div>
                    </div>
                </div>
            `;
            schemaFAQ.mainEntity.push({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.a
                }
            });
        });

        // 3. Organization / Breadcrumb Schema (Graph)
        const schemaGraph = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": "https://meltonmemorials.com/#organization",
                    "name": "Melton Memorials",
                    "url": "https://meltonmemorials.com/",
                    "logo": "https://meltonmemorials.com/assets/images/logo.webp"
                },
                {
                    "@type": "WebSite",
                    "@id": "https://meltonmemorials.com/#website",
                    "url": "https://meltonmemorials.com/",
                    "name": "Melton Memorials",
                    "publisher": { "@id": "https://meltonmemorials.com/#organization" }
                },
                {
                    "@type": "WebPage",
                    "@id": `https://meltonmemorials.com/pages/${page.slug}/#webpage`,
                    "url": `https://meltonmemorials.com/pages/${page.slug}/`,
                    "name": page.title,
                    "description": page.meta_desc,
                    "breadcrumb": { "@id": `https://meltonmemorials.com/pages/${page.slug}/#breadcrumb` }
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": `https://meltonmemorials.com/pages/${page.slug}/#breadcrumb`,
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://meltonmemorials.com/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": page.h1
                        }
                    ]
                },
                schemaFAQ
            ]
        };

        const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(schemaGraph, null, 2)}\n</script>`;
        const finalHtml = HTML_TEMPLATE(page, reviewsHtml, faqHtml, schemaScript);

        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        fs.writeFileSync(outFile, finalHtml);
        console.log(`Created New: ${outFile}`);
    }
});

console.log("Authority Pages Build Complete.");
