/* ================================================
   recommendation.js — renders Recommendations
   i18n-aware: name, role and text all translate.
================================================ */

let testimonialsData = [];

fetch('data/recommendation.json')
    .then(r => r.json())
    .then(data => {
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        data = data.slice(-3);
        testimonialsData = data;
        window.renderRecommendations(window.getCurrentLang ? window.getCurrentLang() : 'en');
    })
    .catch(err => console.warn('recommendation.js: failed to load data', err));


window.renderRecommendations = function(lang) {
    const container = document.getElementById('recommendationContainer');
    if (!container || !testimonialsData.length) return;

    container.innerHTML = '';

    const readMoreLabel  = (lang === 'fa') ? '... بیشتر بخوانید' : '... Read More';
    const viewProfLabel  = (lang === 'fa') ? 'مشاهده پروفایل'   : 'View Profile';

    testimonialsData.forEach((item, index) => {
        const name = (lang === 'fa' && item.name_fa) ? item.name_fa : item.name;
        const role = (lang === 'fa' && item.role_fa) ? item.role_fa : item.role;
        const text = (lang === 'fa' && item.text_fa) ? item.text_fa : item.text;
        const shortText = text.length > 300 ? text.substring(0, 300) : text;

        const card = document.createElement('div');
        card.className = 'testimonial-card';

        card.innerHTML = `
            <div class="testimonial-header">
                <i class="fa-solid fa-quote-left"></i>
                <div>
                    <h3>${name}</h3>
                    <span>${role}</span>
                </div>
            </div>
            <p>
                ${shortText}
                ${text.length > 300
                    ? `<span class="read-more-btn" onclick="openTestimonial(${index})">${readMoreLabel}</span>`
                    : ''}
            </p>
            <a class="testimonial-btn" href="${item.linkedin}" target="_blank">
                <i class="fa-brands fa-linkedin-in"></i>
                ${viewProfLabel}
            </a>
        `;

        container.appendChild(card);
    });
};


function openTestimonial(index) {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'en';
    const item = testimonialsData[index];
    const name = (lang === 'fa' && item.name_fa) ? item.name_fa : item.name;
    const role = (lang === 'fa' && item.role_fa) ? item.role_fa : item.role;
    const text = (lang === 'fa' && item.text_fa) ? item.text_fa : item.text;

    document.getElementById('modalName').innerHTML  = name;
    document.getElementById('modalRole').innerHTML  = role;
    document.getElementById('modalText').innerHTML  = text.replace(/\n\n/g, '<br><br>');
    document.getElementById('testimonialModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeTestimonial() {
    document.getElementById('testimonialModal').style.display = 'none';
    document.body.style.overflow = '';
}
