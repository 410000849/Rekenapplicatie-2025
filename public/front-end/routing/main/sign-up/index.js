const signup_form = document.getElementById('signup-form');

signup_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = signup_form.querySelector('#username').value;
    const email = signup_form.querySelector('#email').value;
    const birth_date = signup_form.querySelector('#birth-date').value;
    const password = signup_form.querySelector('#password').value;
    if (!username || !email || !birth_date || !password) return alert('Een of meer velden zijn niet ingevuld');

    const leerlingIsChecked = signup_form.querySelector('#leerling').checked;
    const ouderIsChecked = signup_form.querySelector('#ouder').checked;
    const docentIsChecked = signup_form.querySelector('#docent').checked;
    const table = leerlingIsChecked ? 'leerling' : ouderIsChecked ? 'ouder' : docentIsChecked ? 'docent' : '';
    if (!table) return alert('Selecteer of u een leerling, ouder of een docent bent');

    await fetch('account/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            password,
            birth_date,
            table
        })
    }).then(response => response.json()).then(data => {
        const { message } = data;
        console.log('data:', data);
        console.log('message:', message);
        return message ? alert(message) : '';
    })
})