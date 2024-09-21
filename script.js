// Function to open the contact form popup
function openPopup() {
    document.getElementById('contactPopup').classList.add('active');
}

// Close Popup function
function closePopup(popupId) {
    document.getElementById(popupId).classList.remove('active');
}

// Validate email format
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Validate name format
function validateName(name) {
    const namePattern = /^[A-Za-z\s]+$/;
    return namePattern.test(name);
}

// Function to validate individual input and update border color
function validateInput(input) {
    let isValid = false;

    if (input.id === 'email') {
        isValid = validateEmail(input.value);  // Validate email
    } else {
        isValid = validateName(input.value);   // Validate first/last name
    }

    // If input is invalid, add red border, else reset to default
    input.style.borderColor = isValid ? '' : 'red';
    return isValid;
}

// Ensure submit button is only active when all required fields are valid
const submitBtn = document.getElementById('submitBtn');
const formInputs = document.querySelectorAll('#contactForm input');

// Add event listeners to validate inputs on blur
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);

        // Check if all fields are valid to enable the submit button
        const allValid = [...formInputs].every(input => {
            return validateInput(input);
        });

        submitBtn.disabled = !allValid;
    });
});

// Handle form submission and show thank you popup
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload
    closePopup('contactPopup'); // Close contact form
    document.getElementById('thankYouPopup').classList.add('active'); // Show Thank You Popup
});
