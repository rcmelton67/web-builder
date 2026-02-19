import os
import re

ROOT_DIR = os.getcwd()
PAGES_DIR = os.path.join(ROOT_DIR, 'pages')

def get_relative_path_to_memorials(file_path):
    # Calculate path from file_path to pages/memorials/index.html
    # file_path dir -> root -> pages/memorials/index.html
    
    file_dir = os.path.dirname(file_path)
    target_path = os.path.join(PAGES_DIR, 'memorials', 'index.html')
    rel_path = os.path.relpath(target_path, file_dir).replace(os.sep, '/')
    return rel_path

def update_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if 'Pet Memorial Tributes</a>' in content:
            print(f"Skipping {file_path} - already updated")
            return

        # Find "Memorial Guides" in the footer resources column
        # Pattern: <a href="...">Memorial Guides</a>
        
        guide_pattern = re.compile(r'(<a href="[^"]*?">Memorial Guides</a>)', re.DOTALL)
        match = guide_pattern.search(content)
        
        if match:
            guide_link = match.group(1)
            rel_link = get_relative_path_to_memorials(file_path)
            
            # Format: 4 spaces indent usually
            new_link = f'\n                    <a href="{rel_link}">Pet Memorial Tributes</a>'
            
            # Insert after Memorial Guides
            updated_content = content.replace(guide_link, guide_link + new_link)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"Updated {file_path}")
        else:
            print(f"Skipping {file_path} - 'Memorial Guides' link not found")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    print("Starting Footer Update...")
    for root, dirs, files in os.walk(PAGES_DIR):
        for file in files:
            if file == 'index.html':
                 update_file(os.path.join(root, file))

    # Update template as well
    template_path = os.path.join(ROOT_DIR, 'templates', 'tribute-template.html')
    if os.path.exists(template_path):
        print("Updating Template...")
        try:
             with open(template_path, 'r', encoding='utf-8') as f:
                content = f.read()
             
             if 'Pet Memorial Tributes</a>' not in content:
                 # In template, path is ../memorials/index.html usually, but template needs specific
                 # The template is used in pages/memorials/slug/
                 # So path to pages/memorials/index.html is ../../index.html
                 
                 new_link = '\n                    <a href="../../index.html">Pet Memorial Tributes</a>'
                 
                 guide_pattern = re.compile(r'(<a href="[^"]*?">Memorial Guides</a>)', re.DOTALL)
                 match = guide_pattern.search(content)
                 if match:
                     guide_link = match.group(1)
                     updated_content = content.replace(guide_link, guide_link + new_link)
                     
                     with open(template_path, 'w', encoding='utf-8') as f:
                        f.write(updated_content)
                     print("Updated tribute-template.html")
        except Exception as e:
            print(f"Error updating template: {e}")

if __name__ == '__main__':
    main()
