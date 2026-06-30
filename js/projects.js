/* ================================================
   projects.js  —  Renders Projects page
   i18n-aware: uses window.getCurrentLang()
================================================ */

const projectsGrid  = document.getElementById('projects-grid');
const overlay       = document.getElementById('project-overlay');
const overlayTitle  = document.getElementById('overlay-title');
const overlayLogo   = document.getElementById('overlay-logo');
const overlayGenre  = document.getElementById('overlay-genre');
const overlayDescription = document.getElementById('overlay-description');
const overlayGallery = document.getElementById('overlay-gallery');
const overlayLinks  = document.getElementById('overlay-links');
const gallery       = document.getElementById('overlay-gallery');
const prevBtn       = document.getElementById('gallery-prev');
const nextBtn       = document.getElementById('gallery-next');
const imageViewer   = document.getElementById('image-viewer');
const viewerContent = document.getElementById('viewer-content');
const closeImage    = document.getElementById('close-image');
const closeButton   = document.getElementById('close-overlay');

let projectsData    = [];
let currentProject  = null; // tracks the project shown in the overlay, for re-render on language switch

fetch('data/projects.json')
    .then(r => r.json())
    .then(projects => {
        projects.sort((a, b) => {
            return new Date(b.lastUpdate || b.releaseDate) - new Date(a.lastUpdate || a.releaseDate);
        });
        projectsData = projects;
        window.renderProjects(window.getCurrentLang ? window.getCurrentLang() : 'en');
    })
    .catch(err => console.error('projects.js: failed to load data', err));


window.renderProjects = function(lang) {
    if (!projectsGrid || !projectsData.length) return;

    projectsGrid.innerHTML = '';

    const t = window.i18nData ? window.i18nData[lang].pages.projects : {};

    // Page-level text
    const titleEl    = document.querySelector('.projects-title');
    const subtitleEl = document.querySelector('.projects-subtitle');
    if (titleEl)    titleEl.textContent    = t.title    || 'Projects';
    if (subtitleEl) subtitleEl.textContent = t.subtitle || '';

    // GameHub card translation
    const ghTitle = document.querySelector('.gamehub-featured .explore-info h3');
    const ghDesc  = document.querySelector('.gamehub-featured .explore-info p');
    const ghBtn   = document.querySelector('.gamehub-featured .explore-btn');
    if (ghTitle) ghTitle.textContent = t.gameHubTitle || 'Game Hub';
    if (ghDesc)  ghDesc.textContent  = t.gameHubDesc  || '';
    if (ghBtn)   ghBtn.textContent   = t.gameHubBtn   || 'Enter Game Hub';

    // Section overlay labels
    const sectionLbl = document.querySelector('.overlay-section-title');
    if (sectionLbl) sectionLbl.textContent = t.aboutProject || 'About this project';

    const clientLabel    = t.client          || 'Client';
    const personalLabel  = t.personalProject || 'Personal Project';
    const viewLabel      = t.viewProject     || 'View Project';

    projectsData.forEach(project => {
        const title  = (lang === 'fa' && project.title_fa)  ? project.title_fa  : project.title;
        const genre  = (lang === 'fa' && project.genre_fa)  ? project.genre_fa  : (project.genre || '');
        const client = (lang === 'fa' && project.client_fa) ? project.client_fa : project.client;

        const card = document.createElement('div');
        card.classList.add('project-card');

        card.innerHTML = `
            <img src="${project.thumbnail}" alt="${title}">
            <div class="project-content">
                <h3 class="project-title">${title}</h3>
                <div class="project-genre">${genre}</div>
                ${client
                    ? `<div class="project-client">${clientLabel}: ${client}</div>`
                    : `<div class="project-personal">${personalLabel}</div>`}
                <button class="project-btn">${viewLabel}</button>
            </div>
        `;

        card.querySelector('.project-btn').addEventListener('click', () => openProject(project));
        projectsGrid.appendChild(card);
    });

    // If the overlay is currently open, refresh its content in the new language
    if (currentProject && overlay.classList.contains('active')) {
        populateOverlay(currentProject, lang);
    }
};


function openProject(project) {
    currentProject = project;
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'en';
    populateOverlay(project, lang);

    overlay.classList.add('active');
    gallery.scrollLeft = 0;
    requestAnimationFrame(updateGalleryButtons);
    document.body.style.overflow = 'hidden';
}


