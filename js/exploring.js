/* ================================================
   exploring.js — renders Currently Exploring
================================================ */

let exploringData = [];

fetch('data/exploring.json')
    .then(r => r.json())
    .then(data => {
        exploringData = data;
        window.renderExploring(window.getCurrentLang ? window.getCurrentLang() : 'en');
    })
    .catch(err => console.warn('exploring.js: failed to load data', err));


window.renderExploring = function(lang) {
    const container = document.getElementById('exploringContainer');
    if (!container || !exploringData.length) return;

    container.innerHTML = '';

    exploringData.forEach(item => {
        const title       = (lang === 'fa' && item.title_fa)       ? item.title_fa       : item.title;
        const description = (lang === 'fa' && item.description_fa) ? item.description_fa : item.description;

        const el = document.createElement('div');
        el.className = 'exploring-item';

        el.innerHTML = `
            <i class="${item.icon}"></i>
            <div>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;

        container.appendChild(el);
    });
};
