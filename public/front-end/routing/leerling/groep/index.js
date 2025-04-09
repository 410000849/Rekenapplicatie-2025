const join_form = document.getElementById('join-form');
const create_form = document.getElementById('create-form');

join_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const groep_id = join_form.getElementById('groep-id');
    if (!groep_id) return alert('Geen groep ingevuld');
    
    await fetch('groep/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: groep_id
        })
    }).then(response => response.json()).then(data => {
        const { message } = data;
        if (!data?.message) return;
        alert(message);
    })
});

create_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const groep_naam = create_form.getElementById('groep-naam');
    const groep_type = create_form.getElementById('groep-type');
    if (!groep_naam || !groep_type) return alert('Een of meer velden zijn niet ingevuld');
    
    await fetch('groep/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            naam: groep_naam,
            type: groep_type
        })
    }).then(response => response.json()).then(data => {
        const { message } = data;
        if (!data?.message) return;
        alert(message);
    })
});