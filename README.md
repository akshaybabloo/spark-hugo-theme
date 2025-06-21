# Spark 2

This is the second version of the Spark theme. This theme is built on Hugo v0.133+. It is a dark theme with a minimalistic design.

It uses the following technologies:

- [Tailwind CSS](https://tailwindcss.com/)  - For styling
- [Vue.js](https://vuejs.org/) - For interactivity
- [Algolia](https://www.algolia.com/) - For search
- [Vite](https://vitejs.dev/) - For bundling
- [Font Awesome](https://fontawesome.com/) - For icons
- [TypeScript](https://www.typescriptlang.org/) - For type checking
- [Gulp](https://gulpjs.com/) - For moving static files

![Spark-2 Screenshot](https://raw.githubusercontent.com/akshaybabloo/spark-hugo-theme/spark-2/screenshots/spark2-home-page.jpeg)

## Features

- Responsive design
- Suitable for researchers, PhD candidates, personal website and bloggers
- Disqus support
- Google Ads support (Only for blogs)
- Google Analytics support with event tracking
- Uses SASS/SCSS, no NodeJS needed
- Can change the colour of the theme
- Education and experience data files
- Search index json file (with Algolia support)
- Custom sitemap with images support, custom stylesheet, priority and change frequency
- Structured data for website and blogs
- With blog pagination and categories
- Support for external links in blog
- For production, `HUGO_ENV` must be set to `production`, so that Google Analytics can work.
- SEO
  - Optimised for search engine
  - Custom schemas
- Uses FiraCode with font ligatures for code block
- Option to convert JS/CSS to inline code
- You can add global banner to HTML page
- Support for cloudflare insights
- Customised sponsor link
- Support for adding Videos using video.js
- Sign up user can be added to newsletter
- Added new alert message
- Support for no indexing of pages

## 1.2. Quick Start

From the root of your Hugo site, clone the theme into `themes/` by running:

```md
# Clone theme into the themes/cocoa directory
$ git clone https://github.com/akshaybabloo/spark-hugo-theme.git themes/
```

## Usage

Usage is similar to the original Spark theme. I have added a few more features to this theme.

### Configuration

Please see the configuration [here](https://github.com/akshaybabloo/gollahalli.com/blob/master/config.toml).

```toml
baseURL = "https://www.gollahalli.com/"
languageCode = "en-us"
title = "Akshay Raj Gollahalli"
theme = "spark2"

googleAnalytics = "G-7WDESHJKMH"   # Optional
disqusShortname = "gollahalli-com" # Optional
pygmentsCodeFences = true
enableRobotsTXT = true
enableEmoji = true

[markup]
[markup.highlight]
style = "github-dark"
[markup.goldmark]
[markup.goldmark.renderer]
unsafe = true
[markup.goldmark.extensions]
linkify = false
[markup.goldmark.parser]
[markup.goldmark.parser.attribute]
block = true
title = true

[outputFormats]
[outputFormats.searchindex]
mediaType = "application/json"
baseName = "searchindex"
isPlainText = true
[outputFormats.ads]
mediaType = "text/plain"
baseName = "ads"
isPlainText = true


[mediaTypes]
[mediaTypes."font/woff"]
suffixes = ["woff"]
[mediaTypes."font/woff2"]
suffixes = ["woff2"]

[outputs]
home = ["HTML", "RSS", "searchindex", "ads"]
page = ["HTML", "RSS"]
section = ["HTML", "RSS"]

[params]
googleAds = "7450383714878520"                          # Optional, ignore "ca-pub-"
repo = "https://github.com/akshaybabloo/gollahalli.com"
year = 2024
email = "akshay@gollahalli.com"                 # Optional
#    pgp = "3570 2F7C E0CF 2579 BF7D 05DD A603 9E24 179E E13D" # Optional
# logoSVG = "img/logo.svg" # # Use logoSVG or logo. Optional
# logo = "" # Use logoSVG or logo. Optional
namedLogo = "/img/logo.svg"
logoPhoto = "/img/akshay.jpg"                          # Use logoSVG or logo or logoPhoto. Optional
algoliaAppId = "UT1XVMZE1Q"
algoliaApiKey = "fadcde84f1cdaf165d51c20a50336188"
algoliaIndexName = "gollahalli-website"
thumbnailUrl = "/img/akshay.jpg"
acknowledge = false
convertAssetsToInline = false                          # Converts external assets into minified inline assets
cloudflareInsight = "83b998816e3e4417be0a7582d7645cd3"
clarity = "im383wjll4"

[params.social]
github = "https://github.com/akshaybabloo"      # Optional
linkedin = "https://linkedin.com/in/gollahalli" # Optional
twitter = "http://twitter.com/akshaybabloo"     # Optional

[params.sponsor]
enable = true
link = "https://github.com/sponsors/akshaybabloo"

[params.alert]
body = "Stay home, protect yourself and everyone around you from COVID-19. For more information see - <a href='https://www.who.int/emergencies/diseases/novel-coronavirus-2019'>www.who.int/emergencies/diseases/novel-coronavirus-2019</a>"
type = "danger"
icon = ""

[params.scss]
primary = "#c9cacc"
secondary = "#c9cacc"
backgroundColor = "#1a202c"
backgroundColorLight = "#0d2d42"
textColor = "#c9cacc"
subTextColor = "gray"
labelBackgroundColor = "#e2e8f0"
labelTextColor = "#1a202c"
headers = "#fc8181"

[params.seo]
noIndexTags = true
noIndexCategories = true
```

### Front Matter

I have divided this theme into four (kinda strict way) ways:

1. about - Write about yourself, this page also uses `Education.json` and `Experience.json` data files.
2. blog - Lists out unique tags only related to blog and has ads associated with it.
3. projects - You can link to external website.
4. sitemap.xml - With images and ignores `url`.

For this reason the front matter is somewhat unique to each of them.

#### All Pages

1. When you use `images: []` the first index will be taken as the `thumbnail` image for the meta tag, if not `thumbnailUrl = "/img/akshay.jpg"` under `[params]` is taken into consideration.

#### `about` Page

No unique front matter as such but I do use the `Education.json` and `Experience.json` data files, see [here](#33-data-files) for how they are formatted.

#### `blog` Page

New front matter as `ads: false` (by default), make sure you have `googleAds` under `[params]`.

#### `projects` Page

`projectCategory: ""` is where you give the category of the project (duh!) the `list.html` page is grouped by this.

#### `sitemap.xml` page

```yaml
siteMapImages:
  - imageLoc: "/image1.png"
    imageCaption: "It's caption"
  - imageLoc: "/image2.png"
    imageCaption: "It's caption"
```

The image title is taken as the page title `{{ .Title }}`.

#### `searchindex.json` Search Index

Make sure you add the following in your `config.toml` file for `searchindex.json` to generate:

```toml
[outputFormats]
  [outputFormats.searchindex]
    mediaType= "application/json"
    baseName= "searchindex"
    isPlainText= true

[outputs]
  home= ["HTML","RSS", "searchindex"]
```

### Data files

There are two data files that can be used to print out your education and experiences.

#### Education.json

Format:

```json
{
  "Education": [
    {
      "title": "Title of degree",
      "where": "name of university, location",
      "from": "yyyy",
      "to": "yyyy"
    }
  ]
}
```

#### Experience.json

Format:

```json
{
  "Experience": [
    {
      "title": "title of job",
      "company": "company name.",
      "where": "location",
      "from": "yyyy-mm-dd",
      "to": "yyyy-mm-dd",
    }
  ]
}
```

If the `current` is set to `true` or if `to` set to `Present`, the block is highlighted.

## Development

For theme changes, I am using Hugo's SCSS build capabilities (no need of NodeJS) at [custom.scss](https://github.com/akshaybabloo/spark-hugo-theme/blob/master/assets/scss/custom.scss). All PR's are accepted as far as they follow the OSS standards.

UiKit v3 is still in beta, I'll update them whenever there are any new updates available.

Didn't bother to decorate `_default/list.html` but PRs are welcome.

## License

Licensed under the MIT License. See the [LICENSE](https://github.com/akshaybabloo/spark-hugo-theme/blob/master/LICENSE) file for more details.

