var naam = "";
var groep = "";

const naam_element = document.getElementById('naam');
const groep_element = document.getElementById('groep');

document.addEventListener('DOMContentLoaded', async () => {
    await fetch('/account/current').then(response => response.json()).then(async data => {
        const { success } = data;
        if (success == true) {
            const user = data.data;
            naam = user.naam;
            groep = user.table_name;

            naam_element.textContent = naam;
            groep_element.textContent = groep;
        }
    })
});