# TASK M3: colour carried by the photos (design moment c)

Technique (00 §C, Red and Green: section photos duotone-tinted). Own CSS.

- `.duotone`: the photo in grayscale multiplied over the current drop accent (`--drop`):
  ink shadows, accent highlights. Used on editorial placements only: the archive hover photo, the
  contact photo, the home "SLOW MODE" band photo.
- **Never on product photos** (product page, product cards, bag thumbnails): garment colour is a
  fact (02 §6). The natural colour of every photo is on its product page.
- Test: e2e checks product images have no filter and a `.duotone` image has `grayscale`.
