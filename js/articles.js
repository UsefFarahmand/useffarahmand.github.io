/* ================================================
   articles.js  —  Renders Articles page
   i18n-aware: uses window.getCurrentLang()
================================================ */

let articlesData = [];

fetch('data/articles.json')
    .then(r => r.json())
    .then(data => {
        data.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        articlesData = data;
        window.renderArticles(window.getCurrentLang ? window.getCurrentLang() : 'en');
    })
    .catch(err => console.error('articles.js: failed to load data', err));


window.renderArticles = function(lang) {
    const container = document.getElementById('articles-container');
    if (!container || !articlesData.length) return;

    container.innerHTML = '';

    // Page-level text
    const titleEl    = document.querySelector('.articles-title');
    const subtitleEl = document.querySelector('.articles-subtitle');
    if (titleEl && window.i18nData) {
        titleEl.textContent    = window.i18nData[lang].pages.articles.title;
        subtitleEl.textContent = window.i18nData[lang].pages.articles.subtitle;
    }

    const t = window.i18nData ? window.i18nData[lang].pages.articles : {};

    articlesData.forEach(article => {
        const title   = (lang === 'fa' && article.title_fa)   ? article.title_fa   : article.title;
        const excerpt = (lang === 'fa' && article.excerpt_fa) ? article.excerpt_fa : article.excerpt;

        const btnInfo = getButtonInfo(article.url, lang, t);

        const formattedDate = (lang === 'fa' && window.toJalali)
            ? window.toJalali(article.publishDate)
            : new Date(article.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
              });

        const div = document.createElement('div');
        div.className = 'article-item';
        div.innerHTML = `
            <img src="${article.thumbnail}" alt="${title}">
            <div class="article-content">
                <h2>${title}</h2>
                <p>${excerpt}</p>
                <div class="article-footer">
                    <span class="article-date">${formattedDate}</span>
                    <a href="${article.url}" target="_blank" class="article-btn">
                        <i class="${btnInfo.icon}"></i> ${btnInfo.text}
                    </a>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
};


function getButtonInfo(url, lang, t) {
    const lower = url.toLowerCase();
    const arrowIcon = lang === 'fa' ? 'fas fa-arrow-left' : 'fas fa-arrow-right';
    if (lower.includes('medium.com'))   return { text: t.readOnMedium   || 'Read on Medium',   icon: 'fab fa-medium' };
    if (lower.includes('linkedin.com')) return { text: t.readOnLinkedIn || 'Read on LinkedIn', icon: 'fab fa-linkedin' };
    if (lower.includes('dev.to'))       return { text: t.readOnDevTo    || 'Read on Dev.to',   icon: 'fas fa-book-open' };
    if (lower.endsWith('.pdf'))         return { text: t.openPDF        || 'Open PDF',         icon: 'fas fa-file-pdf' };
    return { text: t.readArticle || 'Read Article', icon: arrowIcon };
}
