const signup_form = document.getElementById('signup-form');

signup_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let role = '';
    if (document.getElementById('leerling').checked) role = 'leerling';
    else if (document.getElementById('ouder').checked) role = 'ouder';
    else if (document.getElementById('docent').checked) role = 'docent';
    else {
        alert('Kies een rol: Leerling, Ouder of Docent.');
        return;
    }

    const data = { username, email, password, role };

    try {
        const response = await fetch('/account/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Account aangemaakt!');
            window.location.href = '/main';
        } else {
            const error = await response.text();
            alert('Fout: ' + error);
        }
    } catch (err) {
        console.error('Signup error:', err);
        alert('Er ging iets mis.');
    }
});
