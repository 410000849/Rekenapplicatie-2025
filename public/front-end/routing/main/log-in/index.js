const login_form = document.getElementById('login-form');

login_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = signup_form.querySelector('#email').value;
    const password = signup_form.querySelector('#password').value;
    if (!email || !password) return alert('Een of meer velden zijn niet ingevuld');

    const leerlingIsChecked = signup_form.querySelector('#leerling').checked;
    const ouderIsChecked = signup_form.querySelector('#ouder').checked;
    const docentIsChecked = signup_form.querySelector('#docent').checked;
    const table = leerlingIsChecked ? 'leerling' : ouderIsChecked ? 'ouder' : docentIsChecked ? 'docent' : '';
    if (!table) return alert('Selecteer of u een leerling, ouder of een docent bent');


    await fetch('account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            table
        })
    }).then(response => response.text()).then(data => {
        console.log(data);
    })
})