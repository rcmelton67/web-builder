(function() {
    // 🔒 Activation Check
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && window.DEV_MODE !== true) {
        console.log("Dev Panel: Not in dev mode (hostname: " + window.location.hostname + ")");
        return;
    }

    // 🎨 Scoped CSS
    const styles = `
        #dev-panel-root {
            font-family: system-ui, -apple-system, sans-serif !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            color: #333 !important;
            z-index: 999999 !important;
        }
        
        #dev-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #222;
            color: #fff;
            border-radius: 50%;
            border: 2px solid #555;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 999999;
            font-weight: 800;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, background 0.2s;
        }

        #dev-toggle-btn:hover {
            transform: scale(1.05);
            background: #000;
        }

        #dev-panel-drawer {
            position: fixed;
            top: 0;
            right: -450px; /* Start off-screen */
            width: 420px;
            height: 100vh;
            background: #fff;
            box-shadow: -5px 0 25px rgba(0,0,0,0.15);
            z-index: 999998;
            transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            border-left: 1px solid #ddd;
        }

        #dev-panel-drawer.open {
            right: 0;
        }

        .dev-panel-header {
            padding: 20px;
            background: #f4f4f4;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .dev-panel-header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: #222;
        }

        .dev-close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }

        .dev-panel-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .dev-section {
            margin-bottom: 24px;
        }

        .dev-section h3 {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin: 0 0 8px 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 4px;
        }

        .dev-data-grid {
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: 8px;
            font-size: 13px;
        }

        .dev-label {
            font-weight: 600;
            color: #555;
            text-align: right;
            padding-right: 10px;
        }

        .dev-value {
            font-family: monospace;
            color: #222;
            word-break: break-all;
        }

        #dev-notes-area {
            width: 100%;
            height: 150px;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            font-family: inherit;
            font-size: 13px;
            resize: vertical;
            margin-bottom: 10px;
            background: #fafafa;
        }

        #dev-notes-area:focus {
            outline: 2px solid #222;
            background: #fff;
        }

        .dev-actions {
            padding: 20px;
            border-top: 1px solid #ddd;
            background: #f9f9f9;
            display: flex;
            gap: 10px;
        }

        .dev-btn {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #fff;
            font-weight: 600;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            text-align: center;
        }

        .dev-btn-primary {
            background: #222;
            color: #fff;
            border-color: #222;
        }

        .dev-btn-primary:hover {
            background: #444;
        }

        .dev-btn-secondary:hover {
            background: #eee;
        }

        .dev-copy-feedback {
            position: absolute;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: #222;
            color: #fff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        
        .dev-copy-feedback.show {
            opacity: 1;
        }
    `;

    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 🧩 Create UI Components
    const root = document.createElement('div');
    root.id = 'dev-panel-root';

    // Toggle Button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dev-toggle-btn';
    toggleBtn.innerText = 'DEV';
    
    // Panel Drawer
    const drawer = document.createElement('div');
    drawer.id = 'dev-panel-drawer';
    
    drawer.innerHTML = `
        <div class="dev-panel-header">
            <h2>Dev Context</h2>
            <button class="dev-close-btn">&times;</button>
        </div>
        <div class="dev-panel-content">
            <div class="dev-section">
                <h3>Page Metadata</h3>
                <div class="dev-data-grid" id="dev-metadata">
                    <!-- Populated by JS -->
                </div>
            </div>
            
            <div class="dev-section">
                <h3>Selection</h3>
                <div class="dev-data-grid">
                    <div class="dev-label">Selected:</div>
                    <div class="dev-value" id="dev-selection"><em>No text captured</em></div>
                </div>
            </div>

            <div class="dev-section">
                <h3>Developer Notes</h3>
                <textarea id="dev-notes-area" placeholder="Type your observation, bug report, or idea here..."></textarea>
            </div>
        </div>
        <div class="dev-actions">
            <button class="dev-btn dev-btn-secondary" id="dev-download-btn">Download .md</button>
            <button class="dev-btn dev-btn-primary" id="dev-copy-btn">Copy Report</button>
        </div>
        <div class="dev-copy-feedback" id="dev-feedback">Copied to Clipboard!</div>
    `;

    root.appendChild(toggleBtn);
    root.appendChild(drawer);
    document.body.appendChild(root);

    // ⚙️ Logic & State

    const els = {
        toggle: toggleBtn,
        drawer: drawer,
        close: drawer.querySelector('.dev-close-btn'),
        metadata: drawer.querySelector('#dev-metadata'),
        selection: drawer.querySelector('#dev-selection'),
        notes: drawer.querySelector('#dev-notes-area'),
        copyBtn: drawer.querySelector('#dev-copy-btn'),
        downloadBtn: drawer.querySelector('#dev-download-btn'),
        feedback: drawer.querySelector('#dev-feedback')
    };

    function getMetadata() {
        const h1 = document.querySelector('h1');
        const scrollPct = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        return {
            date: new Date().toISOString(),
            url: window.location.href,
            title: document.title,
            h1: h1 ? h1.innerText.trim() : 'N/A',
            viewport: `${window.innerWidth} x ${window.innerHeight}`,
            scroll: `${scrollPct || 0}%`,
            selection: window.getSelection().toString().trim()
        };
    }

    function renderMetadata() {
        const data = getMetadata();
        
        // Update selection UI
        els.selection.innerText = data.selection ? `"${data.selection}"` : 'None';
        els.selection.style.fontStyle = data.selection ? 'normal' : 'italic';

        // Render Grid
        els.metadata.innerHTML = `
            <div class="dev-label">Date:</div> <div class="dev-value">${new Date().toLocaleString()}</div>
            <div class="dev-label">URL:</div> <div class="dev-value">${data.url.replace(window.location.origin, '')}</div>
            <div class="dev-label">Title:</div> <div class="dev-value">${data.title}</div>
            <div class="dev-label">H1:</div> <div class="dev-value">${data.h1}</div>
            <div class="dev-label">Viewport:</div> <div class="dev-value">${data.viewport}</div>
            <div class="dev-label">Scroll:</div> <div class="dev-value">${data.scroll}</div>
        `;
        
        return data; // Return for use in report
    }

    function generateReport() {
        const data = getMetadata();
        const notes = els.notes.value.trim();
        
        return `## Dev Note
Date: ${data.date}
URL: ${data.url}
Title: ${data.title}
H1: ${data.h1}
Viewport: ${data.viewport}
Scroll: ${data.scroll}
Selection: ${data.selection || "None"}

### Notes
${notes || "(No notes provided)"}

---
`;
    }

    // Event Listeners

    els.toggle.addEventListener('click', () => {
        renderMetadata(); // Refresh data on open
        els.drawer.classList.add('open');
    });

    els.close.addEventListener('click', () => {
        els.drawer.classList.remove('open');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (els.drawer.classList.contains('open') && 
            !els.drawer.contains(e.target) && 
            !els.toggle.contains(e.target)) {
            els.drawer.classList.remove('open');
        }
    });

    els.copyBtn.addEventListener('click', async () => {
        const report = generateReport();
        try {
            await navigator.clipboard.writeText(report);
            showFeedback();
        } catch (err) {
            console.error('Failed to copy', err);
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = report;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showFeedback();
        }
    });

    els.downloadBtn.addEventListener('click', () => {
        const report = generateReport();
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dev-note-${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    function showFeedback() {
        els.feedback.classList.add('show');
        setTimeout(() => els.feedback.classList.remove('show'), 2000);
    }

    console.log("🚀 Dev Panel Injected");
})();
