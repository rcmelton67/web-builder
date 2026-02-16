# scaffold

GOAL:
Enforce project scaffold structure for all spec-backed pages.

STRUCTURE RULE:

For each file in /docs/pages/*.md:
1) Create a matching folder under /pages/ using the slug name.
   Example:
   slug: what-to-write-on-a-pet-memorial-stone
   → /pages/what-to-write-on-a-pet-memorial-stone/

2) Move matching HTML file into that folder:
   /what-to-write-on-a-pet-memorial-stone.html
   → /pages/what-to-write-on-a-pet-memorial-stone/what-to-write-on-a-pet-memorial-stone.html

3) Move the spec file into same folder:
   /docs/pages/what-to-write-on-a-pet-memorial-stone.md
   → /pages/what-to-write-on-a-pet-memorial-stone/what-to-write-on-a-pet-memorial-stone.md

4) Create /images/ subfolder inside each page folder.
   Move any image files referenced by that page into its local images/ folder.

5) Update all internal image paths accordingly.
   Example:
   ../images/filename.webp
   → images/filename.webp

6) Ensure no orphan files remain in root or docs/pages.

7) Output:
   - Pages reorganized
   - Files moved
   - Paths updated
   - Any conflicts detected

Read-only dry run first.
Do not apply changes until confirmed.
