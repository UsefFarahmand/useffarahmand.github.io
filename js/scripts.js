document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#contactForm');
    const submitBtn = document.getElementById('btn');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('emailAddress');
    const accountInput = document.getElementById('socialLink');
    const messageInput = document.getElementById('message');
    const btnText = document.getElementById('btnText');
    const charCount = document.getElementById('charCount');

    // URL validation for GitHub or LinkedIn
    function validateAccountUrl(url) {
        if (url.trim() === "") return true; // Optional field
        const linkedinPattern = /^https:\/\/(www\.)?linkedin\.com\/.*$/;
        const githubPattern = /^https:\/\/(www\.)?github\.com\/.*$/;
        return linkedinPattern.test(url) || githubPattern.test(url);
    }

    // Validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validate name
    function validateName(name) {
        return name.trim().length > 0;
    }

    function showWarning(input, message) {
        input.classList.add('is-invalid');
        let tooltip = input.parentElement.querySelector('.tooltip-text');
        if (!tooltip) {
            tooltip = document.createElement('span');
            tooltip.classList.add('tooltip-text');
            input.parentElement.appendChild(tooltip);
        }
        tooltip.textContent = message;
    }

    function clearWarning(input) {
        input.classList.remove('is-invalid');
        let tooltip = input.parentElement.querySelector('.tooltip-text');
        if (tooltip) {
            tooltip.remove();
        }
    }

    form.addEventListener('input', function () {
        let isFirstNameValid = validateName(firstNameInput.value);
        let isLastNameValid = validateName(lastNameInput.value);
        let isEmailValid = validateEmail(emailInput.value);
        let isAccountValid = validateAccountUrl(accountInput.value);

        if (!isFirstNameValid) {
            showWarning(firstNameInput, 'Please complete this required field.');
        } else {
            clearWarning(firstNameInput);
        }

        if (!isLastNameValid) {
            showWarning(lastNameInput, 'Please complete this required field.');
        } else {
            clearWarning(lastNameInput);
        }

        if (!isEmailValid) {
            showWarning(emailInput, 'Please enter a valid email.');
        } else {
            clearWarning(emailInput);
        }

        if (!isAccountValid) {
            showWarning(accountInput, 'Please enter a valid LinkedIn or GitHub URL.');
        } else {
            clearWarning(accountInput);
        }

        submitBtn.disabled = !(isFirstNameValid && isLastNameValid && isEmailValid && isAccountValid && form.checkValidity());
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();  // Prevent form submission for now

        // Show button animation
        btnText.innerHTML = "Thanks";
        submitBtn.classList.add("active");

        // Sending form data using EmailJS
        emailjs.send("service_uuyu23a", "template_youl72m", {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            account: accountInput.value,
            message: messageInput.value,
        }).then(response => {
            console.log('SUCCESS!', response.status, response.text);
            form.reset();
            charCount.textContent = "0"; // Reset character counter
            btnText.innerHTML = "Submit";
            submitBtn.classList.remove("active");
        }).catch(error => {
            console.error('EmailJS Error:', error);
            alert('Submission failed, please try again.');
        });
    });
});
