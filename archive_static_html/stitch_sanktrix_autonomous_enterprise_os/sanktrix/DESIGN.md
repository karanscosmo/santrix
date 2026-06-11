---
name: Sanktrix
colors:
  surface: '#10131b'
  surface-dim: '#10131b'
  surface-bright: '#363942'
  surface-container-lowest: '#0b0e16'
  surface-container-low: '#181b24'
  surface-container: '#1c1f28'
  surface-container-high: '#272a33'
  surface-container-highest: '#32353e'
  on-surface: '#e0e2ee'
  on-surface-variant: '#c2c6d8'
  inverse-surface: '#e0e2ee'
  inverse-on-surface: '#2d3039'
  outline: '#8c90a1'
  outline-variant: '#424655'
  surface-tint: '#b0c6ff'
  primary: '#b0c6ff'
  on-primary: '#002d6f'
  primary-container: '#568dff'
  on-primary-container: '#002661'
  inverse-primary: '#0058cb'
  secondary: '#ffb955'
  on-secondary: '#452b00'
  secondary-container: '#dc9100'
  on-secondary-container: '#4f3100'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#00429c'
  secondary-fixed: '#ffddb4'
  secondary-fixed-dim: '#ffb955'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#633f00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#10131b'
  on-background: '#e0e2ee'
  surface-variant: '#32353e'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-margin: 32px
  gutter: 16px
---

## Brand & Style
The design system is engineered for high-stakes enterprise intelligence, blending the precision of a financial terminal with the futuristic aesthetic of advanced AI interfaces. It is designed to evoke a sense of absolute control, cinematic depth, and autonomous speed.

The visual style is a sophisticated mix of **Glassmorphism** and **High-Fidelity Minimalism**. It utilizes deep obsidian surfaces, layered transparency, and "streaming intelligence" cues—such as subtle glowing pulses and animated gradients—to signal real-time data processing. The interface feels less like a static webpage and more like a tactical heads-up display (HUD) for executive decision-making.

## Colors
The palette is rooted in deep, light-absorbing blacks to minimize eye strain during long periods of data analysis.

- **Primary (Electric Blue):** Used exclusively for high-priority actions, active states, and AI processing indicators. It should feel "charged" and energetic.
- **Secondary (Saffron):** Reserved for highlights, alerts, or specific data nodes that require immediate attention without signaling an error.
- **Positive (Emerald):** Used for upward trends and successful system status.
- **Backgrounds:** The base layer is `#050505` (Obsidian). Elevated containers use `#121212` (Graphite) or `#0A0F1E` (Deep Navy) with varying levels of opacity to create a sense of physical depth.

## Typography
The typography strategy prioritizes technical clarity and modern authority. 

**Space Grotesk** is used for headlines to provide a futuristic, geometric character that feels innovative. **Inter** is the workhorse for all UI elements and body text, ensuring maximum legibility in high-density data environments. 

For data visualization and metric counters, use the `mono-data` style to ensure numbers align vertically for easy comparison. Capitalization is used strategically for labels to create a "terminal" feel.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for high-density information display. It utilizes a 12-column system for desktop screens.

- **Density:** High. Margins and padding are kept tight (`16px` to `24px`) to maximize the visible data "above the fold."
- **Breakpoints:** Mobile (<768px) switches to a single column with collapsed navigation; Tablet (768px-1200px) utilizes a 6-column grid; Desktop (>1200px) uses the full 12-column grid.
- **Rhythm:** All spacing must be multiples of the `4px` base unit to maintain technical precision.

## Elevation & Depth
Depth is created through "Tonal Stacking" rather than traditional heavy shadows.

- **Level 1 (Base):** Obsidian `#050505`.
- **Level 2 (Containers):** Graphite `#121212` with a 1px `rgba(255, 255, 255, 0.08)` border.
- **Level 3 (Overlays/Modals):** Deep Navy `#0A0F1E` with a `20px` backdrop blur (Glassmorphism) and a subtle inner glow on the top edge.
- **Glows:** Primary buttons and active AI indicators utilize a soft `0 0 15px rgba(0, 112, 255, 0.3)` outer glow to simulate a light-emitting interface.

## Shapes
This design system uses **Soft (0.25rem)** roundedness to maintain a professional, architectural feel. 

Sharp edges feel too brutalist, while highly rounded edges feel too consumer-oriented. The subtle radius on buttons and cards suggests precision engineering. 
- **Small elements (tags/chips):** 4px radius.
- **Medium elements (buttons/inputs):** 6px radius.
- **Large elements (cards/modals):** 8px radius.

## Components
- **Buttons:** Primary buttons are solid Electric Blue with white text. Secondary buttons are "Ghost" style with a 1px border and a subtle hover fill.
- **Input Fields:** Dark graphite backgrounds with a 1px border that glows Electric Blue on focus. Labels are always `label-caps`.
- **Cards:** Use Level 2 elevation. Headers should have a subtle bottom border.
- **AI Activity Indicators:** Small circular pulses using a CSS scale animation, colored in Electric Blue.
- **Data Chips:** Small, low-profile badges with monospaced text. Emerald for "Increase," Red for "Decrease," and Saffron for "Neutral/Warning."
- **Streaming Pulse:** For real-time updates, use a 2px horizontal gradient line that "wipes" across the top of the affected container.