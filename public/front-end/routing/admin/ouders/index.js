var group_id = '';
var group_members = [];

// FUNCTIONS
async function verwijderOuder(email) {
    console.log(`Verwijderen: ${email}`);
};

async function loadContent() {
    try {
        const response = await fetch('/admin/alleouders');
        const data = await response.json();

        if (!data) return;

        const container = document.getElementById('ouders-container');
        container.innerHTML = '';

        if (data.success === true && Array.isArray(data.alleOuders)) {
            for (const ouder of data.alleOuders) {
                const { naam, email } = ouder;

                const card = document.createElement('div');
                card.classList.add('ouder-card');

                const img = document.createElement('img');
                img.src = '/assets/default-ouder.jpg';
                img.alt = 'Ouder Foto';

                const h3 = document.createElement('h3');
                h3.textContent = naam || 'Onbekende ouder';

                const p = document.createElement('p');
                p.textContent = email || '';

                const button = document.createElement('button');
                button.textContent = 'Verwijder';
                button.onclick = () => verwijderOuder(email);

                // Samenstellen van de kaart
                card.appendChild(img);
                card.appendChild(h3);
                card.appendChild(p);
                card.appendChild(button);

                container.appendChild(card);
            }
        } else if (data.success === false) {
            container.innerHTML = '<p>Geen ouders gevonden.</p>';
        } else {
            alert(data.message || 'Onbekende fout.');
        }
    } catch (err) {
        console.error('Fout bij laden van ouders:', err);
        alert('Er ging iets mis bij het laden van de ouders.');
    }
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', loadContent);