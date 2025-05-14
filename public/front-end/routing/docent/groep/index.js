const join_form = document.getElementById('join-form');
const create_form = document.getElementById('create-form');
const groep_lijst = document.getElementById('groep-lijst');
const leave_group = document.getElementById('leave-group');
const groepid = document.getElementById('groepid');

var group_id = '';
var group_members = [];

// FUNCTIONS
async function loadContent() {
    await fetch('/groep/current').then(response => response.json()).then(data => {
        if (!data) return;
        groep_lijst.innerHTML = "";
        
        if (data?.success == true) {
            group_id = data.group_id;
            group_members = data.group_members;

            groepid.textContent = `Groep ID: ${group_id}`;

            // AF MAKEN DOCENT EN IN LEERLING
            for (const group_member of group_members) {
                console.log('group_member:', group_member);

                const li_element = document.createElement('li');
                const img_element = document.createElement('img');
                const div_element = document.createElement('div');

                li_element.appendChild(img_element);
                li_element.appendChild(div_element);

                const strong_element = document.createElement('strong');
                const p_element = document.createElement('p');

                strong_element.textContent = group_member?.naam || '';
                p_element.textContent = group_member?.rol || '';

                div_element.appendChild(strong_element);
                div_element.appendChild(p_element);

                groep_lijst.appendChild(li_element);
            }

            groep_lijst.style.display = 'block';
            leave_group.style.display = 'block';
            create_form.style.display = 'none';
            join_form.style.display = 'none'
        } else if (data?.success == false) {
            groepid.textContent = '';
            groep_lijst.style.display = 'none';
            leave_group.style.display = 'none';
            create_form.style.display = 'block';
            join_form.style.display = 'block'
        } else return alert(data.message);
    })
};

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', async () => {
    loadContent()
});

join_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const groep_id = document.getElementById('groep-id');
    if (!groep_id?.value) return alert('Geen groep ingevuld');
    
    await fetch('/groep/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: groep_id.value
        })
    }).then(response => response.json()).then(data => {
        const { message } = data;
        if (!data?.message) return;
        loadContent()
        alert(message);
    })
});

leave_group.addEventListener('click', async () => {
    await fetch('/groep/leave', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        const { message } = data;
        if (!data?.message) return;
        loadContent()
        alert(message);
    })
});

create_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const groep_naam = document.getElementById('groep-naam');
    const groep_type = document.getElementById('groep-type');
    if (!groep_naam?.value || !groep_type?.value) return alert('Een of meer velden zijn niet ingevuld');

    await fetch('/groep/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            naam: groep_naam.value,
            type: groep_type.value
        })
    }).then(response => response.json()).then(data => {
        const { message } = data;
        if (!data?.message) return;
        loadContent()
        alert(message);
    })
});