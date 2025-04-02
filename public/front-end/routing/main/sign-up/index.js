// Zorg dat slechts één checkbox tegelijk actief is
const checkboxes = ['leerling', 'ouder', 'docent'];
checkboxes.forEach(id => {
    document.getElementById(id).addEventListener('change', function () {
        // Vink andere boxen uit
        checkboxes.forEach(otherId => {
            if (otherId !== id) {
                document.getElementById(otherId).checked = false;
            }
        });
    });
});

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
        alert('Kies een rol.');
        return;
    }

    // Verstuur naar backend die SQLite gebruikt
    try {
        const response = await fetch('/account/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });

        if (response.ok) {
            alert('Account succesvol aangemaakt!');
            window.location.href = '/main'; // Vervang door echte route
        } else {
            const error = await response.text();
            alert('Fout bij aanmaken account: ' + error);
        }
    } catch (err) {
        console.error('Signup error:', err);
        alert('Er ging iets mis.');
    }
});
