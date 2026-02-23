
import os
import re

PROJECT_ROOT = r"c:\Users\rcmel\dev\Website Sandbox"
PAGES_DIR = os.path.join(PROJECT_ROOT, "pages")


def load_template(filename):
    path = os.path.join(PROJECT_ROOT, "templates", "components", filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

HEADER_TEMPLATE = load_template("master_header.html")
FOOTER_TEMPLATE = load_template("master_footer.html")
TRIBUTE_HEADER_TEMPLATE = load_template("tribute_header.html")
TRIBUTE_FOOTER_TEMPLATE = load_template("tribute_footer.html")


def get_relative_prefix(file_path):
    # Determine depth relative to PROJECT_ROOT
    # e.g. pages/home/index.html -> ../../
    
    dir_path = os.path.dirname(file_path)
    rel_path = os.path.relpath(dir_path, PROJECT_ROOT)
    
    if rel_path == ".":
        return ""
    
    # split by separator
    parts = rel_path.split(os.sep)
    depth = len(parts)
    
    return "../" * depth

PET_TRIBUTES_DIR = os.path.join(PROJECT_ROOT, "pet-tributes")

def update_file(file_path):
    print(f"Processing {file_path}...")
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    prefix = get_relative_prefix(file_path)
    
    # Determine which template to use
    is_tribute = "pet-tributes" in file_path
    header_tmpl = TRIBUTE_HEADER_TEMPLATE if is_tribute else HEADER_TEMPLATE
    footer_tmpl = TRIBUTE_FOOTER_TEMPLATE if is_tribute else FOOTER_TEMPLATE

    # 1. Update Header
    header_regex = re.compile(r'(<header[^>]*>)[\s\S]*?</header>', re.IGNORECASE | re.DOTALL)
    match = header_regex.search(content)
    
    if match:
        opening_tag = match.group(1)
        template_inner_match = re.search(r'<header.*?>([\s\S]*?)</header>', header_tmpl.replace("{{PREFIX}}", prefix))
        if template_inner_match:
            new_inner_html = template_inner_match.group(1).strip()
            new_block = f"{opening_tag}\n{new_inner_html}\n</header>"
            content = content[:match.start()] + new_block + content[match.end():]
    
    # 2. Update Footer
    footer_regex = re.compile(r'(<footer[^>]*>)([\s\S]*?)(</footer>)', re.IGNORECASE | re.DOTALL)
    footer_match = footer_regex.search(content)
    
    template_inner_match_footer = re.search(r'<footer.*?>([\s\S]*?)</footer>', footer_tmpl.replace("{{PREFIX}}", prefix))
    
    if footer_match and template_inner_match_footer:
        new_inner_footer = template_inner_match_footer.group(1).strip()
        opening_tag = footer_match.group(1)
        new_block = f"{opening_tag}\n{new_inner_footer}\n</footer>"
        content = content[:footer_match.start()] + new_block + content[footer_match.end():]

    # 3. Remove Obsolete .page-band-dark
    content = re.sub(r'<!--\s*DARK BAND\s*-->\s*<div class="page-band-dark"></div>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<div class="page-band-dark"></div>', '', content, flags=re.IGNORECASE)

    # 4. Force CSS Cache Busting & Standardize Stylesheets
    # Replace style.css OR header-footer.css with global styles.css?v=hardreset3
    content = re.sub(
        r'href="([^"]*?)(?:styles|header-footer)\.css(?:\?v=[^"]*)?"', 
        f'href="{prefix}assets/css/styles.css?v=hardreset3"', 
        content
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

def main():
    # Process pages directory
    for root, dirs, files in os.walk(PAGES_DIR):
        for file in files:
            if file == "index.html":
                update_file(os.path.join(root, file))
                
    # Process pet-tributes directory
    for root, dirs, files in os.walk(PET_TRIBUTES_DIR):
        for file in files:
            if file == "index.html":
                update_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