function populateOverlay(project, lang) {
    const t = window.i18nData ? window.i18nData[lang].pages.projects : {};
    const locale = lang === 'fa' ? 'fa-IR' : 'en-US';

    const title       = (lang === 'fa' && project.title_fa)       ? project.title_fa       : project.title;
    const genre       = (lang === 'fa' && project.genre_fa)       ? project.genre_fa       : (project.genre || '');
    const description = (lang === 'fa' && project.description_fa) ? project.description_fa : project.description;

    overlayTitle.textContent       = title       || '';
    overlayGenre.textContent       = genre;
    overlayDescription.textContent = description || '';

    // Banner image — falls back to thumbnail if no dedicated banner is set
    const bannerImg = project.banner || project.thumbnail || '';
    document.getElementById('overlay-banner').style.backgroundImage = bannerImg ? `url(${bannerImg})` : 'none';

    // Logo — shown beside the title, left side in English, right side in Persian (handled by CSS row-reverse)
    if (project.logo) {
        overlayLogo.src = project.logo;
        overlayLogo.alt = (t.logoAlt || 'Logo');
        overlayLogo.style.display = 'block';
    } else {
        overlayLogo.style.display = 'none';
    }

    // Section label
    const sectionLbl = document.querySelector('.overlay-section-title');
    if (sectionLbl) sectionLbl.textContent = t.aboutProject || 'About this project';

    document.getElementById('overlay-platforms').innerHTML =
        (project.platforms || []).map(p => {
            if (p === 'Android') return '<span><i class="fab fa-android"></i> Android</span>';
            if (p === 'PC')      return '<span><i class="fas fa-desktop"></i> PC</span>';
            if (p === 'WebGL')   return '<span><i class="fas fa-globe"></i> WebGL</span>';
            if (p === 'iOS')     return '<span><i class="fab fa-apple"></i> iOS</span>';
            return `<span>${p}</span>`;
        }).join('');

    const releaseDate = (lang === 'fa' && window.toJalali)
        ? window.toJalali(project.releaseDate)
        : formatDate(project.releaseDate, locale);

    const updateDate = (lang === 'fa' && window.toJalali)
        ? window.toJalali(project.lastUpdate)
        : formatDate(project.lastUpdate, locale);

    document.getElementById('overlay-release').innerHTML = `
        <div class="info-label">${t.releasedOn || 'Released on'}</div>
        <div class="info-value">${releaseDate}</div>
    `;

    document.getElementById('overlay-update').innerHTML = `
        <div class="info-label">${t.lastUpdate || 'Last update'}</div>
        <div class="info-value">${updateDate}</div>
    `;

    overlayGallery.innerHTML = '';
    overlayLinks.innerHTML   = '';

    if (project.videos) {
        project.videos.forEach(video => {
            const videoThumb = document.createElement('div');
            videoThumb.classList.add('video-thumb');
            videoThumb.innerHTML = `
                <img src="${video.thumbnail}" alt="Video">
                <div class="play-icon"><i class="fas fa-play"></i></div>
            `;
            videoThumb.addEventListener('click', () => {
                let embedUrl = video.url;
                if (embedUrl.includes('youtube.com/watch?v=')) {
                    const videoId = embedUrl.split('v=')[1].split('&')[0];
                    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                }
                viewerContent.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                imageViewer.classList.add('active');
            });
            overlayGallery.appendChild(videoThumb);
        });
    }

    if (project.images) {
        project.images.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.alt = title;
            img.classList.add('gallery-item');
            img.addEventListener('click', () => {
                viewerContent.innerHTML = `<img src="${image}">`;
                imageViewer.classList.add('active');
            });
            overlayGallery.appendChild(img);
        });
    }

    const galleryCount = (project.images?.length || 0) + (project.videos?.length || 0);
    prevBtn.style.display = galleryCount > 2 ? 'flex' : 'none';
    nextBtn.style.display = galleryCount > 2 ? 'flex' : 'none';

    // In RTL, "previous" should visually point right and "next" should point left
    if (lang === 'fa') {
        prevBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    } else {
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }

    gallery.removeEventListener('scroll', updateGalleryButtons);
    gallery.addEventListener('scroll', updateGalleryButtons);

    if (project.links) {
        project.links.forEach(link => {
            overlayLinks.innerHTML += `
                <a class="overlay-link" href="${link.url}" target="_blank">
                    <i class="${link.icon}"></i> ${link.title}
                </a>
            `;
        });
    }

    requestAnimationFrame(updateGalleryButtons);
}


closeButton.addEventListener('click', closeOverlay);

closeImage.addEventListener('click', () => {
    imageViewer.classList.remove('active');
    viewerContent.innerHTML = '';
});

// Prev/Next: in RTL the visual gallery is mirrored (flex-direction: row-reverse
// in CSS), so we invert the scroll direction to match natural right-to-left reading.
nextBtn.addEventListener('click', () => {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'en';
    const dir  = lang === 'fa' ? -350 : 350;
    gallery.scrollBy({ left: dir, behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'en';
    const dir  = lang === 'fa' ? 350 : -350;
    gallery.scrollBy({ left: dir, behavior: 'smooth' });
});

overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
imageViewer.addEventListener('click', e => {
    if (e.target === imageViewer) { imageViewer.classList.remove('active'); viewerContent.innerHTML = ''; }
});

function closeOverlay() {
    overlay.classList.remove('active');
    currentProject = null;
    document.body.style.overflow = '';
}

function formatDate(dateString, locale) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(locale || 'en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

function updateGalleryButtons() {
    const maxScroll = gallery.scrollWidth - gallery.clientWidth;
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'en';

    if (lang === 'fa') {
        // Mirrored gallery: "prev" (visually pointing right) is disabled at the start (scrollLeft near 0 from the right)
        prevBtn.classList.toggle('disabled', gallery.scrollLeft >= maxScroll - 10);
        nextBtn.classList.toggle('disabled', gallery.scrollLeft <= 1);
    } else {
        prevBtn.classList.toggle('disabled', gallery.scrollLeft <= 1);
        nextBtn.classList.toggle('disabled', gallery.scrollLeft >= maxScroll - 10);
    }
}
