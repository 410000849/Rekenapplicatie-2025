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
    const adminIsChecked = signup_form.querySelector('#admin').checked;
    const table = leerlingIsChecked ? 'leerling' : ouderIsChecked ? 'ouder' : docentIsChecked ? 'docent' : adminIsChecked ? 'admin' : '';
    if (!table) return alert('Selecteer of u een leerling, ouder of een docent bent');

    if (table == 'ouder') {
        // EXTRA INPUT FOR LEERLING EMAIL OM TE KOPPELEN
        // kind-email-outer
        // Maak required via JS
    };

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
    }).then(response => response.json()).then(async data => {
        const { message } = data;
        if (!data?.message) return await alert('Er ging iets mis tijdens het inloggen');
        if (message.includes('successvol')) document.location.href = `/${table}/home`;
        else if (message.includes('incorrect')) return alert (data.message);
    })
})