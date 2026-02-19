
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

def update_file(file_path):
    print(f"Processing {file_path}...")
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    prefix = get_relative_prefix(file_path)
    
    # 1. Update Header
    # Capture existing classes
    # 1. Update Header
    # Capture existing classes
    # Use DOTALL to handle newlines in attributes
    header_regex = re.compile(r'<header class="([^"]*?)".*?>[\s\S]*?</header>', re.IGNORECASE | re.DOTALL)
    match = header_regex.search(content)
    
    if match:
        existing_classes = match.group(1)
        # Create new header
        new_header = HEADER_TEMPLATE.replace("{{PREFIX}}", prefix).replace("{{HEADER_CLASSES}}", existing_classes).strip()
        
        # We need to replace the WHOLE header tag, including attributes if we want to be clean, 
        # BUT the regex captured generic attributes in .*? so we might lose style="..." if distinct from class.
        # Let's be more precise: Capture entire opening tag attributes.
        
        precise_header_regex = re.compile(r'(<header[^>]*>)[\s\S]*?</header>', re.IGNORECASE | re.DOTALL)
        precise_match = precise_header_regex.search(content)
        
        if precise_match:
            opening_tag = precise_match.group(1)
            # We want to keep the opening tag AS IS, just replace the inner content.
            # BUT my HTML template has the opening tag in it.
            # So I should extract the INNER content of my template.
            
            template_inner_match = re.search(r'<header.*?>([\s\S]*?)</header>', HEADER_TEMPLATE.replace("{{PREFIX}}", prefix))
            if template_inner_match:
                new_inner_html = template_inner_match.group(1).strip()
                
                # Use string slicing based on precise_match indices to guarantee replacement
                start_idx = precise_match.start()
                end_idx = precise_match.end()
                
                # precise_match.group(1) is the opening tag <header class="...">
                # We want to replace everything from start to end with:
                # opening_tag + new_inner_html + </header>
                
                new_block = f"{opening_tag}\n{new_inner_html}\n</header>"
                
                # Reconstruct content
                content = content[:start_idx] + new_block + content[end_idx:]
    
    # 2. Update Footer
    prefix = get_relative_prefix(file_path)
    
    precise_footer_regex = re.compile(r'(<footer[^>]*>)([\s\S]*?)(</footer>)', re.IGNORECASE)
    footer_match = precise_footer_regex.search(content)
    
    template_inner_match_footer = re.search(r'<footer.*?>([\s\S]*?)</footer>', FOOTER_TEMPLATE.replace("{{PREFIX}}", prefix))
    
    if footer_match and template_inner_match_footer:
        new_inner_footer = template_inner_match_footer.group(1).strip()
        
        start_idx = footer_match.start()
        end_idx = footer_match.end()
        
        # footer_match.group(1) is opening tag
        opening_tag = footer_match.group(1)
        
        new_block = f"{opening_tag}\n{new_inner_footer}\n</footer>"
        content = content[:start_idx] + new_block + content[end_idx:]

    # 3. Remove Obsolete .page-band-dark
    # This element conflicts with the new .site-header styling
    content = re.sub(r'<!--\s*DARK BAND\s*-->\s*<div class="page-band-dark"></div>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<div class="page-band-dark"></div>', '', content, flags=re.IGNORECASE)

    # 4. Force CSS Cache Busting
    # Replace style.css with style.css?v=hardreset2 ensures browsers fetch fresh copy
    content = re.sub(r'href="([^"]*?)styles\.css(?:\?v=[^"]*)?"', r'href="\1styles.css?v=hardreset2"', content)



    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

def main():
    for root, dirs, files in os.walk(PAGES_DIR):
        for file in files:
            if file == "index.html":
                update_file(os.path.join(root, file))
                
    # Also template
    template_path = os.path.join(PROJECT_ROOT, "templates", "tribute-template.html")
    if os.path.exists(template_path):
        # Template is special case, handled manually or left static for now as it's a template
        pass

if __name__ == "__main__":
    main()
