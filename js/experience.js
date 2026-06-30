/* ================================================
   experience.js — renders Experience & Journey
   i18n-aware: company, role, type, date, location,
   description and skills all switch to Persian.
================================================ */

let experienceData = [];

fetch('data/experience.json')
    .then(r => r.json())
    .then(data => {
        data.sort((a, b) => new Date(a.date.split('-')[0]) - new Date(b.date.split('-')[0]));
        experienceData = data;
        window.renderExperience(window.getCurrentLang ? window.getCurrentLang() : 'en');
    })
    .catch(err => console.warn('experience.js: failed to load data', err));


window.renderExperience = function(lang) {
    const container = document.getElementById('experienceContainer');
    if (!container || !experienceData.length) return;

    container.innerHTML = '';

    experienceData.forEach(item => {
        const role        = (lang === 'fa' && item.role_fa)        ? item.role_fa        : item.role;
        const description = (lang === 'fa' && item.description_fa) ? item.description_fa : item.description;
        const company     = (lang === 'fa' && item.company_fa)     ? item.company_fa     : item.company;
        const type        = (lang === 'fa' && item.type_fa)        ? item.type_fa        : item.type;
        const location     = (lang === 'fa' && item.location_fa)   ? item.location_fa    : item.location;
        const date         = (lang === 'fa' && item.date_fa)       ? item.date_fa        : item.date;
        const skills       = (lang === 'fa' && item.skills_fa)     ? item.skills_fa      : item.skills;

        const metaParts = [type, location].filter(Boolean);

        const el = document.createElement('div');
        el.className = 'timeline-item';

        el.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span>${date}</span>
                <h3>${role}</h3>
                <h4>
                    ${item.linkedin
                        ? `<a href="${item.linkedin}" target="_blank">${company}</a>`
                        : company}
                </h4>
                ${metaParts.length ? `<p class="exp-meta">${metaParts.join(' · ')}</p>` : ''}
                <p>${description}</p>
                ${skills && skills.length
                    ? `<div class="experience-skills">${skills.map(s => `<span>${s}</span>`).join('')}</div>`
                    : ''}
            </div>
        `;

        container.appendChild(el);
    });
};
