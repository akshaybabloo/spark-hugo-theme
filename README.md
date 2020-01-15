# Spark

By default, a dark and responsive Hugo theme. Typography used is Space Mono, monospace. I have designed this theme specifically for researchers or PhD candidates but anyone can use it.

[Demo](https://www.gollahalli.com)

> Note: Working example of this theme can be found at [https://github.com/akshaybabloo/gollahalli.com/](https://github.com/akshaybabloo/gollahalli.com/)

**Table of Content**

<!-- TOC depthFrom:2 -->

- [1. Features](#1-features)
- [2. Quick Start](#2-quick-start)
- [3. Usage](#3-usage)
  - [3.1. Configuration](#31-configuration)
  - [3.2. Front Matter](#32-front-matter)
    - [3.2.1. All Pages](#321-all-pages)
    - [3.2.2. `about` Page](#322-about-page)
    - [3.2.3. `blog` Page](#323-blog-page)
    - [3.2.4. `projects` Page](#324-projects-page)
    - [3.2.5. `sitemap.xml` page](#325-sitemapxml-page)
    - [3.2.6. `searchindex.json` Search Index](#326-searchindexjson-search-index)
  - [3.3. Data files](#33-data-files)
    - [3.3.1. Education.json](#331-educationjson)
    - [3.3.2. Experience.json](#332-experiencejson)
- [4. Development](#4-development)
- [5. License](#5-license)

<!-- /TOC -->

![Screenshot](https://github.com/akshaybabloo/gollahalli.com/raw/master/screeshot/home-page.png)

## 1. Features

- Responsive, uses [UiKit v3](https://github.com/uikit/uikit/)
- Suitable for researchers, PhD candidates, personal website and bloggers
- Disqus support
- Google Ads support (Only for blogs) and AMP blogs
- Google analytics support with event tracking
- Inline CSS and JS, no need of cache bursting
- Uses SASS/SCSS, no NodeJS needed
- Can change the colour of the theme
- Education and experience data files
- Search index json file (with Algolia support)
- Custom sitemap with images support, custom stylesheet, priority and change frequency
- Structured data for website and blogs
- With blog pagination and categories
- Support for external links in blog
- AMP Support
  - Blog contents now support AMP
- For production, `HUGO_ENV` must be set to `production`, so that Google Analytics can work.
- SEO
  - Optimised for search engine
  - Custom schemas
- Uses FiraCode with font ligatures for code block

## 2. Quick Start

From the root of your Hugo site, clone the theme into `themes/Spark` by running:

```md
# Clone theme into the themes/cocoa directory
$ git clone https://github.com/akshaybabloo/spark-hugo-theme.git themes/Spark
```

## 3. Usage

### 3.1. Configuration

Please see the configuration [here](https://github.com/akshaybabloo/gollahalli.com/blob/master/config.toml). This theme is built on Hugo v0.55+.

```toml
baseURL = "https://www.gollahalli.com/"
languageCode = "en-us"
title = "Akshay Raj Gollahalli"
theme = "Spark"

googleAnalytics = "UA-74123356-1" # Optional
disqusShortname = "gollahalli-com" # Optional
pygmentsCodeFences = true
enableRobotsTXT = true

[outputFormats]
  [outputFormats.searchindex]
    mediaType= "application/json"
    baseName= "searchindex"
    isPlainText= true
  [outputFormats.ads]
    mediaType= "text/plain"
    baseName= "ads"
    isPlainText= true
#  [outputFormats.AMP]
#    permalinkable = false


[outputs]
  home = ["HTML", "RSS", "AMP", "searchindex", "ads"]
  page = ["HTML", "RSS", "AMP"]
  section = ["HTML", "RSS", "AMP"]

[params]
    googleAds = "7450383714878520" # Optional, ignore "ca-pub-"
    amp = true
    year = 2019
    github = "https://github.com/akshaybabloo" # Optional
    linkedin = "https://linkedin.com/in/gollahalli" # Optional
    twitter = "http://twitter.com/akshaybabloo" # Optional
    email = "akshay@gollahalli.com" # Optional
#    pgp = "3570 2F7C E0CF 2579 BF7D 05DD A603 9E24 179E E13D" # Optional
    # logoSVG = "img/logo.svg" # # Use logoSVG or logo. Optional
    # logo = "" # Use logoSVG or logo. Optional
    namedLogo = "/img/logo.svg"
    logoPhoto = "/img/akshay.jpg" # Use logoSVG or logo or logoPhoto. Optional
    algoliaAppId = "UT1XVMZE1Q"
    algoliaApiKey = "fadcde84f1cdaf165d51c20a50336188"
    algoliaIndexName = "gollahalli-website"
    thumbnailUrl = "/img/akshay.jpg"
    acknowledge = false
    convertAssetsToInline = true
    [params.scss]
        primary = "#c9cacc"
        secondary = "#c9cacc"
        backgroundColor = "#1a202c"
        backgroundColorLight = "#0d2d42"
        textColor = "#c9cacc"
        subTextColor = "gray"
        globalFontFamilyURL = "https://fonts.googleapis.com/css?family=Space+Mono:400,700" # Not used yet. See https://github.com/gohugoio/hugo/issues
        globalFontFamily = "'Roboto Mono', monospace"
        labelBackgroundColor = "#e2e8f0"
        labelTextColor = "#1a202c"
        headers = "#fc8181"

```

### 3.2. Front Matter

I have divided this theme into four (kinda strict way) ways:

1. about - Write about yourself, this page also uses `Education.json` and `Experience.json` data files.
2. blog - Lists out unique tags only related to blog and has ads associated with it.
3. projects - You can link to external website.
4. sitemap.xml - With images and ignores `url`.

For this reason the front matter is somewhat unique to each of them.

#### 3.2.1. All Pages

1. When you use `images: []` the first index will be taken as the `thumbnail` image for the meta tag, if not `thumbnailUrl = "/img/akshay.jpg"` under `[params]` is taken into consideration.

#### 3.2.2. `about` Page

No unique front matter as such but I do use the `Education.json` and `Experience.json` data files, see [here](#33-data-files) for how they are formatted.

#### 3.2.3. `blog` Page

New front matter as `ads: false` (by default), make sure you have `googleAds` under `[params]`.

#### 3.2.4. `projects` Page

`projectCategory: ""` is where you give the category of the project (duh!) the `list.html` page is grouped by this.

#### 3.2.5. `sitemap.xml` page

```yaml
siteMapImages:
  - imageLoc: "/image1.png"
    imageCaption: "It's caption"
  - imageLoc: "/image2.png"
    imageCaption: "It's caption"
```

The image title is taken as the page title `{{ .Title }}`.

#### 3.2.6. `searchindex.json` Search Index

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

### 3.3. Data files

There are two data files that can be used to print out your education and experiences.

#### 3.3.1. Education.json

Format:

```json
{
  "Education": [
    {
      "title": "Title of degree",
      "where": "name of university, location",
      "from": 2007,
      "to": 2011
    }
  ]
}
```

#### 3.3.2. Experience.json

Format:

```json
{
  "Experience": [
    {
      "title": "title of job",
      "company": "company name.",
      "where": "location",
      "from": "month, year",
      "to": "month, year",
      "current": false
    }
  ]
}
```

If the `current` is set to `true` or if `to` set to `Present`, the block is highlighted.

## 4. Development

For theme changes, I am using Hugo's SCSS build capabilities (no need of NodeJS) at [custom.scss](https://github.com/akshaybabloo/spark-hugo-theme/blob/master/assets/scss/custom.scss). All PR's are accepted as far as they follow the OSS standards.

UiKit v3 is still in beta, I'll update them whenever there are any new updates available.

Didn't bother to decorate `_default/list.html` but PRs are welcome.

## 5. License

Licensed under the MIT License. See the [LICENSE](https://github.com/akshaybabloo/spark-hugo-theme/blob/master/LICENSE) file for more details.
