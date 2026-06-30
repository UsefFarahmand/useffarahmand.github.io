/* ================================================
   scripts.js
   Contact form logic + nav helpers + PDF viewer
   i18n-aware: reads current lang from window.getCurrentLang()
================================================ */

/* ------------------------------------------------
   i18n helper
------------------------------------------------ */
function t(path) {
    // Access translation strings loaded by i18n.js
    if (!window._i18nStrings) return path;
    const parts = path.split('.');
    let val = window._i18nStrings;
    for (const p of parts) {
        if (val == null) return path;
        val = val[p];
    }
    return val || path;
}

// i18n.js exposes data via window — let scripts.js grab it after load
document.addEventListener('DOMContentLoaded', () => {
    // Give i18n.js a moment then grab strings
    setTimeout(() => {
        if (window.i18nData && window.getCurrentLang) {
            window._i18nStrings = window.i18nData[window.getCurrentLang()];
        }
    }, 300);
});


/* ------------------------------------------------
   Load countries from JSON and populate select
------------------------------------------------ */

fetch('data/countries.json')
    .then(r => r.json())
    .then(countries => {
        const sel = document.getElementById('countryCode');
        if (!sel) return;

        countries.forEach(c => {
            const opt       = document.createElement('option');
            opt.value       = c.code;
            opt.textContent = `${c.flag}  ${c.code}  ${c.name}`;
            if (c.default)  opt.selected = true;
            sel.appendChild(opt);
        });
    })
    .catch(err => console.warn('Could not load countries.json:', err));


/* ------------------------------------------------
   Form element refs
------------------------------------------------ */

const maxChars         = 500;
const firstNameInput   = document.getElementById('firstName');
const lastNameInput    = document.getElementById('lastName');
const emailInput       = document.getElementById('emailAddress');
const countryCodeSel   = document.getElementById('countryCode');
const phoneInput       = document.getElementById('phoneNumber');
const titleSelect      = document.getElementById('messageTitle');
const customTitleInput = document.getElementById('customTitle');
const messageInput     = document.getElementById('message');
const charCount        = document.getElementById('charCount');
const btn              = document.getElementById('btn');
const btnText          = document.getElementById('btnText');


/* ------------------------------------------------
   Validation helpers
------------------------------------------------ */

function validateName(v)  { return v.trim().length > 0; }
function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function validatePhone(v) {
    v = v.trim();
    if (!v) return true;
    return /^\d{5,15}$/.test(v.replace(/[\s\-().]/g, ''));
}

function showFieldError(inputEl, errorElId, msg) {
    if (inputEl)    inputEl.classList.add('is-invalid');
    if (errorElId) {
        const err = document.getElementById(errorElId);
        if (err) { err.textContent = msg; err.classList.add('visible'); }
    }
}

function clearFieldError(inputEl, errorElId) {
    if (inputEl)    inputEl.classList.remove('is-invalid');
    if (errorElId) {
        const err = document.getElementById(errorElId);
        if (err) { err.textContent = ''; err.classList.remove('visible'); }
    }
}


/* ------------------------------------------------
   Success popup
------------------------------------------------ */

function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) popup.classList.add('show');
}

function closeSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) popup.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.addEventListener('click', e => {
            if (e.target === popup) closeSuccessPopup();
        });
    }
});


/* ------------------------------------------------
   Title select — show / hide custom input
------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
    const sel   = document.getElementById('messageTitle');
    const cust  = document.getElementById('customTitle');
    if (sel && cust) {
        sel.addEventListener('change', () => {
            // "Other" is always value="Other" regardless of lang
            if (sel.value === 'Other') {
                cust.style.display = 'block';
                cust.focus();
            } else {
                cust.style.display = 'none';
                cust.value = '';
            }
        });
    }
});


/* ------------------------------------------------
   Live validation
------------------------------------------------ */

if (firstNameInput) {
    firstNameInput.addEventListener('input', () => {
        validateName(firstNameInput.value)
            ? clearFieldError(firstNameInput, null)
            : showFieldError(firstNameInput, null, '');
    });
}

if (lastNameInput) {
    lastNameInput.addEventListener('input', () => {
        validateName(lastNameInput.value)
            ? clearFieldError(lastNameInput, null)
            : showFieldError(lastNameInput, null, '');
    });
}

if (emailInput) {
    emailInput.addEventListener('input', () => {
        const msg = window.getCurrentLang && window.getCurrentLang() === 'fa'
            ? 'لطفاً یک آدرس ایمیل معتبر وارد کنید.'
            : 'Please enter a valid email address.';
        validateEmail(emailInput.value)
            ? clearFieldError(emailInput, 'emailError')
            : showFieldError(emailInput, 'emailError', msg);
    });
}

if (phoneInput) {
    phoneInput.addEventListener('input', () => {
        const msg = window.getCurrentLang && window.getCurrentLang() === 'fa'
            ? 'فقط اعداد، ۵ تا ۱۵ کاراکتر.'
            : 'Digits only, 5–15 characters.';
        validatePhone(phoneInput.value)
            ? clearFieldError(phoneInput, 'phoneError')
            : showFieldError(phoneInput, 'phoneError', msg);
    });
}


/* ------------------------------------------------
   Character counter
------------------------------------------------ */

if (messageInput && charCount) {
    charCount.textContent = maxChars;
    messageInput.addEventListener('input', () => {
        if (messageInput.value.length > maxChars) {
            messageInput.value = messageInput.value.substring(0, maxChars);
        }
        charCount.textContent = maxChars - messageInput.value.length;
    });
}


