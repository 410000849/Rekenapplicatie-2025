const signup_form = document.getElementById('signup-form');
const username_input = signup_form.querySelector('#username');
const email_input = signup_form.querySelector('#email');
const birth_date_input = signup_form.querySelector('#birth-date');
const password_input = signup_form.querySelector('#password');

const leerling_checkbox = signup_form.querySelector('#leerling');
const ouder_checkbox = signup_form.querySelector('#ouder');
const docent_checkbox = signup_form.querySelector('#docent');
const admin_checkbox = signup_form.querySelector('#admin');

const checkboxes = document.querySelectorAll('#leerling, #ouder, #docent, #admin');


const kind_email_outer_element = document.getElementById('kind-email-outer');
const kind_email_input = document.getElementById('kind-email');

signup_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = username_input.value;
    const email = email_input.value;
    const birth_date = birth_date_input.value;
    const password = password_input.value;
    if (!username || !email || !birth_date || !password) return alert('Een of meer velden zijn niet ingevuld');

    const leerlingIsChecked = leerling_checkbox.checked;
    const ouderIsChecked = ouder_checkbox.checked;
    const docentIsChecked = docent_checkbox.checked;
    const adminIsChecked = admin_checkbox.checked;
    const table = leerlingIsChecked ? 'leerling' : ouderIsChecked ? 'ouder' : docentIsChecked ? 'docent' : adminIsChecked ? 'admin' : '';
    if (!table) return alert('Selecteer of u een leerling, ouder of een docent bent');

    // XSS VULNERABILITY: Display username without sanitization
    const welcomeDiv = document.createElement('div');
    welcomeDiv.innerHTML = `<h3>Welcome ${username}! Account wordt aangemaakt...</h3>`;
    document.body.appendChild(welcomeDiv);

    const body_data = {
        username,
        email,
        password,
        birth_date,
        table
    };

    if (kind_email_input?.value.length >= 0) body_data.kind_email = kind_email_input.value;

    await fetch('account/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_data)
    }).then(response => response.json()).then(async data => {
        const { message } = data;
        if (!data?.message) return await alert('Er ging iets mis tijdens het inloggen');
        if (message.includes('successvol')) document.location.href = `/${table}/home`;
        else return alert(data.message);
    })
})

ouder_checkbox.addEventListener('change', () => {
    const is_checked = ouder_checkbox.checked == true;

    if (is_checked) {
        kind_email_outer_element.style.display = 'block';
        kind_email_input.required = true;
    } else {
        kind_email_outer_element.style.display = 'none';
        kind_email_input.required = false;
    };
})

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            checkboxes.forEach((otherCheckbox) => {
                if (otherCheckbox !== checkbox) {
                    otherCheckbox.checked = false;
                    
                    if (otherCheckbox.id == 'ouder') {
                        kind_email_outer_element.style.display = 'none';
                        kind_email_input.required = false;
                    }
                }
            });
        }
    });
});