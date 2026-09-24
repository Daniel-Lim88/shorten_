# Apple website styling reference

Reference: [apple.com](https://www.apple.com/), inspected 24 September 2026. This document describes the public homepage's visual system for implementation. It is a design specification, not a copy of Apple's source code or an asset bundle. Measurements below are practical targets; verify against the live page at the intended viewport before pixel matching.

## Visual direction

Make the product the focal point. Use a restrained neutral canvas, large centered headlines, short supporting lines, ample empty space, precise alignment, and vivid product imagery. Alternate light and dark panels to create rhythm. Keep interface chrome quiet and consistent. Each section should communicate one idea and offer one or two clear actions.

## Page anatomy

1. **Global navigation:** a narrow, full-width bar with a centered inner row; brand mark, product categories, search, and bag. On small screens, collapse into a minimal icon row with a menu.
2. **Announcement strip:** optional single-line offer or notice under the navigation, centered with an inline link.
3. **Primary heroes:** stacked, edge-to-edge panels with a headline, short tagline, two actions, and oversized product imagery. The current homepage uses two lead panels.
4. **Promo grid:** two equal columns on desktop, one column on mobile. Each tile repeats the headline, tagline, action, and image composition at a smaller scale.
5. **Entertainment carousel:** wide visual cards with pagination and explicit controls; imagery carries the content.
6. **Footnotes and footer:** a light grey zone with small legal copy, separators, and grouped site links.

Keep a narrow white gutter between major panels and between promo tiles. The global navigation and footer use much narrower content widths than the full-bleed heroes.

## Design tokens

```css
:root {
  color-scheme: light;
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --ink: #1d1d1f;
  --muted: #6e6e73;
  --surface: #fff;
  --surface-soft: #f5f5f7;
  --surface-dark: #000;
  --link: #06c;
  --link-on-dark: #2997ff;
  --rule: #d2d2d7;
  --nav-height: 44px;
  --content-width: 980px;
  --reading-width: 720px;
  --panel-gap: 12px;
  --button-radius: 999px;
}
```

These are implementation approximations of the visible palette and proportions, not extracted proprietary tokens. Use an accent colour only for interactive elements or the product artwork. Dark panels use white or near-white text and the brighter link blue.

## Typography

Use the system font stack above. Prefer SF Pro where available on Apple devices; provide the listed fallbacks elsewhere. Use display styling for large headings and text styling for UI and body copy. Avoid importing or redistributing Apple font files without the appropriate licence.

| Role | Desktop target | Mobile target | Treatment |
| --- | --- | --- | --- |
| Lead hero title | 56px / 1.07 | 32–40px / 1.1 | Semibold, tight tracking, centered |
| Lead hero tagline | 28px / 1.15 | 19–21px / 1.25 | Regular, centered |
| Promo tile title | 40px / 1.1 | 32px / 1.12 | Semibold, centered |
| Promo tagline | 21px / 1.25 | 19px / 1.3 | Regular, centered |
| Primary actions | 17px / 1.25 | 14–17px / 1.3 | Regular |
| Body | 17px / 1.5 | 16–17px / 1.5 | Regular, limited line length |
| Navigation | 12px / 1 | 12px / 1 | Low emphasis, evenly spaced |
| Legal/footer | 12px / 1.35 | 12px / 1.4 | Muted grey |

Use sentence case. Headlines are brief and product-led. Keep taglines to one or two lines. Avoid long paragraphs within hero panels. Tracking can tighten slightly for display sizes; do not tighten small text. Preserve typographic hierarchy rather than forcing text to fit a fixed height.

## Layout and spacing

- Use a centered navigation and footer container around `980px` wide, with at least `20px` mobile side padding.
- Let heroes span the viewport width. Reserve generous vertical space: roughly `580–700px` on desktop and `500–650px` on mobile, adjusted for artwork and copy.
- Separate stacked panels and grid tiles with a `12px` gutter. On desktop, the promo grid is two columns; stack it at a tablet breakpoint when copy or artwork becomes cramped.
- Give hero copy a top inset around `45–60px` on desktop and `35–50px` on mobile. Keep title-to-tagline, tagline-to-actions, and action-to-artwork gaps consistent, roughly `8–12px`, `18–24px`, and `30–50px` respectively.
- Constrain text independently from imagery. Use deliberate line breaks only when they improve the composition across breakpoints.
- Align art to the lower or central portion of each panel. Allow cropping with `object-fit: cover` only when the focal product remains visible.

## Components

### Navigation

Use a translucent or solid near-black/near-white bar according to the page context. Keep its visual height near `44px`, with evenly distributed links and subdued text. Add hover and keyboard focus states. On mobile, expose accessible menu, search, and bag controls with visible labels for assistive technology. If sticky, ensure it does not hide anchored content.

### Hero panel

Compose each hero as a single visual story: background colour or image, centered title, concise tagline, action row, and product image. Make the first action a filled pill (`background: #0071e3; color: white`) and the secondary action an outlined pill or a blue text link, depending on context. Keep actions about `44px` tall with comfortable horizontal padding. On dark surfaces use appropriate contrast and a brighter blue.

### Promo tile

Apply the hero pattern at half width. Keep each tile the same height within a row, center the copy, and give its product art most of the available area. Tiles may alternate black, white, pale grey, or restrained gradient backgrounds. Avoid adding visible card borders or heavy shadows; the white gutter provides separation.

### Links and buttons

Use `Learn more` and `Buy` style labels only where those actions are accurate. A pair of actions sits horizontally with a `12–16px` gap and may wrap cleanly on small screens. Links use blue, have a clear hover treatment, and receive a visible focus ring. Buttons retain pill geometry and should not shrink below a comfortable touch target.

### Carousel

Show a dominant landscape card and indicate adjacent content when space permits. Provide previous/next controls, pagination, pause/play for autoplay, keyboard access, and reduced-motion support. Do not auto-advance while focused or hovered. Keep text legible over imagery through placement or a restrained overlay.

### Footer

Use `--surface-soft`, muted text, thin horizontal rules, and a dense but orderly link hierarchy. Begin with legal notes, then grouped navigation columns, then regional and policy links. On mobile, turn footer groups into accessible disclosure sections. Avoid treating fine print as primary content.

## Responsive behaviour

| Width | Structure |
| --- | --- |
| `>= 1069px` | Full navigation; large hero typography; two-column promo grid; wide carousel. |
| `735–1068px` | Scale type and artwork fluidly; keep two columns only while content fits. |
| `< 735px` | Compact navigation; single-column promos; mobile-specific art direction and crops; smaller title scale; stacked footer groups. |

Prefer fluid sizes with `clamp()` between these ranges rather than abrupt jumps. Supply separate image crops with `<picture>` when the desktop composition cannot survive on mobile. Prevent horizontal overflow and test long localized strings.

## Motion and interaction

Use subtle opacity, colour, and transform transitions around `150–300ms`. Keep motion secondary to content. Preserve native scrolling and avoid aggressive parallax. Respect `prefers-reduced-motion: reduce` by disabling decorative motion and autoplay. Hover effects should never be the sole indication of an action.

## Imagery and accessibility

Use high-resolution, carefully lit product imagery with clean edges and controlled negative space. Do not substitute Apple's photography, marks, product renders, or marketing copy unless the project has rights to use them. For a different brand, recreate the composition with its own assets and voice.

Use semantic landmarks, one meaningful page `h1`, logical heading order, useful image alt text, and accessible names for icon controls. Keep text as live HTML. Maintain at least WCAG AA contrast for functional text and controls, visible keyboard focus, and touch targets around `44px`. Ensure the page remains usable when imagery fails or is delayed.

## Implementation checklist

- [ ] Navigation, announcement, heroes, promo grid, carousel, and footer follow the hierarchy above.
- [ ] Light/dark surfaces, typography, spacing, and action styling are consistent.
- [ ] Desktop and mobile use intentional artwork crops.
- [ ] Controls work by mouse, touch, and keyboard; motion preferences are respected.
- [ ] Product assets and copy are authorised for this project.
- [ ] Compare screenshots at representative desktop, tablet, and mobile widths and adjust measurements where necessary.

## Source

- [Apple homepage](https://www.apple.com/) — section order, navigation labels, hero/action structure, promo grid, and entertainment area, viewed 24 September 2026.
