---
page_name: Granite Memorial Builder
slug: granite-pet-memorial-stone/create-your-memorial
parent: granite-pet-memorial-stone
page_type: product_builder
indexing: noindex, follow

seo:
  title: Create Your Granite Pet Memorial | Melton Memorials
  meta_description: Design your handcrafted granite pet memorial. Choose size, layout, and personalization details. Proof provided before engraving.
  canonical: /products/granite-pet-memorial-stone/

pricing:
  display_anchor: From $56
  default_size: 7x4
  sizes:
    - 3x2:
        price: 22
    - 7x4:
        price: 56
    - 10x6:
        price: 82
    - 12x8:
        price: 108

builder_flow:
  step_1: size_selection
  step_2: memorial_details
  step_3: layout_selection
  step_4: review_and_add_to_cart

memorial_fields:
  required:
    - pet_name
    - layout_choice
  optional:
    - years_of_life
    - pet_type
    - custom_message

proof_policy:
  message: >
    A detailed engraving proof will be emailed within 3 business days
    for approval or requested revisions before production begins.

ui_rules:
  layout: two_column
  image_position: left
  image_swap_on_size_change: true
  default_selected_size: 7x4
  live_preview: false
  preview_confirmation_checkbox: false

woo_integration:
  product_type: granite
  pass_fields:
    - size
    - pet_name
    - years_of_life
    - pet_type
    - custom_message
    - layout_choice
  cart_behavior: standard_add_to_cart
---
