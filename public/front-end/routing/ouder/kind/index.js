const kind_naam_element = document.getElementById('kind-naam');
const kind_email_element = document.getElementById('kind-email');
const klas_naam_element = document.getElementById('Klas-naam');
const klas_type_element = document.getElementById('Klas-type');

// FUNCTIONS
async function loadContent() {
    await fetch('/ouder/leerling').then(response => response.json()).then(data => {
        if (!data) return;

        if (data?.success == true) {
            const leerling = data.data;
            console.log(leerling);
            kind_naam_element.textContent = leerling.naam;
            kind_email_element.textContent = leerling.email;
            klas_naam_element.textContent = leerling?.['groep naam'];
            klas_type_element.textContent = leerling?.['groep type'];
        } else return alert(data.message);
    })
};

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', async () => {
    loadContent()
});