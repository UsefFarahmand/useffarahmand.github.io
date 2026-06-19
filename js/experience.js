let experiences = [];


fetch("data/experience.json")


.then(response => response.json())


.then(data => {


    const container =
        document.getElementById("experienceContainer");



    data.sort((a,b)=>{

        return new Date(a.date.split("-")[0]) 
        - new Date(b.date.split("-")[0]);

    });

    experiences = data;

    data.forEach(item => {


        const timelineItem =
        document.createElement("div");


        timelineItem.className =
        "timeline-item";



        timelineItem.innerHTML = `


        <div class="timeline-dot"></div>



        <div class="timeline-content">


            <span>
                ${item.date}
            </span>



            <h3>
                ${item.role}
            </h3>


            <h4>

            ${
            item.linkedin

            ?

            `<a href="${item.linkedin}"
            target="_blank">
            ${item.company}
            </a>`

            :

            item.company

            }

            </h4>



            <p>
                ${item.description}
            </p>



            ${
                item.skills && item.skills.length

                ?

                `<div class="experience-skills">

                    ${item.skills.map(skill =>

                        `<span>${skill}</span>`

                    ).join("")}

                 </div>`

                :

                ""

            }


        </div>


        `;



        container.appendChild(timelineItem);



    });


});