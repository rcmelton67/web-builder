page_name: Pet Memorial Stone Reviews
slug: reviews
parent: none
page_type: authority
indexing: index, follow

seo:
  title: Pet Memorial Stone Reviews | Melton Memorials
  meta_description: Read verified five-star reviews from families who chose Melton Memorials for handcrafted pet memorial stones.
  canonical: /reviews/

data_source: /data/reviews.json

layout:
  hero: standard dark band + H1
  sections:
    - trust_summary_strip
    - search_and_filter
    - reviews_grid
    - phrase_insights

structured_data:
  type: Organization
  aggregate_rating: true
  rating_value: 5

review_count_logic:
  source: filtered reviews array
  filters_applied:
    - exclude 1-star reviews
    - exclude blocked keywords (e.g., jewelry, ring, necklace)
  rationale: ensures displayed count matches visible review set
