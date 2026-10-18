/**
 * FontGuj - Gujarati Web Fonts Platform
 * Advanced Live Font Preview Playground & Public CSS Integration
 */

(function () {
  'use strict';

  const BASE_URL = 'https://fontguj.pages.dev';

  // Default font fallback
  const DEFAULT_FONTS = [
    {
      id: 'uc-ajantatwo',
      name: 'UC Ajanta Two',
      family: 'UC_AjantaTwo',
      aliases: ['UCAjantaTwo', 'UC-AjantaTwo'],
      file: '/fonts/UCAjantaTwo-Bold.woff2',
      fileName: 'UCAjantaTwo-Bold.woff2',
      language: 'Gujarati',
      category: 'Display',
      weight: 700,
      weightLabel: 'Bold',
      style: 'normal',
      public: true,
      downloadEnabled: false,
      designer: 'UC Fonts',
      version: '1.0.0',
      description: 'Bold, expressive Gujarati display typeface engineered for impactful headlines and digital typography.',
      supportedWeights: [700],
      previewText: 'જય સ્વામિનારાયણ',
      samplePhrases: [
        'જય સ્વામિનારાયણ',
        'ગુજરાતી ભાષા આપણી ઓળખ છે.',
        'અક્ષર પુરુષોત્તમ મહારાજ',
        'સ્વાગત છે આપનું',
        'ક્ષ જ્ઞ શ્ર ત્ત દ્ધ ક્ર ગ્ર પ્ર',
        '૧ ૨ ૩ ૪ ૫ ૬ ૭ ૮ ૯ ૦'
      ],
      tags: ['Display', 'Bold', 'Unicode', 'Headlines']
    }
  ];

  // Global State
  const state = {
    fonts: DEFAULT_FONTS,
    selectedCategory: 'all',
    searchQuery: '',
    globalText: 'જય સ્વામિનારાયણ',
    globalFontSize: 38,
    activeFontFamily: 'UC_AjantaTwo',
    theme: localStorage.getItem('fontguj_theme') || 'dark',

    // Playground state
    pg: {
      fontSize: 54,
      fontWeight: 700,
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.5,
      textColor: '#f8fafc',
      bgColor: '#0b0f19',
      width: 1160,
      isComparing: false
    },

    // Active modal font
    modalFont: null
  };

  // DOM Elements
  const el = {
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIconSun: document.getElementById('themeIconSun'),
    themeIconMoon: document.getElementById('themeIconMoon'),
    fontSearchInput: document.getElementById('fontSearchInput'),
    globalPreviewInput: document.getElementById('globalPreviewInput'),
    fontSizeSlider: document.getElementById('fontSizeSlider'),
    sizeValueDisplay: document.getElementById('sizeValueDisplay'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    categoryTabs: document.getElementById('categoryTabs'),
    fontsGridContainer: document.getElementById('fontsGridContainer'),
    totalFontCount: document.getElementById('totalFontCount'),

    // Playground Controls
    pgFontSelect: document.getElementById('pgFontSelect'),
    pgSizeSlider: document.getElementById('pgSizeSlider'),
    pgSizeNumber: document.getElementById('pgSizeNumber'),
    pgWeightSelect: document.getElementById('pgWeightSelect'),
    pgAlignGroup: document.getElementById('pgAlignGroup'),
    pgToggleCompareBtn: document.getElementById('pgToggleCompareBtn'),
    compareBtnLabel: document.getElementById('compareBtnLabel'),
    pgUseFontBtn: document.getElementById('pgUseFontBtn'),
    pgResetSettingsBtn: document.getElementById('pgResetSettingsBtn'),

    // Advanced Bar
    pgSpacingSlider: document.getElementById('pgSpacingSlider'),
    pgSpacingDisplay: document.getElementById('pgSpacingDisplay'),
    pgLineHeightSlider: document.getElementById('pgLineHeightSlider'),
    pgLineHeightDisplay: document.getElementById('pgLineHeightDisplay'),
    pgTextColorPicker: document.getElementById('pgTextColorPicker'),
    pgTextHexInput: document.getElementById('pgTextHexInput'),
    pgTextColorVal: document.getElementById('pgTextColorVal'),
    pgBgColorPicker: document.getElementById('pgBgColorPicker'),
    pgBgHexInput: document.getElementById('pgBgHexInput'),
    pgBgColorVal: document.getElementById('pgBgColorVal'),
    pgWidthSlider: document.getElementById('pgWidthSlider'),
    pgWidthDisplay: document.getElementById('pgWidthDisplay'),
    pgWidthFullBtn: document.getElementById('pgWidthFullBtn'),

    // Canvas
    pgCanvasWrapper: document.getElementById('pgCanvasWrapper'),
    pgCanvasBox: document.getElementById('pgCanvasBox'),
    pgEditableArea: document.getElementById('pgEditableArea'),
    pgComparisonContainer: document.getElementById('pgComparisonContainer'),
    compFontNameA: document.getElementById('compFontNameA'),

    // Modal
    useFontModal: document.getElementById('useFontModal'),
    closeUseFontModalBtn: document.getElementById('closeUseFontModalBtn'),
    modalFontTitle: document.getElementById('modalFontTitle'),
    modalCategoryBadge: document.getElementById('modalCategoryBadge'),
    modalPreviewBox: document.getElementById('modalPreviewBox'),
    modalHtmlLinkSnippet: document.getElementById('modalHtmlLinkSnippet'),
    modalCssRuleSnippet: document.getElementById('modalCssRuleSnippet'),
    modalCopyHtmlBtn: document.getElementById('modalCopyHtmlBtn'),
    modalCopyCssBtn: document.getElementById('modalCopyCssBtn'),
    modalFrameworkCode: document.getElementById('modalFrameworkCode'),
    btnFrameworkHtml: document.getElementById('btnFrameworkHtml'),
    btnFrameworkNext: document.getElementById('btnFrameworkNext'),
    btnFrameworkTailwind: document.getElementById('btnFrameworkTailwind'),

    toastContainer: document.getElementById('toastContainer')
  };

  // -----------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------
  async function init() {
    applyTheme(state.theme);
    setupEventListeners();

    try {
      const res = await fetch('fonts.json');
      if (res.ok) {
        const data = await res.json();
        if (data.fonts && Array.isArray(data.fonts) && data.fonts.length > 0) {
          state.fonts = data.fonts.filter(f => f.public !== false);
        }
      }
    } catch (e) {
      console.info('Serving local font metadata.');
    }

    renderFontCards();
    updatePlaygroundFontSelect();
    applyPlaygroundStyles();
  }

  // -----------------------------------------------------------------
  // Theme Handling
  // -----------------------------------------------------------------
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fontguj_theme', theme);

    if (theme === 'light') {
      el.themeIconSun.style.display = 'block';
      el.themeIconMoon.style.display = 'none';
      state.pg.bgColor = '#f8fafc';
      state.pg.textColor = '#0f172a';
    } else {
      el.themeIconSun.style.display = 'none';
      el.themeIconMoon.style.display = 'block';
      state.pg.bgColor = '#0b0f19';
      state.pg.textColor = '#f8fafc';
    }

    updateColorInputs();
    applyPlaygroundStyles();
  }

  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  // -----------------------------------------------------------------
  // Font Library Card Rendering (Strictly NO download buttons)
  // -----------------------------------------------------------------
  function renderFontCards() {
    const query = state.searchQuery.toLowerCase().trim();
    const filtered = state.fonts.filter(font => {
      const catMatch = state.selectedCategory === 'all' || 
        font.category.toLowerCase() === state.selectedCategory.toLowerCase();
      const searchMatch = !query || 
        font.name.toLowerCase().includes(query) ||
        font.family.toLowerCase().includes(query) ||
        (font.designer && font.designer.toLowerCase().includes(query));
      return catMatch && searchMatch;
    });

    el.totalFontCount.textContent = state.fonts.length;

    if (filtered.length === 0) {
      el.fontsGridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">No Gujarati Fonts Match Your Search</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">
            Could not find any fonts matching "${escapeHtml(state.searchQuery)}".
          </p>
          <button class="btn btn-secondary btn-sm" onclick="window.resetAllFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    el.fontsGridContainer.innerHTML = filtered.map(font => {
      const weightLabel = font.weightLabel || font.weight;
      return `
        <article class="font-card" data-family="${escapeHtml(font.family)}" data-category="${escapeHtml(font.category)}">
          <div class="card-header">
            <div class="card-title-group">
              <h3 class="card-font-name">${escapeHtml(font.name)}</h3>
              <span class="card-font-designer">By ${escapeHtml(font.designer || 'UC Fonts')} · Gujarati ${escapeHtml(font.category)}</span>
            </div>
            <div class="card-badges">
              <span class="badge badge-primary">${weightLabel} ${font.weight}</span>
              <span class="badge">${escapeHtml(font.category)}</span>
            </div>
          </div>

          <!-- Live Inline Editable Preview -->
          <div class="card-preview-stage" title="Click to test typing inline">
            <div class="card-editable-text font-preview-item" 
                 contenteditable="true" 
                 spellcheck="false" 
                 style="font-family: '${font.family}', sans-serif; font-size: ${state.globalFontSize}px;">
              ${escapeHtml(state.globalText)}
            </div>
          </div>

          <!-- Actions: Use Font & Live Preview (Strictly NO download buttons) -->
          <div class="card-actions">
            <button class="btn btn-primary btn-sm btn-use-font" data-family="${escapeHtml(font.family)}" title="Get single-line CSS integration code">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              Use Font
            </button>

            <button class="btn btn-secondary btn-sm btn-live-preview" data-family="${escapeHtml(font.family)}" title="Open in Interactive Live Playground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Live Preview
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Synchronize card typing
    document.querySelectorAll('.font-preview-item').forEach(target => {
      target.addEventListener('input', (e) => {
        state.globalText = e.target.innerText;
      });
    });
  }

  function updatePlaygroundFontSelect() {
    el.pgFontSelect.innerHTML = state.fonts.map(font => {
      const selected = font.family === state.activeFontFamily ? 'selected' : '';
      return `<option value="${escapeHtml(font.family)}" ${selected}>${escapeHtml(font.name)} (${font.weightLabel || font.weight})</option>`;
    }).join('');

    updateSupportedWeights();
  }

  function updateSupportedWeights() {
    const font = state.fonts.find(f => f.family === state.activeFontFamily) || state.fonts[0];
    const weights = font.supportedWeights || [font.weight || 700];
    el.pgWeightSelect.innerHTML = weights.map(w => {
      const label = w >= 700 ? 'Bold' : (w >= 500 ? 'Medium' : 'Regular');
      return `<option value="${w}">${label} ${w}</option>`;
    }).join('');
    state.pg.fontWeight = weights[0];
  }

  // -----------------------------------------------------------------
  // Playground Style Application
  // -----------------------------------------------------------------
  function applyPlaygroundStyles() {
    const activeFamily = state.activeFontFamily;
    el.pgEditableArea.style.fontFamily = `'${activeFamily}', sans-serif`;
    el.pgEditableArea.style.fontSize = `${state.pg.fontSize}px`;
    el.pgEditableArea.style.fontWeight = state.pg.fontWeight;
    el.pgEditableArea.style.textAlign = state.pg.textAlign;
    el.pgEditableArea.style.letterSpacing = `${state.pg.letterSpacing}px`;
    el.pgEditableArea.style.lineHeight = state.pg.lineHeight;
    el.pgEditableArea.style.color = state.pg.textColor;

    el.pgCanvasWrapper.style.backgroundColor = state.pg.bgColor;

    // Width
    if (state.pg.width >= 1160) {
      el.pgCanvasBox.style.maxWidth = '100%';
      el.pgWidthDisplay.textContent = '100% (Desktop)';
    } else {
      el.pgCanvasBox.style.maxWidth = `${state.pg.width}px`;
      el.pgWidthDisplay.textContent = `${state.pg.width}px`;
    }

    // Comparison elements if visible
    const compA = document.querySelector('.font-preview-comp-a');
    const compB = document.querySelector('.font-preview-comp-b');
    if (compA && compB) {
      compA.innerText = el.pgEditableArea.innerText;
      compB.innerText = el.pgEditableArea.innerText;
      compA.style.fontFamily = `'${activeFamily}', sans-serif`;
      compA.style.fontSize = `${Math.min(state.pg.fontSize, 48)}px`;
      compB.style.fontSize = `${Math.min(state.pg.fontSize, 48)}px`;
      compA.style.letterSpacing = `${state.pg.letterSpacing}px`;
      compB.style.letterSpacing = `${state.pg.letterSpacing}px`;
      compA.style.lineHeight = state.pg.lineHeight;
      compB.style.lineHeight = state.pg.lineHeight;
    }

    el.compFontNameA.textContent = activeFamily;
  }

  function updateColorInputs() {
    el.pgTextColorPicker.value = state.pg.textColor;
    el.pgTextHexInput.value = state.pg.textColor.toUpperCase();
    el.pgTextColorVal.textContent = state.pg.textColor.toUpperCase();

    el.pgBgColorPicker.value = state.pg.bgColor;
    el.pgBgHexInput.value = state.pg.bgColor.toUpperCase();
    el.pgBgColorVal.textContent = state.pg.bgColor.toUpperCase();
  }

  // -----------------------------------------------------------------
  // Event Listeners
  // -----------------------------------------------------------------
  function setupEventListeners() {
    // Theme toggle
    el.themeToggleBtn.addEventListener('click', toggleTheme);

    // Search
    el.fontSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderFontCards();
    });

    // Global Preview Input
    el.globalPreviewInput.addEventListener('input', (e) => {
      state.globalText = e.target.value || 'જય સ્વામિનારાયણ';
      document.querySelectorAll('.font-preview-item').forEach(el => {
        el.innerText = state.globalText;
      });
    });

    // Global Font Size Slider
    el.fontSizeSlider.addEventListener('input', (e) => {
      state.globalFontSize = parseInt(e.target.value, 10);
      el.sizeValueDisplay.textContent = `${state.globalFontSize}px`;
      document.querySelectorAll('.font-preview-item').forEach(el => {
        el.style.fontSize = `${state.globalFontSize}px`;
      });
    });

    // Preset phrase chips
    document.querySelectorAll('.preset-chip[data-phrase]').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-phrase');
        state.globalText = text;
        el.globalPreviewInput.value = text;
        document.querySelectorAll('.font-preview-item').forEach(el => {
          el.innerText = text;
        });
        showToast(`Loaded sample: "${text}"`);
      });
    });

    // Reset Filter Button
    el.resetFiltersBtn.addEventListener('click', window.resetAllFilters);

    // Category Tabs
    el.categoryTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn')) {
        el.categoryTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        state.selectedCategory = e.target.getAttribute('data-category');
        renderFontCards();
      }
    });

    // Font Card Actions Delegation
    el.fontsGridContainer.addEventListener('click', (e) => {
      const useBtn = e.target.closest('.btn-use-font');
      if (useBtn) {
        const family = useBtn.getAttribute('data-family');
        openUseFontModal(family);
        return;
      }

      const prevBtn = e.target.closest('.btn-live-preview');
      if (prevBtn) {
        const family = prevBtn.getAttribute('data-family');
        activateInPlayground(family);
        return;
      }
    });

    // Playground - Font Selector
    el.pgFontSelect.addEventListener('change', (e) => {
      state.activeFontFamily = e.target.value;
      updateSupportedWeights();
      applyPlaygroundStyles();
      showToast(`Switched font to ${state.activeFontFamily}`);
    });

    // Playground - Size Slider & Number input sync (12px to 200px)
    el.pgSizeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.pg.fontSize = val;
      el.pgSizeNumber.value = val;
      applyPlaygroundStyles();
    });

    el.pgSizeNumber.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val)) val = 12;
      val = Math.max(12, Math.min(200, val));
      state.pg.fontSize = val;
      el.pgSizeSlider.value = val;
      applyPlaygroundStyles();
    });

    // Playground - Weight
    el.pgWeightSelect.addEventListener('change', (e) => {
      state.pg.fontWeight = parseInt(e.target.value, 10);
      applyPlaygroundStyles();
    });

    // Playground - Text Alignment
    el.pgAlignGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.segmented-btn');
      if (btn) {
        el.pgAlignGroup.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.pg.textAlign = btn.getAttribute('data-align');
        applyPlaygroundStyles();
      }
    });

    // Playground - Letter Spacing
    el.pgSpacingSlider.addEventListener('input', (e) => {
      state.pg.letterSpacing = parseFloat(e.target.value);
      el.pgSpacingDisplay.textContent = `${state.pg.letterSpacing}px`;
      applyPlaygroundStyles();
    });

    // Playground - Line Height
    el.pgLineHeightSlider.addEventListener('input', (e) => {
      state.pg.lineHeight = parseFloat(e.target.value);
      el.pgLineHeightDisplay.textContent = state.pg.lineHeight;
      applyPlaygroundStyles();
    });

    // Playground - Text Color
    el.pgTextColorPicker.addEventListener('input', (e) => {
      state.pg.textColor = e.target.value;
      updateColorInputs();
      applyPlaygroundStyles();
    });

    el.pgTextHexInput.addEventListener('change', (e) => {
      const hex = sanitizeHex(e.target.value);
      state.pg.textColor = hex;
      updateColorInputs();
      applyPlaygroundStyles();
    });

    document.querySelectorAll('.preset-color-dot[data-color]').forEach(dot => {
      dot.addEventListener('click', () => {
        state.pg.textColor = dot.getAttribute('data-color');
        updateColorInputs();
        applyPlaygroundStyles();
      });
    });

    // Playground - Background Color
    el.pgBgColorPicker.addEventListener('input', (e) => {
      state.pg.bgColor = e.target.value;
      updateColorInputs();
      applyPlaygroundStyles();
    });

    el.pgBgHexInput.addEventListener('change', (e) => {
      const hex = sanitizeHex(e.target.value);
      state.pg.bgColor = hex;
      updateColorInputs();
      applyPlaygroundStyles();
    });

    document.querySelectorAll('.preset-color-dot[data-bg]').forEach(dot => {
      dot.addEventListener('click', () => {
        state.pg.bgColor = dot.getAttribute('data-bg');
        updateColorInputs();
        applyPlaygroundStyles();
      });
    });

    // Playground - Width Slider
    el.pgWidthSlider.addEventListener('input', (e) => {
      state.pg.width = parseInt(e.target.value, 10);
      applyPlaygroundStyles();
    });

    el.pgWidthFullBtn.addEventListener('click', () => {
      state.pg.width = 1160;
      el.pgWidthSlider.value = 1160;
      applyPlaygroundStyles();
    });

    // Playground - Reset Settings
    el.pgResetSettingsBtn.addEventListener('click', () => {
      state.pg.fontSize = 54;
      state.pg.textAlign = 'center';
      state.pg.letterSpacing = 0;
      state.pg.lineHeight = 1.5;
      state.pg.width = 1160;

      el.pgSizeSlider.value = 54;
      el.pgSizeNumber.value = 54;
      el.pgSpacingSlider.value = 0;
      el.pgSpacingDisplay.textContent = '0px';
      el.pgLineHeightSlider.value = 1.5;
      el.pgLineHeightDisplay.textContent = '1.5';
      el.pgWidthSlider.value = 1160;

      el.pgAlignGroup.querySelectorAll('.segmented-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-align') === 'center');
      });

      applyTheme(state.theme);
      showToast('Typography settings restored to defaults');
    });

    // Playground - Compare Mode Toggle
    el.pgToggleCompareBtn.addEventListener('click', () => {
      state.pg.isComparing = !state.pg.isComparing;
      el.pgComparisonContainer.style.display = state.pg.isComparing ? 'grid' : 'none';
      el.compareBtnLabel.textContent = state.pg.isComparing ? 'Exit Compare' : 'Compare Mode';
      el.pgToggleCompareBtn.classList.toggle('btn-primary', state.pg.isComparing);
      el.pgToggleCompareBtn.classList.toggle('btn-secondary', !state.pg.isComparing);
      applyPlaygroundStyles();
      if (state.pg.isComparing) {
        showToast('Side-by-side comparison active');
      }
    });

    // Playground - Use Font CTA
    el.pgUseFontBtn.addEventListener('click', () => {
      openUseFontModal(state.activeFontFamily);
    });

    // Sample Texts Selection in Playground
    document.querySelectorAll('.preset-chip[data-sample]').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-sample');
        el.pgEditableArea.innerText = text;
        applyPlaygroundStyles();
        showToast(`Loaded sample text`);
      });
    });

    // In-canvas live typing sync
    el.pgEditableArea.addEventListener('input', () => {
      applyPlaygroundStyles();
    });

    // Modal Events
    el.closeUseFontModalBtn.addEventListener('click', () => {
      el.useFontModal.classList.remove('active');
    });

    el.useFontModal.addEventListener('click', (e) => {
      if (e.target === el.useFontModal) {
        el.useFontModal.classList.remove('active');
      }
    });

    // Modal Copy Buttons
    el.modalCopyHtmlBtn.addEventListener('click', () => {
      copyToClipboard(el.modalHtmlLinkSnippet.innerText, 'Copied HTML <link> tag!');
    });

    el.modalCopyCssBtn.addEventListener('click', () => {
      copyToClipboard(el.modalCssRuleSnippet.innerText, 'Copied CSS font-family rule!');
    });

    // Inline Copy Buttons (in Section)
    document.querySelectorAll('.btn-copy-inline').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        copyToClipboard(text, 'Copied to clipboard!');
      });
    });

    // Modal Framework Tabs
    el.btnFrameworkHtml.addEventListener('click', () => setFrameworkSnippet('html'));
    el.btnFrameworkNext.addEventListener('click', () => setFrameworkSnippet('next'));
    el.btnFrameworkTailwind.addEventListener('click', () => setFrameworkSnippet('tailwind'));
  }

  // -----------------------------------------------------------------
  // Modals & Helpers
  // -----------------------------------------------------------------
  function openUseFontModal(family) {
    const font = state.fonts.find(f => f.family === family) || state.fonts[0];
    state.modalFont = font;

    el.modalFontTitle.textContent = `Use ${font.name}`;
    el.modalCategoryBadge.textContent = font.category || 'Display';
    el.modalPreviewBox.style.fontFamily = `'${font.family}', sans-serif`;
    el.modalPreviewBox.innerText = 'જય સ્વામિનારાયણ';

    const linkSnippet = `<link rel="stylesheet" href="${BASE_URL}/css?family=${font.family}">`;
    const cssSnippet = `body { font-family: '${font.family}', sans-serif; }`;

    el.modalHtmlLinkSnippet.innerText = linkSnippet;
    el.modalCssRuleSnippet.innerText = cssSnippet;

    setFrameworkSnippet('html');
    el.useFontModal.classList.add('active');
  }

  function setFrameworkSnippet(framework) {
    const font = state.modalFont || state.fonts[0];
    [el.btnFrameworkHtml, el.btnFrameworkNext, el.btnFrameworkTailwind].forEach(b => b.classList.remove('active'));

    if (framework === 'html') {
      el.btnFrameworkHtml.classList.add('active');
      el.modalFrameworkCode.innerText = `<!-- Add to HTML <head> -->\n<link rel="stylesheet" href="${BASE_URL}/css?family=${font.family}">\n\n<style>\n  h1 { font-family: '${font.family}', sans-serif; }\n</style>`;
    } else if (framework === 'next') {
      el.btnFrameworkNext.classList.add('active');
      el.modalFrameworkCode.innerText = `// In app/layout.tsx or pages/_document.tsx\n<link rel="stylesheet" href="${BASE_URL}/css?family=${font.family}" />\n\n// In your CSS / component:\nfont-family: '${font.family}', sans-serif;`;
    } else if (framework === 'tailwind') {
      el.btnFrameworkTailwind.classList.add('active');
      el.modalFrameworkCode.innerText = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      fontFamily: {\n        'gujarati': ['"${font.family}"', 'sans-serif'],\n      },\n    },\n  },\n};\n\n// Usage: <h1 class="font-gujarati text-4xl">જય સ્વામિનારાયણ</h1>`;
    }
  }

  function activateInPlayground(family) {
    state.activeFontFamily = family;
    el.pgFontSelect.value = family;
    updateSupportedWeights();
    applyPlaygroundStyles();

    document.getElementById('playground').scrollIntoView({ behavior: 'smooth' });
    showToast(`Loaded ${family} in playground`);
  }

  window.resetAllFilters = function () {
    state.searchQuery = '';
    state.globalText = 'જય સ્વામિનારાયણ';
    state.globalFontSize = 38;
    state.selectedCategory = 'all';

    el.fontSearchInput.value = '';
    el.globalPreviewInput.value = 'જય સ્વામિનારાયણ';
    el.fontSizeSlider.value = 38;
    el.sizeValueDisplay.textContent = '38px';
    el.categoryTabs.querySelectorAll('.tab-btn').forEach((b, idx) => b.classList.toggle('active', idx === 0));

    renderFontCards();
    showToast('Filters reset');
  };

  function sanitizeHex(val) {
    val = val.trim();
    if (!val.startsWith('#')) val = '#' + val;
    return /^#[0-9A-Fa-f]{6}$/.test(val) ? val : '#f8fafc';
  }

  function copyToClipboard(text, msg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(() => fallbackCopy(text, msg));
    } else {
      fallbackCopy(text, msg);
    }
  }

  function fallbackCopy(text, msg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast(msg);
    } catch (e) {
      showToast('Press Ctrl+C to copy');
    }
    document.body.removeChild(ta);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color:var(--accent-emerald);">✓</span> <span>${escapeHtml(message)}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
