const container_element = document.querySelector('.container');

const kind_naam_element = document.getElementById('kind-naam');
const kind_email_element = document.getElementById('kind-email');
const klas_naam_element = document.getElementById('Klas-naam');
const klas_type_element = document.getElementById('Klas-type');

// FUNCTIONS
async function loadContent() {
    await fetch('/ouder/leerling').then(response => response.json()).then(data => {
        if (!data) return;
        console.log(data)

        if (data?.success == true) {
            container_element.style.display = 'block';
            const leerling = data.data;
            console.log(leerling);
            kind_naam_element.textContent = leerling.naam;
            kind_email_element.textContent = leerling.email;
            
            if (leerling?.['groep naam']) klas_naam_element.textContent = leerling['groep naam'];
            else klas_naam_element.parentElement.remove();

            if (leerling?.['groep type']) klas_type_element.textContent = leerling?.['groep type'];
            else klas_type_element.parentElement.remove();
        } else if (data?.success == false) {
            if (data?.message == 'Geen leerling gevonden') {
                alert(data.message);
                return document.location.href = document?.referrer ? document.referrer : 'ouder/home'
            }
        } else return alert(data.message);
    })
};

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', async () => {
    loadContent()
});