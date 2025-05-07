const login_form = document.getElementById('login-form');

login_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = login_form.querySelector('#email').value;
    const password = login_form.querySelector('#password').value;
    if (!email || !password) return alert('Een of meer velden zijn niet ingevuld');

    const leerlingIsChecked = login_form.querySelector('#leerling').checked;
    const ouderIsChecked = login_form.querySelector('#ouder').checked;
    const docentIsChecked = login_form.querySelector('#docent').checked;
    const adminIsChecked = login_form.querySelector('#admin').checked;
    const table = leerlingIsChecked ? 'leerling' : ouderIsChecked ? 'ouder' : docentIsChecked ? 'docent' : adminIsChecked ? 'admin' : '';
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
    }).then(response => response.json()).then(async data => {
        const { message } = data;
        if (!data?.message) return await alert('Er ging iets mis tijdens het inloggen');
        if (message.includes('successvol')) document.location.href = `/${table}/home`;
        else if (message.includes('incorrect')) return alert (data.message);
    })
})