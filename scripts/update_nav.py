import os
import re

ROOT_DIR = os.getcwd()
PAGES_DIR = os.path.join(ROOT_DIR, 'pages')

def get_relative_path_to_root(file_path):
    # Calculate how many levels deep the file is relative to ROOT_DIR
    rel_path = os.path.relpath(file_path, ROOT_DIR)
    depth = len(rel_path.split(os.sep)) - 1
    return "../" * depth

def update_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if 'Tributes</a>' in content:
            print(f"Skipping {file_path} - already updated")
            return

        # Regex to find the Reviews link in the nav
        # We look for the Reviews link specifically in main-nav
        # Pattern: <a href="...Reviews/...">Reviews</a> or similar
        # But simpler: find "Reviews</a>" inside "main-nav"
        
        nav_pattern = re.compile(r'(<nav class="main-nav">)(.*?)(</nav>)', re.DOTALL)
        match = nav_pattern.search(content)
        
        if match:
            nav_content = match.group(2)
            if 'Reviews</a>' in nav_content:
                # Calculate link to memorials page
                back_to_root = get_relative_path_to_root(file_path)
                # target: pages/memorials/index.html
                # We can standardize on path from root for simplicity:
                # href="{back_to_root}pages/memorials/index.html"
                
                # However, for prettier URLs, if we are in pages/home, we might want ../memorials/index.html
                # Let's verify existing style. 
                # pages/home/index.html uses ../reviews/index.html (sibling in pages)
                # pages/reviews/page/5/index.html uses ../../../../pages/custom-pet-memorial-stones/index.html
                
                # Let's try to use os.path.relpath
                target_path = os.path.join(PAGES_DIR, 'memorials', 'index.html')
                file_dir = os.path.dirname(file_path)
                rel_link = os.path.relpath(target_path, file_dir).replace(os.sep, '/')
                
                new_link = f'\n        <a href="{rel_link}">Tributes</a>'
                
                # Insert after Reviews</a>
                # We expect <a ...>Reviews</a>
                # Let's replace </a> with </a> + new_link
                # But only for the Reviews link
                
                updated_nav = re.sub(r'(>Reviews</a>)', r'\1' + new_link, nav_content)
                
                new_content = content.replace(nav_content, updated_nav)
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file_path}")
            else:
                print(f"Skipping {file_path} - Nav found but Reviews link missing")
        else:
            print(f"Skipping {file_path} - Nav not found")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    print("Starting Nav Update...")
    for root, dirs, files in os.walk(PAGES_DIR):
        for file in files:
            if file == 'index.html':
                 update_file(os.path.join(root, file))

    # Also update the template
    template_path = os.path.join(ROOT_DIR, 'templates', 'tribute-template.html')
    if os.path.exists(template_path):
        # We handle template differently because it is not in its final location
        # It will be in pages/memorials/slug/index.html
        # So we treat it as if it IS there for path calculation
        # But we write to template file
        
        print("Updating Template...")
        try:
             with open(template_path, 'r', encoding='utf-8') as f:
                content = f.read()
             
             if 'Tributes</a>' not in content:
                 # Assumed location: pages/memorials/slug/index.html
                 # Target: pages/memorials/index.html
                 # Rel path: ../../index.html
                 # Wait, slug -> memorials -> index.html. ../../index.html is correct.
                 
                 new_link = '\n                <a href="../../index.html">Tributes</a>'
                 
                 # The template has indented nav
                 nav_pattern = re.compile(r'(<nav class="main-nav">)(.*?)(</nav>)', re.DOTALL)
                 match = nav_pattern.search(content)
                 if match:
                     nav_content = match.group(2)
                     if 'Reviews</a>' in nav_content:
                         updated_nav = re.sub(r'(>Reviews</a>)', r'\1' + new_link, nav_content)
                         content = content.replace(nav_content, updated_nav)
                     
                         with open(template_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                         print("Updated tribute-template.html")
        except Exception as e:
            print(f"Error updating template: {e}")

if __name__ == '__main__':
    main()
