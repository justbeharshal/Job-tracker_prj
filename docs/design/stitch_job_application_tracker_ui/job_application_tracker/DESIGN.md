---
name: Job Application Tracker
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#484556'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#797588'
  outline-variant: '#c9c3d9'
  surface-tint: '#5e35f1'
  primary: '#5323e6'
  on-primary: '#ffffff'
  primary-container: '#6c47ff'
  on-primary-container: '#f1ebff'
  inverse-primary: '#c9beff'
  secondary: '#b90a5a'
  on-secondary: '#ffffff'
  secondary-container: '#fe4c8c'
  on-secondary-container: '#590027'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#caa900'
  on-tertiary-container: '#4d3f00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#c9beff'
  on-primary-fixed: '#1b0063'
  on-primary-fixed-variant: '#4500d8'
  secondary-fixed: '#ffd9e0'
  secondary-fixed-dim: '#ffb1c4'
  on-secondary-fixed: '#3f001a'
  on-secondary-fixed-variant: '#8f0043'
  tertiary-fixed: '#ffe173'
  tertiary-fixed-dim: '#e8c426'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system powers a **Job Application Tracker** built for Gen Z job seekers who want a tool that feels energetic, candid, and motivating rather than sterile or corporate. The UI should evoke the tactile satisfaction of a physical sticker-covered planner combined with the crisp speed of a modern SaaS workspace.

The visual language is **Neo-Brutalist**: high-contrast ink-black outlines, zero blurry shadows, hard offset drop shadows, and vibrant, saturated stage colors. Rounded corners soften the rawness of classic brutalism, keeping the interface approachable, playful, and punchy.

## Colors

The palette is strictly **light mode only**, anchored by a warm cream canvas (`#FFF8E7`) and crisp ink-black (`#111111`) borders and typography. Pure white (`#FFFFFF`) is reserved for elevated card surfaces, inputs, and interactive containers so they pop against the cream background.

- **Primary Action (`#6C47FF`):** Electric violet used for primary CTAs, active navigation states, and key interactive highlights, always paired with `#FFFFFF` text.
- **Decorative Accent (`#FF4D8D`):** Hot pink used sparingly for decorative badges, streaks, and celebration moments.
- **Pipeline Stage Tokens:**
  - **Wishlist:** `#C4B5FD` (Lavender)
  - **Applied:** `#60A5FA` (Sky Blue)
  - **Interview:** `#FFD93D` (Sunny Yellow)
  - **Offer:** `#B5F23D` (Lime)
  - **Rejected:** `#FF6B81` (Coral Pink)

All stage colors are paired with `#111111` ink-black text and `2px solid #111111` borders to guarantee high contrast and legibility.

## Typography

**Space Grotesk (Bold)** drives all oversized headings, dashboard metrics, and column titles with tight negative letter spacing (`-0.015em` to `-0.03em`) for a compact, punchy editorial presence. **DM Sans** handles all body copy, form inputs, table data, and UI labels, providing clean geometric legibility at small sizes.

## Layout & Spacing

The layout uses a **12-column fluid grid** on desktop (`>= 1024px`) with `1.25rem` (20px) gutters and `1.5rem` (24px) outer canvas margins. This accommodates multi-column Kanban boards, pipeline summary cards, and split-pane application detail views without feeling cramped.

- **Tablet (`768px – 1023px`):** Collapses to an 8-column fluid grid. Kanban boards scroll horizontally with snap points, while summary metrics stack in a 2x2 grid.
- **Mobile (`< 768px`):** Collapses to a 4-column fluid grid with `1rem` (16px) margins. Multi-column boards transition into a tabbed stage switcher or vertical accordion list.

## Elevation & Depth

Depth is achieved exclusively through **bold borders and hard offset shadows**—blurry, diffused, or soft shadows are strictly prohibited.

- **Standard Surface:** `2px solid #111111` border with a `4px 4px 0 #111111` hard offset shadow.
- **Interactive Press State:** On `:active` or click, elements translate `2px` down and `2px` right while reducing the shadow to `2px 2px 0 #111111`, creating a physical, tactile button-press feel.
- **Flat / Recessed Elements:** Nested containers or disabled states omit the offset shadow while retaining the `2px solid #111111` border.

## Shapes

All primary containers—including cards, buttons, inputs, and badges—use **16px (`1rem`) rounded corners** (`rounded-lg` in the scale). This uniform `16px` radius softens the heavy `2px solid #111111` borders and hard `4px 4px 0 #111111` shadows, giving the interface a friendly, sticker-like silhouette.

## Components

Every interactive and structural component shares the core neo-brutalist DNA: `2px solid #111111` border, `16px` border-radius, and `4px 4px 0 #111111` hard offset shadow.

- **Buttons:** Primary buttons use `#6C47FF` fill with `#FFFFFF` bold text. Secondary buttons use `#FFFFFF` fill with `#111111` text. Hovering shifts the background slightly brighter or adds a subtle `-1px` lift; clicking translates the button `(2px, 2px)` and shrinks the shadow to `2px 2px 0 #111111`.
- **Sticker Badges & Chips:** Stage pills and status tags use their respective stage fill (`#C4B5FD`, `#60A5FA`, `#FFD93D`, `#B5F23D`, `#FF6B81`) or `#FF4D8D` for decorative streaks. Apply a slight `1deg` to `2deg` rotation (`rotate(-1.5deg)` or `rotate(1.5deg)`) to sticker-style badges for an energetic, hand-placed feel.
- **Cards:** Pure `#FFFFFF` background, `1.25rem` internal padding, `2px solid #111111` border, `16px` radius, and `4px 4px 0 #111111` shadow. Application cards display the company name in `Space Grotesk Bold`, role title in `DM Sans`, and a rotated stage sticker badge in the top-right corner.
- **Input Fields:** `#FFFFFF` fill, `2px solid #111111` border, `16px` radius, and `4px 4px 0 #111111` shadow. Focus states highlight with a `#6C47FF` outline ring outside the black border.
- **Checkboxes & Radio Buttons:** `2px solid #111111` border with `#FFFFFF` fill. Checked states fill with `#6C47FF` and a crisp `#FFFFFF` checkmark or dot.
- **Lists:** Vertical stacks separated by `space-sm` (`0.5rem`) or `space-md` (`1rem`) gaps, where each row functions as a compact `#FFFFFF` card with the standard border and hard shadow.