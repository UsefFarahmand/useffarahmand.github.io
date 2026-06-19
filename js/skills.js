fetch("data/skills.json")

.then(response => response.json())

.then(data => {


    const container =
    document.getElementById("skillsContainer");



    data.forEach(item => {


        const card =
        document.createElement("div");


        card.className =
        "skill-card";



        card.innerHTML = `


        <div class="skill-title">


            <i class="${item.icon}"></i>


            <h3>
                ${item.title}
            </h3>


        </div>



        <p>

            ${item.description}

        </p>


        `;


        container.appendChild(card);


    });


});