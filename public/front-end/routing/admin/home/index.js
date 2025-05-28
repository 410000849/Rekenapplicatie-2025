var naam = "";
var groep = "";

const naam_element = document.getElementById('naam');

document.addEventListener('DOMContentLoaded', async () => {
    await fetch('/account/current').then(response => response.json()).then(async data => {
        const { success } = data;
        if (success == true) {
            const user = data.data;
            naam = user.naam;
            naam_element.textContent = naam;
        }
    })
});