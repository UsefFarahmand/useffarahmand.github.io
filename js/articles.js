fetch("data/articles.json")
.then(response => response.json())
.then(articles => {

    articles.sort((a, b) =>
        new Date(b.publishDate) - new Date(a.publishDate)
    );

    const container =
        document.getElementById("articles-container");

    articles.forEach(article => {
        
        const buttonInfo = getButtonInfo(article.url);
        const date = new Date(article.publishDate);

        const formattedDate =
            date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

        container.innerHTML += `
            <div class="article-item">

                <img
                    src="${article.thumbnail}"
                    alt="${article.title}">

                <div class="article-content">

                    <h2>${article.title}</h2>

                    <p>${article.excerpt}</p>

                    <div class="article-footer">

                        <span class="article-date">
                            ${formattedDate}
                        </span>

                        <a
                            href="${article.url}"
                            target="_blank"
                            class="article-btn">

                            <i class="${buttonInfo.icon}"></i>
                             ${buttonInfo.text}
                        </a>

                    </div>

                </div>

            </div>
        `;
    });

})
.catch(error => {
    console.error("Error loading articles:", error);
});

function getButtonInfo(url) {

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes("medium.com")) {
        return {
            text: "Read on Medium",
            icon: "fab fa-medium"
        };
    }

    if (lowerUrl.includes("linkedin.com")) {
        return {
            text: "Read on LinkedIn",
            icon: "fab fa-linkedin"
        };
    }

    if (lowerUrl.includes("dev.to")) {
        return {
            text: "Read on Dev.to",
            icon: "fas fa-book-open"
        };
    }

    if (lowerUrl.endsWith(".pdf")) {
        return {
            text: "Open PDF",
            icon: "fas fa-file-pdf"
        };
    }

    return {
        text: "Read Article",
        icon: "fas fa-arrow-right"
    };
}