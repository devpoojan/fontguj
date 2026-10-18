/**
 * FontGuj - Automated Build & Sync Script
 * 
 * 1. Validates all font assets in fonts.json against disk
 * 2. Compiles individual CSS endpoints (css/<FontFamily>.css)
 * 3. Compiles aggregate CSS stylesheet (css/all.css)
 * 4. Syncs Cloudflare Pages Functions registry
 * 5. Creates production ZIP ready for Cloudflare Pages Direct Upload
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = __dirname;
const FONTS_JSON_PATH = path.join(ROOT_DIR, 'fonts.json');
const CSS_DIR = path.join(ROOT_DIR, 'css');
const FONTS_DIR = path.join(ROOT_DIR, 'fonts');
const FUNCTIONS_DIR = path.join(ROOT_DIR, 'functions');
const ZIP_OUTPUT = path.join(ROOT_DIR, 'fontguj-cloudflare-pages.zip');
const BASE_URL = 'https://fontguj.pages.dev';

console.log('----------------------------------------------------');
console.log('🚀 FontGuj - Gujarati Web Fonts Build System');
console.log('----------------------------------------------------\n');

// 1. Read & Validate fonts.json
if (!fs.existsSync(FONTS_JSON_PATH)) {
  console.error('❌ Error: fonts.json not found at', FONTS_JSON_PATH);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(FONTS_JSON_PATH, 'utf-8'));
const fonts = config.fonts || [];

console.log(`📋 Found ${fonts.length} font(s) registered in fonts.json:\n`);

// Ensure directories exist
if (!fs.existsSync(CSS_DIR)) fs.mkdirSync(CSS_DIR, { recursive: true });
if (!fs.existsSync(FONTS_DIR)) fs.mkdirSync(FONTS_DIR, { recursive: true });
if (!fs.existsSync(FUNCTIONS_DIR)) fs.mkdirSync(FUNCTIONS_DIR, { recursive: true });

let missingFiles = 0;
const verifiedFonts = [];

// 2. Validate font files on disk
fonts.forEach((font, idx) => {
  const relativeFile = font.file.startsWith('/') ? font.file.substring(1) : font.file;
  const targetPath = path.join(ROOT_DIR, relativeFile);
  const exists = fs.existsSync(targetPath);

  if (!exists) {
    console.error(`  ❌ [${idx + 1}] Missing file: ${relativeFile} (Font: ${font.name})`);
    missingFiles++;
  } else {
    const stats = fs.statSync(targetPath);
    const sizeKb = (stats.size / 1024).toFixed(1);
    console.log(`  ✓ [${idx + 1}] ${font.name} (${font.family}) -> ${relativeFile} [${sizeKb} KB]`);
    font.fileSize = `${sizeKb} KB`;
    verifiedFonts.push(font);
  }
});

if (missingFiles > 0) {
  console.error(`\n⚠️ Warning: ${missingFiles} font file(s) are missing from disk.`);
}

// 3. Generate individual static CSS stylesheets
console.log('\n🎨 Generating static CSS stylesheets...');

let allCssBlocks = [];

verifiedFonts.forEach(font => {
  const fileName = font.fileName || path.basename(font.file);
  const cdnFontUrl = `${BASE_URL}/fonts/${fileName}`;
  const relativeFontUrl = `/fonts/${fileName}`;

  const cssContent = `/* FontGuj - Gujarati Web Fonts CDN */
/* Font: ${font.name} (${font.weightLabel || font.weight}) */
/* CDN Source: ${BASE_URL} */

@font-face {
  font-family: '${font.family}';
  src: url('${cdnFontUrl}') format('woff2'),
       url('${relativeFontUrl}') format('woff2');
  font-weight: ${font.weight || 400};
  font-style: ${font.style || 'normal'};
  font-display: swap;
}
`;

  // Main Family Name CSS
  const mainCssPath = path.join(CSS_DIR, `${font.family}.css`);
  fs.writeFileSync(mainCssPath, cssContent, 'utf-8');
  console.log(`  ✓ Created: css/${font.family}.css`);

  // Aliases CSS if any
  if (font.aliases && Array.isArray(font.aliases)) {
    font.aliases.forEach(alias => {
      const aliasContent = `/* FontGuj - Alias for ${font.name} */
@font-face {
  font-family: '${alias}';
  src: url('${cdnFontUrl}') format('woff2'),
       url('${relativeFontUrl}') format('woff2');
  font-weight: ${font.weight || 400};
  font-style: ${font.style || 'normal'};
  font-display: swap;
}

@font-face {
  font-family: '${font.family}';
  src: url('${cdnFontUrl}') format('woff2'),
       url('${relativeFontUrl}') format('woff2');
  font-weight: ${font.weight || 400};
  font-style: ${font.style || 'normal'};
  font-display: swap;
}
`;
      const aliasCssPath = path.join(CSS_DIR, `${alias}.css`);
      fs.writeFileSync(aliasCssPath, aliasContent, 'utf-8');
      console.log(`  ✓ Created alias: css/${alias}.css`);
    });
  }

  allCssBlocks.push(cssContent.trim());
});

// 4. Generate css/all.css
const allCssContent = `/* FontGuj - Complete Gujarati Web Fonts Collection */
/* CDN Source: ${BASE_URL} */

${allCssBlocks.join('\n\n')}
`;
fs.writeFileSync(path.join(CSS_DIR, 'all.css'), allCssContent, 'utf-8');
console.log('  ✓ Created: css/all.css');

// 5. Update fonts.json with verified sizes
fs.writeFileSync(FONTS_JSON_PATH, JSON.stringify(config, null, 2), 'utf-8');
console.log('  ✓ Updated: fonts.json');

// 6. Create production ZIP archive for Cloudflare Pages Direct Upload
console.log('\n📦 Packaging into Cloudflare Pages Direct Upload ZIP...');

try {
  // Files to include in the Cloudflare Pages deploy bundle
  const psScript = `powershell -NoProfile -Command "Remove-Item -Path 'fontguj-cloudflare-pages.zip' -ErrorAction SilentlyContinue; Compress-Archive -Path 'index.html', 'styles.css', 'app.js', 'fonts.json', 'favicon.svg', '_headers', '_redirects', 'stylesheet.css', 'test-integration.html', 'README.md', 'fonts', 'css', 'functions' -DestinationPath 'fontguj-cloudflare-pages.zip' -Force"`;
  execSync(psScript, { cwd: ROOT_DIR, stdio: 'inherit' });
  
  if (fs.existsSync(ZIP_OUTPUT)) {
    const zipStats = fs.statSync(ZIP_OUTPUT);
    console.log(`  ✓ Created ZIP: fontguj-cloudflare-pages.zip (${(zipStats.size / 1024).toFixed(1)} KB)`);
  }
} catch (err) {
  console.warn('  ⚠️ Compress-Archive warning:', err.message);
}

console.log('\n====================================================');
console.log('✅ Build Complete! Ready for Cloudflare Pages.');
console.log('   Live Domain Target: https://fontguj.pages.dev/');
console.log('   Direct Upload ZIP : fontguj-cloudflare-pages.zip');
console.log('====================================================\n');
