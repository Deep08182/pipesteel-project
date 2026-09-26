---
name: Steel & Safety
colors:
  surface: '#f8f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#4d5f7b'
  primary: '#000715'
  on-primary: '#ffffff'
  primary-container: '#0b2038'
  on-primary-container: '#7588a5'
  inverse-primary: '#b4c8e7'
  secondary: '#994600'
  on-secondary: '#ffffff'
  secondary-container: '#fe8a3a'
  on-secondary-container: '#662d00'
  tertiary: '#000813'
  on-tertiary: '#ffffff'
  tertiary-container: '#00213a'
  on-tertiary-container: '#4f8bc5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e3ff'
  primary-fixed-dim: '#b4c8e7'
  on-primary-fixed: '#061c34'
  on-primary-fixed-variant: '#354862'
  secondary-fixed: '#ffdbc9'
  secondary-fixed-dim: '#ffb68b'
  on-secondary-fixed: '#321200'
  on-secondary-fixed-variant: '#753400'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9bcbff'
  on-tertiary-fixed: '#001d34'
  on-tertiary-fixed-variant: '#004a79'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  steel-gray: '#55697A'
  border-subtle: '#E1E7ED'
  success-green: '#2E9E5C'
  safety-orange-dark: '#C7621B'
typography:
  headline-display:
    fontFamily: Hanken Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-display-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  label-data:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  section-lg: 96px
  section-md: 64px
---

## Brand & Style

The design system moves away from traditional, heavy industrial aesthetics toward a "Steel & Safety" narrative. The brand personality is precise, dependable, and high-performance, catering to a B2B audience that values efficiency and technical accuracy.

The visual style is **Corporate / Modern** with a lean toward **Minimalism**. It prioritizes extreme clarity through generous whitespace (the "oxygen" of the layout) and a refined, systematic approach to data visualization. By utilizing a "safety-first" highlight strategy—where color is used sparingly but with high intent—the interface guides users toward critical actions like quote requests and product discovery without visual fatigue. High-quality, macro-photography of industrial components should be used to provide a premium, tactile feel to the digital experience.

## Colors

The palette is anchored by **Navy** (#0B2038) for authority and **Safety Orange** (#E8792A) for critical actions. 

- **Primary (Navy):** Used for structural elements, primary headings, and navigation backgrounds to establish trust.
- **Secondary (Orange):** Reserved exclusively for high-priority CTAs (e.g., "Request Quote") and safety-related highlights. Use with restraint to maintain its "warning/notice" effectiveness.
- **Tertiary (Steel):** An active blue used for secondary actions, text links, and interactive icons.
- **Neutral (Background):** A crisp, cool gray base that provides a modern, clean canvas, distinguishing from the "muddy" grays often found in legacy industrial sites.

Color usage should follow a 60-30-10 distribution, with the neutral background and whitespace dominating the layout to ensure a modern, B2B-professional feel.

## Typography

The typography system transitions to a high-precision, modern sans-serif stack. 

**Hanken Grotesk** is used for headlines to provide a sharp, contemporary engineering feel that is more legible than condensed alternatives. **Inter** handles all functional body text, optimized for readability in technical descriptions. **JetBrains Mono** is retained for technical specifications, SKUs, and "eyebrow" labels to maintain the system's industrial DNA.

For mobile, headlines scale down aggressively to prevent awkward line breaks, while body text remains at a legible 15px minimum. All technical data (labels) should be rendered in uppercase when using the `label-caps` style to denote "official" categorization.

## Layout & Spacing

This design system uses a **Fixed Grid** model on desktop and a **Fluid Grid** on mobile. 

- **Desktop:** A 12-column grid with a 1280px max-width. Gutters are fixed at 24px to ensure breathing room between technical data points.
- **Spacing Rhythm:** Based on an 8px base unit. Section vertical padding is increased to 96px to emphasize the "Steel & Safety" aesthetic's commitment to whitespace.
- **Reflow Rules:** On tablet (768px - 1024px), the grid transitions to 8 columns. On mobile (<768px), the layout collapses to a single column with 16px side margins. 

Data-heavy tables should use a "Compact" spacing mode with 8px cell padding, while marketing sections use "Comfortable" spacing with 24px+ padding.

## Elevation & Depth

To maintain a "Steel" aesthetic, the system uses **Tonal Layers** and **Low-contrast outlines** rather than heavy shadows.

- **Surface Levels:** The primary background is `neutral_color_hex`. White cards sit on top of this, using a 1px `border-subtle` outline.
- **Interactive Depth:** Only when a user interacts with a card (hover) should an **Ambient Shadow** be applied. This shadow should be extremely diffused: `0 12px 32px rgba(11, 32, 56, 0.08)`.
- **Floating Elements:** Modals and dropdowns use a slightly deeper shadow to establish a clear Z-axis hierarchy, but still maintain the tinted Navy color to keep the palette cohesive.

## Shapes

The shape language is **Soft (0.25rem)**. This reflects industrial precision—sharp enough to feel engineered, but softened just enough to feel like a modern B2B SaaS product.

- **Buttons & Inputs:** Use the base 4px (0.25rem) radius.
- **Cards:** Use `rounded-lg` (8px) to provide a distinct container feel.
- **Status Pills:** Use a full pill shape (999px) to distinguish them from interactive buttons.
- **Signature Ornament:** Retain the 2px Orange corner brackets for product images, but reduce their length to 12px to keep the aesthetic "refined" rather than "heavy."

## Components

- **Buttons:** 
  - *Primary:* Solid Navy or Orange with white text. No gradients.
  - *Secondary:* Ghost style with `tertiary_color_hex` outlines.
- **Input Fields:** 
  - Square-ish (4px radius), white background, 1px `border-subtle`. On focus, the border changes to Navy with a 2px offset light-blue ring.
- **Cards:** 
  - White background, 1px `border-subtle`. No shadow in default state. On hover, the border color changes to `tertiary_color_hex` and an ambient shadow is applied.
- **Quick Quote Widget:** 
  - A persistent, floating action button (FAB) or a sticky bottom bar on mobile, using the `secondary_color_hex` (Orange) to ensure it is the most visible element on the page.
- **Technical Specs Table:** 
  - Zebra striping using the `neutral_color_hex`. Headers use `label-caps` typography with a Navy background and white text for high contrast.
- **Breadcrumbs & Progress:** 
  - Use `label-data` font styles for breadcrumbs to keep the technical hierarchy clear without distracting from the main headline.