# Spark 3

This is the third version of the Spark theme, significantly redesigned in 2026 to feature a modern, minimalist, high-contrast aesthetic, and a suite of high-performance mathematical background animations. It is built for Hugo v0.160+.

It uses the following technologies:

- **Tailwind CSS v4** - For styling and utility classes.
- **Vue 3** - For interactivity (Algolia Search, Image Modal).
- **Vite 8 & Rolldown** - For lightning-fast asset bundling and ESM chunking.
- **WebGL & Canvas 2D** - For 11 distinct mathematical background animations.
- **TypeScript** - For robust front-end scripting.
- **pnpm** - For monorepo workspace management.

## Key Features

### Design & Layout
*   **Immersive Hero:** Homepage features a centered, minimalist layout backed by an interactive, animated mathematical background.
*   **Section Theming:** Dynamic palettes (Ruby Red, Sapphire Blue, Amethyst Purple, etc.) that adapt based on the active content section.
*   **Glassmorphism:** Navigation and interactive elements use `backdrop-blur` for a modern feel.
*   **Responsive Grid:** Clean, responsive grid systems for Projects and Blog posts.

### Mathematical Animations
Spark 3 includes 11 high-performance, interchangeable background animations that lazy-load on the homepage. Configure them via `homeAnimationType` in `config.toml`:

1.  `life`: Conway's Game of Life cellular automaton.
2.  `mandelbrot`: Fractal set with "Orbit Trap" textures and mouse parallax (WebGL).
3.  `julia`: Interactive fractal morphing mapped to real-time mouse position (WebGL).
4.  `attractors`: Chaotic Lorenz Attractor with 3D-to-2D projection.
5.  `rd`: Reaction-Diffusion procedural shader for organic patterns (WebGL).
6.  `physarum`: Multi-agent slime mold simulation.
7.  `boids`: Emergent flocking behavior simulation.
8.  `lsystem`: Animated "Fractal Garden" featuring Ferns, Plants, and Flowers.
9.  `lissajous`: Harmonic motion curve visualizer (Oscilloscope style).
10. `penrose`: Animated aperiodic Penrose Tiling with breathing inflation.
11. `bubble`: High-performance WebGL Bubble Universe computing 62,500 points in parallel (WebGL).

### Components
*   **Advanced Search:** Floating "Command Palette" style search modal powered by Algolia.
    *   **Keyboard Navigation:** Use `↑` `↓` to navigate, `Enter` to select, and `ESC` to close.
*   **Smart Pagination:** Pill-shaped pagination with tactile hover effects.
*   **Interactive Cards:** Project cards feature subtle borders and "lift" animations on hover.
*   **Animation Info System:** A bottom-left `(i)` button that reveals the math behind the currently active background animation.

## Quick Start

From the root of your Hugo site, clone the theme into `themes/` by running:

```bash
# Clone theme into the themes/spark directory
$ git clone -b spark-3 --single-branch https://github.com/akshaybabloo/spark-hugo-theme.git themes/spark3
```

## Usage

### Creating Content

#### 1. Blog Posts
Create standard markdown files in `content/blog/`.
```yaml
---
title: "My New Post"
date: 2024-01-24
description: "A short summary for the card view."
tags: ["hugo", "theme"]
images: ["/img/cover.jpg"] # First image is used as the featured image
---
```

#### 2. Projects
Create markdown files in `content/projects/`. Use `projectCategory` to group them on the list page.
```yaml
---
title: "Project Name"
date: 2024-01-01
description: "What does this project do?"
projectCategory: "Open Source" # or "Commercial", "Research"
externalurl: "https://github.com/username/project" # URL card links to
tags: ["python", "ai"]
---
```

#### 3. Publications
Create a file at `content/publications.md`. Set `type: publications` to use the custom layout.
```yaml
---
title: "Publications"
type: publications
description: "Selected research papers and journals."
---

## Journal
2024 - **Author Name**, Co-Author. "Title of Paper". Journal Name.
```

#### 4. About Page
Create `content/about.md`. The timeline data is pulled from `data/Experience.json` and `data/Education.json`.
```yaml
---
title: "About Me"
type: about
---
My bio text goes here...
```

### Data Files
Ensure you have `data/Experience.json` and `data/Education.json` for the timeline feature on the About page.

**Experience.json:**
```json
{
  "Experience": [
    {
      "title": "Senior Engineer",
      "company": "Tech Corp",
      "where": "New York",
      "from": "2020-01-01",
      "to": "Present",
      "description": "Built cool things."
    }
  ]
}
```

## Configuration

Please see the configuration [here](https://github.com/akshaybabloo/gollahalli.com/blob/master/config.toml).

```toml
baseURL = "https://www.gollahalli.com/"
theme = "spark"

[pagination]
pagerSize = 12

[params]
homeAnimation = true
homeAnimationType = "bubble" # Select from the 11 options above
```

## Development

Spark 3 is built as a `pnpm` workspace. To modify the theme:

1.  Run `pnpm install` at the repository root.
2.  Run `pnpm run static` to stage fonts.
3.  Run `pnpm --filter spark3 run watch` to start Vite in watch mode.
4.  Run `hugo serve` to view changes.

## License

Licensed under the MIT License. See the [LICENSE](https://github.com/akshaybabloo/spark-hugo-theme/blob/master/LICENSE) file for more details.