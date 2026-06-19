fetch("data/exploring.json")

.then(response => response.json())

.then(data => {


    const container =
    document.getElementById("exploringContainer");



    data.forEach(item => {


        const element =
        document.createElement("div");


        element.className =
        "exploring-item";



        element.innerHTML = `


        <i class="${item.icon}"></i>



        <div>


            <h3>
                ${item.title}
            </h3>



            <p>

                ${item.description}

            </p>


        </div>


        `;



        container.appendChild(element);



    });


});