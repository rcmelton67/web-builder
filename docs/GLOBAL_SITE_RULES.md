site_name: Melton Memorials

brand_positioning: >
  Premium handcrafted pet memorial stones and grave markers.
  Balanced emotional tone with craftsmanship authority.

tone:
  style: balanced
  emotional_level: moderate
  sales_pressure: low
  clarity: high

primary_focus:
  - pet memorial stones
  - dog headstones
  - pet grave markers

slug_rules:
  lowercase: true
  hyphenated: true
  no_keyword_stuffing: true
  plural_for_category_pages: true
  singular_for_product_pages: true
  max_words: 4-5

image_rules:
  format: webp
  compression_required: true
  max_width: 1920px
  naming_convention: lowercase-hyphenated-descriptive.webp
  example: custom-pet-memorial-stone-granite.webp

alt_text_rules:
  describe_product: true
  include_material: when_applicable
  include_pet_type: when_relevant
  avoid_keyword_stuffing: true
  no_redundant_phrases: true

grid_rules:
  default_columns_desktop: 3
  tablet: 2
  mobile: 1
  ratio: 4:5
  style: edge-to-edge
  no_borders: true
  no_drop_shadows: true

pricing_display:
  category_pages: from
  product_pages: full_price
  no_inventory_display: true
  no_stock_language: true

seo_structure:
  h1: one_per_page
  structured_intro_position:
    allowed_positions:
      - above_review_grid (preferred)
      - below_review_grid (fallback)
    rationale: authority context should appear before dynamic content for crawl clarity
  faq_section: encouraged
  breadcrumb_style: minimal

content_style:
  avoid_fluff: true
  avoid_keyword_stacking: true
  avoid_funeral_tone: true
  avoid_overly_sentimental_copy: true
  emphasize_durability: true
  emphasize_craftsmanship: true

technical_rules:
  never_edit_live_directly: true
  develop_in_local_or_staging: true
  page_must_have_spec_file: true
  validate_template_against_spec: true

page_architecture:
  page_pod_structure: required
  each_page_requires:
    - index.html
    - spec.md
    - images_directory
  no_flat_html_files: true

  page_creation_protocol:
  new_pages_must:
    - be_created_inside_pages_directory
    - include_index_html
    - include_spec_md
    - include_images_directory
  slug_must_follow_slug_rules: true
  spec_must_exist_before_content_creation: true
  validate_against_global_seo_strategy: true
