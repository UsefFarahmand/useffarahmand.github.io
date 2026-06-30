/* ================================================
   i18n.js  —  Bilingual engine (English / Persian)
   - Loads data/i18n.json
   - Applies [data-i18n], [data-i18n-html],
     [data-i18n-placeholder] attributes
   - Re-renders all dynamic sections on switch
   - Persists choice in localStorage
================================================ */

// ── State ─────────────────────────────────────────
let i18nData    = null;
let currentLang = localStorage.getItem('lang') || 'en';

// Expose for other scripts
window.getCurrentLang = () => currentLang;

// ── Deep-get helper ────────────────────────────────
function getVal(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

// ── Apply translations to DOM ──────────────────────
function applyTranslations(lang) {
    if (!i18nData || !i18nData[lang]) return;
    const t = i18nData[lang];

    // html[lang] + dir
    document.documentElement.setAttribute('lang', t.lang);
    document.documentElement.setAttribute('dir',  t.dir);

    // data-i18n → textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const v = getVal(t, el.getAttribute('data-i18n'));
        if (v !== null) el.textContent = v;
    });

    // data-i18n-html → innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const v = getVal(t, el.getAttribute('data-i18n-html'));
        if (v !== null) el.innerHTML = v;
    });

    // data-i18n-placeholder → placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const v = getVal(t, el.getAttribute('data-i18n-placeholder'));
        if (v !== null) el.setAttribute('placeholder', v);
    });

    // Toggle button label
    const lbl = document.getElementById('langToggleLabel');
    if (lbl) lbl.textContent = t.langToggleLabel;

    const btn = document.getElementById('langToggleBtn');
    if (btn) btn.setAttribute('title', t.langToggleTitle);

    // CV download link — different file per language
    const cvBtn = document.getElementById('downloadCvBtn');
    if (cvBtn && t.about && t.about.cvFile) {
        cvBtn.setAttribute('href', t.about.cvFile);
        cvBtn.setAttribute('download', t.about.cvFileName || '');
    }

    // Re-render dynamic sections
    renderDynamicSections(lang);
}

// ── Switch language ────────────────────────────────
function switchLanguage() {
    const newLang = currentLang === 'en' ? 'fa' : 'en';
    document.body.classList.add('lang-switching');
    setTimeout(() => {
        currentLang = newLang;
        localStorage.setItem('lang', newLang);
        applyTranslations(newLang);
        document.body.classList.remove('lang-switching');
    }, 140);
}

// ── Dynamic section re-render ──────────────────────
function renderDynamicSections(lang) {
    if (typeof window.renderExperience      === 'function') window.renderExperience(lang);
    if (typeof window.renderAchievements    === 'function') window.renderAchievements(lang);
    if (typeof window.renderRecommendations === 'function') window.renderRecommendations(lang);
    if (typeof window.renderSkills          === 'function') window.renderSkills(lang);
    if (typeof window.renderExploring       === 'function') window.renderExploring(lang);
    if (typeof window.renderArticles        === 'function') window.renderArticles(lang);
    if (typeof window.renderProjects        === 'function') window.renderProjects(lang);
}

// ── Boot ───────────────────────────────────────────
fetch('data/i18n.json')
    .then(r => r.json())
    .then(data => {
        i18nData = data;
        window.i18nData = data; // expose for scripts.js

        const btn = document.getElementById('langToggleBtn');
        if (btn) btn.addEventListener('click', switchLanguage);

        applyTranslations(currentLang);
    })
    .catch(err => console.warn('i18n: could not load i18n.json', err));
