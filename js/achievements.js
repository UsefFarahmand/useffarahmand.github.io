let achievements = [];


fetch("data/achievements.json")

.then(response => response.json())

.then(data => {


    const container =
        document.getElementById("achievementContainer");


    achievements = data;



    data.forEach(item => {


        const card =
        document.createElement("div");


        card.className =
        "achievement-card";



        card.innerHTML = `


        <div class="achievement-title">


            <i class="fa-solid fa-trophy"></i>


            <h3>
                ${item.title}
            </h3>


        </div>



        <span class="achievement-year">

            ${item.date}

        </span>



        <p>

            ${item.description}

        </p>



        <a class="certificate-btn"

           href="${item.certificate}"

           target="_blank">


            <i class="fa-solid fa-file-pdf"></i>

            View Certificate


        </a>



        `;



        container.appendChild(card);



    });



});