var group_id = '';
var group_members = [];

// FUNCTIONS
async function verwijderGroep(naam) {
    console.log(`Verwijderen: ${naam}`);
};

async function loadContent() {
    try {
        const response = await fetch('/admin/allegroepen');
        const data = await response.json();

        if (!data) return;

        const container = document.getElementById('groepen-container');
        container.innerHTML = '';

        if (data.success === true && Array.isArray(data.alleGroepen)) {
            for (const groepen of data.alleGroepen) {
                const { naam, type } = groepen;

                const card = document.createElement('div');
                card.classList.add('groep-card');

                const h3 = document.createElement('h3');
                h3.textContent = naam || 'Onbekende groep';

                const p = document.createElement('p');
                p.textContent = type || '';

                const button = document.createElement('button');
                button.textContent = 'Verwijder';
                button.onclick = () => verwijderGroep(naam);

                // Samenstellen van de kaart
                card.appendChild(h3);
                card.appendChild(p);
                card.appendChild(button);

                container.appendChild(card);
            }
        } else if (data.success === false) {
            container.innerHTML = '<p>Geen docenten gevonden.</p>';
        } else {
            alert(data.message || 'Onbekende fout.');
        }
    } catch (err) {
        console.error('Fout bij laden van docenten:', err);
        alert('Er ging iets mis bij het laden van de docenten.');
    }
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', loadContent);