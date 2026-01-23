# Spark 3

This is the third version of the Spark theme, significantly redesigned in 2026 to feature a modern, minimalist, and high-contrast aesthetic. It is built on Hugo v0.133+.

It uses the following technologies:

- [Tailwind CSS](https://tailwindcss.com/) - For styling (v4)
- [Vue.js](https://vuejs.org/) - For interactivity (Search, Mobile Menu)
- [Algolia](https://www.algolia.com/) - For search (Instant search with keyboard navigation)
- [Vite](https://vitejs.dev/) - For asset bundling
- [Material Symbols](https://fonts.google.com/icons) - For icons
- [TypeScript](https://www.typescriptlang.org/) - For type checking

## Key Features

### Design & Layout
*   **Modern Split Hero:** Homepage features a striking split layout (Text Left, Image Right) with bold typography (`text-8xl`).
*   **Glassmorphism:** Sticky navigation bar and search modal use `backdrop-blur` for a modern feel.
*   **Responsive Grid:** Project and Blog lists use a clean, responsive grid system (1-3 columns) that handles different screen sizes elegantly.
*   **Immersive Reading:** Blog posts feature a centered `max-w-7xl` layout with a sticky sidebar for Table of Contents and Share buttons.

### Components
*   **Advanced Search:** Floating "Command Palette" style search modal.
    *   **Keyboard Navigation:** Use `↑` `↓` to navigate and `Enter` to select.
    *   **Categorized Results:** Groups results by section (Blog, Projects).
*   **Smart Pagination:** Pill-shaped pagination with tactile hover effects and clear active state visibility.
*   **Interactive Cards:** Project cards feature subtle borders and "lift" animations on hover.

### Page Templates
*   **Home:** Custom split hero layout.
*   **Projects:** Grid layout with hover-interactive cards.
*   **Blog:**
    *   **Featured Post:** The first post on Page 1 is highlighted with a large split layout.
    *   **Grid:** Subsequent posts (and all posts on Page 2+) follow a clean 3-column grid.
*   **About:** Custom timeline layout for Experience and Education, plus a "Connect" sidebar.
*   **Publications:** Specialized bibliography layout with hanging indents and citation styling.

## Quick Start

From the root of your Hugo site, clone the theme into `themes/` by running:

```bash
# Clone theme into the themes/spark2 directory
$ git clone https://github.com/akshaybabloo/spark-hugo-theme.git themes/spark2
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
theme = "spark2"

[pagination]
pagerSize = 12  # Recommended for optimal grid alignment (3x4)

[params]
# ... (standard params)
```

## Front Matter

### `projects` Page
```yaml
projectCategory: "Open Source" # Used for grouping in list layout
externalurl: "https://..."     # Link to external project
```

### `publications` Page
Uses a custom layout `layouts/publications/single.html`. The content should be a standard markdown list of citations.

## Development

For theme changes:
1.  Install dependencies: `npm install` inside `themes/spark2`.
2.  Run dev server: `npm run watch` (runs Vite in watch mode).

## License

Licensed under the MIT License. See the [LICENSE](https://github.com/akshaybabloo/spark-hugo-theme/blob/master/LICENSE) file for more details.