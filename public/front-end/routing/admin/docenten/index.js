var group_id = '';
var group_members = [];

// FUNCTIONS
async function verwijderDocent(email) {
    console.log(`Verwijderen: ${email}`);
};

async function loadContent() {
    try {
        const response = await fetch('/admin/alledocenten');
        const data = await response.json();

        if (!data) return;

        const container = document.getElementById('docenten-container');
        container.innerHTML = '';

        if (data.success === true && Array.isArray(data.alleDocenten)) {
            for (const docent of data.alleDocenten) {
                const { naam, email } = docent;

                const card = document.createElement('div');
                card.classList.add('docent-card');

                const img = document.createElement('img');
                img.src = '/assets/default-docent.jpg';
                img.alt = 'Docent Foto';

                const h3 = document.createElement('h3');
                h3.textContent = naam || 'Onbekende docent';

                const p = document.createElement('p');
                p.textContent = email || '';

                const button = document.createElement('button');
                button.textContent = 'Verwijder';
                button.onclick = () => verwijderDocent(email);

                // Samenstellen van de kaart
                card.appendChild(img);
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