/* ------------------------------------------------
   Reset form
------------------------------------------------ */

function resetForm() {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'en';
    const sendLabel = lang === 'fa' ? 'ارسال پیام' : 'Send Message';

    if (firstNameInput)   firstNameInput.value      = '';
    if (lastNameInput)    lastNameInput.value       = '';
    if (emailInput)       emailInput.value          = '';
    if (phoneInput)       phoneInput.value          = '';
    if (titleSelect)      titleSelect.selectedIndex = 0;
    if (customTitleInput) { customTitleInput.value = ''; customTitleInput.style.display = 'none'; }
    if (messageInput)     messageInput.value        = '';
    if (charCount)        charCount.textContent     = maxChars;
    if (btnText)          btnText.innerHTML         = `<i class="fa-solid fa-paper-plane"></i> ${sendLabel}`;
    if (btn)              btn.disabled              = false;
}


/* ------------------------------------------------
   Submit
------------------------------------------------ */

function handleSubmit() {
    const lang        = window.getCurrentLang ? window.getCurrentLang() : 'en';
    const emailMsg    = lang === 'fa' ? 'لطفاً یک آدرس ایمیل معتبر وارد کنید.' : 'Please enter a valid email address.';
    const phoneMsg    = lang === 'fa' ? 'فقط اعداد، ۵ تا ۱۵ کاراکتر.'           : 'Digits only, 5–15 characters.';
    const sendingMsg  = lang === 'fa' ? 'در حال ارسال…'                          : 'Sending…';
    const failedMsg   = lang === 'fa' ? 'ارسال ناموفق بود، لطفاً دوباره امتحان کنید.' : 'Submission failed, please try again.';

    let valid = true;

    if (!validateName(firstNameInput ? firstNameInput.value : '')) {
        if (firstNameInput) firstNameInput.classList.add('is-invalid');
        valid = false;
    } else {
        if (firstNameInput) firstNameInput.classList.remove('is-invalid');
    }

    if (!validateName(lastNameInput ? lastNameInput.value : '')) {
        if (lastNameInput) lastNameInput.classList.add('is-invalid');
        valid = false;
    } else {
        if (lastNameInput) lastNameInput.classList.remove('is-invalid');
    }

    if (!validateEmail(emailInput ? emailInput.value : '')) {
        showFieldError(emailInput, 'emailError', emailMsg);
        valid = false;
    } else {
        clearFieldError(emailInput, 'emailError');
    }

    if (!validatePhone(phoneInput ? phoneInput.value : '')) {
        showFieldError(phoneInput, 'phoneError', phoneMsg);
        valid = false;
    } else {
        clearFieldError(phoneInput, 'phoneError');
    }

    const rawTitle   = titleSelect ? titleSelect.value : '';
    const titleValue = rawTitle === 'Other'
        ? (customTitleInput ? customTitleInput.value.trim() : '')
        : rawTitle;

    if (!titleValue) {
        if (titleSelect) titleSelect.classList.add('is-invalid');
        valid = false;
    } else {
        if (titleSelect) titleSelect.classList.remove('is-invalid');
    }

    if (!valid) return;

    const countryCode = countryCodeSel ? countryCodeSel.value : '';
    const phoneVal    = phoneInput && phoneInput.value.trim()
        ? countryCode + ' ' + phoneInput.value.trim()
        : 'Not provided';

    if (btnText) btnText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${sendingMsg}`;
    if (btn)     btn.disabled = true;

    emailjs.send('service_uuyu23a', 'template_youl72m', {
        firstName : firstNameInput ? firstNameInput.value.trim() : '',
        lastName  : lastNameInput  ? lastNameInput.value.trim()  : '',
        email     : emailInput     ? emailInput.value.trim()     : '',
        phone     : phoneVal,
        title     : titleValue,
        message   : messageInput   ? messageInput.value          : '',
        source    : 'Personal Profile Website Contact Form',
    })
    .then(() => {
        resetForm();
        showSuccessPopup();
    })
    .catch(err => {
        console.error('EmailJS error:', err);
        alert(failedMsg);
        const sendLabel = lang === 'fa' ? 'ارسال پیام' : 'Send Message';
        if (btnText) btnText.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${sendLabel}`;
        if (btn)     btn.disabled = false;
    });
}


/* ================================================
   Bootstrap ScrollSpy
================================================ */

window.addEventListener('DOMContentLoaded', () => {

    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    }

    const navbarToggler      = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});


/* ================================================
   My Work dropdown
================================================ */

const myWorkBtn = document.getElementById('myWorkBtn');

if (myWorkBtn) {
    myWorkBtn.addEventListener('click', () => {
        const dropdown = myWorkBtn.closest('.nav-dropdown');
        dropdown.classList.toggle('open');
    });
}

document.addEventListener('DOMContentLoaded', () => {

    const exploreSection = document.querySelector('#explore');
    const navDropdown    = document.querySelector('.nav-dropdown');
    if (!exploreSection || !navDropdown) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.isIntersecting
                ? navDropdown.classList.add('open')
                : navDropdown.classList.remove('open');
        });
    }, { threshold: 0.4 });

    observer.observe(exploreSection);

});


/* ================================================
   PDF certificate viewer
================================================ */

function openCertificate(file) {
    document.getElementById('pdfFrame').src = file;
    document.getElementById('pdfViewer').style.display = 'flex';
}

function closeCertificate() {
    document.getElementById('pdfViewer').style.display = 'none';
    document.getElementById('pdfFrame').src = '';
}
