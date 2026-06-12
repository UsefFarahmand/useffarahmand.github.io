const projectsGrid = document.getElementById("projects-grid");

const overlay = document.getElementById("project-overlay");

const overlayTitle = document.getElementById("overlay-title");
const overlayGenre = document.getElementById("overlay-genre");
const overlayDescription = document.getElementById("overlay-description");
const overlayGallery = document.getElementById("overlay-gallery");
const overlayLinks = document.getElementById("overlay-links");

const gallery = document.getElementById("overlay-gallery");
const prevBtn = document.getElementById("gallery-prev");
const nextBtn = document.getElementById("gallery-next");

const imageViewer = document.getElementById("image-viewer");
const viewerContent = document.getElementById("viewer-content");
const closeImage = document.getElementById("close-image");

const closeButton = document.getElementById("close-overlay");

fetch("data/projects.json")
    .then(response => response.json())
    .then(projects => {

        projects.forEach(project => {

            const card = document.createElement("div");

            card.classList.add("project-card");

            card.innerHTML = `
                <img src="${project.thumbnail}" alt="${project.title}">

                <div class="project-content">

                    <h3 class="project-title">
                        ${project.title}
                    </h3>

                    <div class="project-genre">
                        ${project.genre || ""}
                    </div>

                    <button class="project-btn">
                        View Project
                    </button>

                </div>
            `;

            card.querySelector(".project-btn")
                .addEventListener("click", () => {
                    openProject(project);
                });

            projectsGrid.appendChild(card);
        });

    })
    .catch(error => {
        console.error("Error loading projects:", error);
    });

function openProject(project){

    overlayTitle.textContent =
        project.title || "";

    overlayGenre.textContent =
        project.genre || "";

    overlayDescription.textContent =
        project.description || "";

    document.getElementById("overlay-banner").style.backgroundImage =
        `url(${project.thumbnail})`;

    document.getElementById("overlay-platforms").innerHTML =
        (project.platforms || []).map(platform => {

            if(platform === "Android")
                return '<span><i class="fab fa-android"></i> Android</span>';

            if(platform === "PC")
                return '<span><i class="fas fa-desktop"></i> PC</span>';

            if(platform === "WebGL")
                return '<span><i class="fas fa-globe"></i> WebGL</span>';

            if(platform === "iOS")
                return '<span><i class="fab fa-apple"></i> iOS</span>';

            return `<span>${platform}</span>`;

        }).join("");

    document.getElementById("overlay-release").innerHTML =
    `
    <div class="info-label">
        Released on
    </div>

    <div class="info-value">
        ${formatDate(project.releaseDate)}
    </div>
    `;

    document.getElementById("overlay-update").innerHTML =
    `
    <div class="info-label">
        Updated on
    </div>

    <div class="info-value">
        ${formatDate(project.lastUpdate)}
    </div>
    `;

    overlayGallery.innerHTML = "";
    overlayLinks.innerHTML = "";

    /* Images */

    overlayGallery.innerHTML = "";

    /* Videos */

    if(project.videos){

        project.videos.forEach(video => {

            const videoThumb =
                document.createElement("div");

            videoThumb.classList.add("video-thumb");

            videoThumb.innerHTML = `
                <img src="${video.thumbnail}" alt="Video">

                <div class="play-icon">
                    <i class="fas fa-play"></i>
                </div>
            `;

            videoThumb.addEventListener("click", () => {

                let embedUrl = video.url;

                if(embedUrl.includes("youtube.com/watch?v=")){

                    const videoId =
                        embedUrl.split("v=")[1].split("&")[0];

                    embedUrl =
                        `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                }

                viewerContent.innerHTML = `
                    <iframe
                        src="${embedUrl}"
                        allow="autoplay; encrypted-media"
                        allowfullscreen>
                    </iframe>
                `;

                imageViewer.classList.add("active");
            });

            overlayGallery.appendChild(videoThumb);
        });

    }

    /* Images */

    if(project.images){

        project.images.forEach(image => {

            const img = document.createElement("img");

            img.src = image;
            img.alt = project.title;
            img.classList.add("gallery-item");

            img.addEventListener("click", () => {

                viewerContent.innerHTML = `
                    <img src="${image}">
                `;

                imageViewer.classList.add("active");
            });

            overlayGallery.appendChild(img);
        });

    }

    /* Gallery Buttons */

    const galleryCount =
    (project.images?.length || 0) +
    (project.videos?.length || 0);

    if(galleryCount > 2){

        prevBtn.style.display = "flex";
        nextBtn.style.display = "flex";

    }
    else{

        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
    }

    /* Links */

    if(project.links){

        project.links.forEach(link => {

            overlayLinks.innerHTML += `
                <a
                    class="overlay-link"
                    href="${link.url}"
                    target="_blank">

                    <i class="${link.icon}"></i>

                    ${link.title}

                </a>
            `;

        });

    }

    overlay.classList.add("active");

    document.body.style.overflow = "hidden";
}

closeButton.addEventListener("click", closeOverlay);

closeImage.addEventListener("click", () => {

    imageViewer.classList.remove("active");

    viewerContent.innerHTML = "";

});

nextBtn.addEventListener("click", () => {

    gallery.scrollBy({

        left: 350,

        behavior: "smooth"

    });

});

prevBtn.addEventListener("click", () => {

    gallery.scrollBy({

        left: -350,

        behavior: "smooth"

    });

});

overlay.addEventListener("click", e => {

    if(e.target === overlay){

        closeOverlay();

    }

});

imageViewer.addEventListener("click", e => {

    if(e.target === imageViewer){

        imageViewer.classList.remove("active");

        viewerContent.innerHTML = "";

    }

});

function closeOverlay(){

    overlay.classList.remove("active");

    document.body.style.overflow = "";

}

function formatDate(dateString){

    if(!dateString)
        return "-";

    return new Date(dateString).toLocaleDateString(
        "en-US",
        {
            year:"numeric",
            month:"short",
            day:"numeric"
        }
    );
}