const contact_form_elem = document.getElementById('contact-form');
const antoord_elem = document.getElementById('antwoord');

contact_form_elem.addEventListener('submit', (event) => {
    event.preventDefault();
    antoord_elem.style.display = 'block';
});