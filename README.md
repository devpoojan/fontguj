# FontGuj - Public Gujarati Web Fonts Platform

> **Free, public, open-source Gujarati Unicode Web Font Platform hosted on Cloudflare Pages.**  
> Target Domain: [https://fontguj.pages.dev/](https://fontguj.pages.dev/)

---

## 🌟 Overview

**FontGuj** is a production-ready, completely free public Gujarati Web Fonts platform inspired by **Google Fonts**, **Adobe Fonts**, and **Linear**. 

It allows web developers and designers to freely browse, test, and integrate Gujarati Unicode fonts into their websites using a single `<link>` tag, with **zero accounts, zero payments, and zero installation**.

### 🔒 Policy on Font Downloads
Font files are **strictly for online web font CSS integration**, not direct file distribution:
- **No download buttons**, WOFF2/TTF downloads, or ZIP font packages are provided in the public UI.
- No public directory listings or download endpoints are exposed.
- Fonts are served directly to web browsers via high-performance `@font-face` rules over Cloudflare Pages Edge CDN.

---

## ⚡ Google Fonts–Style CSS Integration API

### 1. Single Font Integration
Add this line to the `<head>` of your HTML document:

```html
<link rel="stylesheet" href="https://fontguj.pages.dev/css?family=UC_AjantaTwo">
```

Apply in CSS:
```css
body, h1, .gujarati-heading {
  font-family: 'UC_AjantaTwo', sans-serif;
}
```

### 2. Multi-Family Queries (Pipe or Comma Separated)
Query multiple font families in a single request:

```html
<link rel="stylesheet" href="https://fontguj.pages.dev/css?family=UC_AjantaTwo|AnotherFont">
```

### 3. CSS `@import`
```css
@import url("https://fontguj.pages.dev/css?family=UC_AjantaTwo");

.title {
  font-family: 'UC_AjantaTwo', sans-serif;
}
```

### 4. Framework Integration
- **Next.js / React**: Add the `<link>` in `app/layout.tsx` or `pages/_document.tsx`.
- **Tailwind CSS**:
  ```javascript
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        fontFamily: {
          'gujarati': ['"UC_AjantaTwo"', 'sans-serif'],
        },
      },
    },
  };
  ```

---

## 🎛️ Advanced Live Font Preview Playground

The live typography playground allows real-time experimentation before integrating:

- **Real-Time Text Editor**: Type, paste, and edit Gujarati, Hindi, and English text with full multiline and paragraph support.
- **Font Sizing**: Dual synchronized controls with a slider from **12px to 200px** and a direct numeric input box.
- **Supported Weights**: Displays only verified weights supported by the font (`Bold 700`).
- **Text Alignment**: Left, Center, and Right alignment toggle.
- **Letter Spacing**: Slider from **-2px to 10px** (default 0px).
- **Line Height**: Slider from **0.8 to 3.0** (default 1.5).
- **Colors**: Real-time color picker, HEX input box, and preset palette dots for both font and canvas background.
- **Responsive Width Slider**: Test text wrapping from **320px (Mobile)** to **100% (Desktop)**.
- **Live Font Comparison**: Side-by-side comparison mode synchronizing typography settings against baseline fonts.
- **OpenType Ligatures & Conjuncts (જોડાક્ષર)**: Verified rendering for `ક્ષ`, `જ્ઞ`, `શ્ર`, `ત્ત`, `દ્ધ`, `સ્વ`, `પ્ર`, `ક્ર`, `ગ્ર`, `સ્ત્ર`.
- **Sample Presets**:
  - `"જય સ્વામિનારાયણ"` (Default)
  - `"ગુજરાતી ભાષા આપણી ઓળખ છે."`
  - `"અક્ષર પુરુષોત્તમ મહારાજ"`
  - `"સ્વાગત છે આપનું"`
  - `"ક્ષ જ્ઞ શ્ર ત્ત દ્ધ ક્ર ગ્ર પ્ર"`
  - `"૧ ૨ ૩ ૪ ૫ ૬ ૭ ૮ ૯ ૦"`
  - `"ABCDEFGHIJKLMNOPQRSTUVWXYZ"`
  - `"abcdefghijklmnopqrstuvwxyz"`

---

## 🚀 How to Deploy to Cloudflare Pages (30 Seconds)

A deployment archive is ready at:  
`c:\Users\om\Downloads\dist\fontguj-cloudflare-pages.zip`

### Step-by-Step Direct Upload:
1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, go to **Workers & Pages** &rarr; **Create application** &rarr; **Pages**.
3. Choose the **Upload assets** tab.
4. Set the project name to: **`fontguj`** (matching your domain `fontguj.pages.dev`).
5. **Drag and drop** `fontguj-cloudflare-pages.zip` into the upload zone.
6. Click **Deploy Site**.

Your platform and CSS API will be immediately live across Cloudflare's global edge network.

---

## 📁 Project Architecture

```
├── fontguj-cloudflare-pages.zip  # Ready-to-upload ZIP for Cloudflare Pages
├── index.html                    # Public web application UI
├── styles.css                    # Google Fonts / Vercel-inspired typography design system
├── app.js                        # Client application, live playground & modal logic
├── fonts.json                    # Configuration-driven font registry (downloadEnabled: false)
├── fonts/
│   └── UCAjantaTwo-Bold.woff2    # Original WOFF2 font asset
├── css/
│   ├── UC_AjantaTwo.css          # Static CSS endpoint
│   ├── UCAjantaTwo.css           # Alias stylesheet
│   └── all.css                   # All fonts aggregate stylesheet
├── functions/
│   └── css.js                    # Cloudflare Pages Function (/css?family=...)
├── _headers                      # Global CORS and caching configuration
├── _redirects                    # Cloudflare Pages redirects
├── test-integration.html         # Verification page testing CSS integration
├── build.js                      # Build & ZIP generator script
└── package.json                  # Project scripts
```
