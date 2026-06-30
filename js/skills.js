/* ================================================
   skills.js — renders Skills
================================================ */

let skillsData = [];

fetch('data/skills.json')
    .then(r => r.json())
    .then(data => {
        skillsData = data;
        window.renderSkills(window.getCurrentLang ? window.getCurrentLang() : 'en');
    })
    .catch(err => console.warn('skills.js: failed to load data', err));


window.renderSkills = function(lang) {
    const container = document.getElementById('skillsContainer');
    if (!container || !skillsData.length) return;

    container.innerHTML = '';

    skillsData.forEach(item => {
        const title       = (lang === 'fa' && item.title_fa)       ? item.title_fa       : item.title;
        const description = (lang === 'fa' && item.description_fa) ? item.description_fa : item.description;

        const card = document.createElement('div');
        card.className = 'skill-card';

        card.innerHTML = `
            <div class="skill-title">
                <i class="${item.icon}"></i>
                <h3>${title}</h3>
            </div>
            <p>${description}</p>
        `;

        container.appendChild(card);
    });
};
