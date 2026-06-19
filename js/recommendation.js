let testimonials = [];


fetch("data/testimonials.json")

.then(response => response.json())

.then(data => {


    const container =
        document.getElementById("recommendationContainer");


    // Sort: oldest -> newest
    data.sort((a,b)=>{

        return new Date(a.date) - new Date(b.date);

    });



    // Only latest 3
    data = data.slice(-3);



    testimonials = data;



    data.forEach((item,index)=>{


        const card = document.createElement("div");


        card.className="testimonial-card";


        const shortText =
            item.text.length > 300
            ? item.text.substring(0,300)
            : item.text;



        card.innerHTML = `


        <div class="testimonial-header">

            <i class="fa-solid fa-quote-left"></i>

            <div>

                <h3>${item.name}</h3>

                <span>${item.role}</span>

            </div>

        </div>


        <p>

            ${shortText}

            ${
                item.text.length > 300
                ?
                `<span
                class="read-more-btn"
                onclick="openTestimonial(${index})">
                ... Read More
                </span>`
                :
                ""
            }

        </p>



        <a class="testimonial-btn"
        href="${item.linkedin}"
        target="_blank">

            <i class="fa-brands fa-linkedin-in"></i>
            View Profile

        </a>


        `;


        container.appendChild(card);


    });


});

function openTestimonial(index){

    const item = testimonials[index];


    document.getElementById("modalName").innerHTML =
        item.name;


    document.getElementById("modalRole").innerHTML =
        item.role;


    document.getElementById("modalText").innerHTML =
        item.text.replace(/\n\n/g,"<br><br>");


    document.getElementById("testimonialModal")
        .style.display="flex";


    document.body.style.overflow="hidden";

}



function closeTestimonial(){


    document.getElementById("testimonialModal")
        .style.display="none";


    document.body.style.overflow="";

}