/* ================================================
   achievements.js — renders Achievements
================================================ */

let achievementsData = [];

fetch('data/achievements.json')
    .then(r => r.json())
    .then(data => {
        achievementsData = data;
        window.renderAchievements(window.getCurrentLang ? window.getCurrentLang() : 'en');
    })
    .catch(err => console.warn('achievements.js: failed to load data', err));


window.renderAchievements = function(lang) {
    const container = document.getElementById('achievementContainer');
    if (!container || !achievementsData.length) return;

    container.innerHTML = '';

    // Label depends on language
    const viewCertLabel = (lang === 'fa') ? 'مشاهده گواهینامه' : 'View Certificate';

    achievementsData.forEach(item => {
        const title       = (lang === 'fa' && item.title_fa)       ? item.title_fa       : item.title;
        const description = (lang === 'fa' && item.description_fa) ? item.description_fa : item.description;

        const dateDisplay = (lang === 'fa' && window.toJalali)
            ? window.toJalali(item.date, { day: false })
            : item.date;

        const card = document.createElement('div');
        card.className = 'achievement-card';

        card.innerHTML = `
            <div class="achievement-title">
                <i class="fa-solid fa-trophy"></i>
                <h3>${title}</h3>
            </div>
            <span class="achievement-year">${dateDisplay}</span>
            <p>${description}</p>
            <a class="certificate-btn" href="${item.certificate}" target="_blank">
                <i class="fa-solid fa-file-pdf"></i>
                ${viewCertLabel}
            </a>
        `;

        container.appendChild(card);
    });
};
