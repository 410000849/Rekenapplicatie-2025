const leaderboard_element = document.querySelector('#leaderboard > ol');

var group_id = '';
var group_members = [];

// FUNCTIONS
async function no_members() {
    const li_element = document.createElement('li');

    const span_element_1 = document.createElement('span');
    span_element_1.textContent = 'No group members found';
    span_element_1.classList.add('not-found');
    
    li_element.appendChild(span_element_1);

    leaderboard_element.appendChild(li_element);
};

async function loadContent() {
    await fetch('/groep/current').then(response => response.json()).then(async data => {
        if (!data) return;
        
        if (data?.success == true) {
            group_id = data.group_id;
            let group_counter = 1;

            group_members = await data.group_members.filter(member => 'punten' in member).sort((a, b) => a.punten + b.punten);
            if (group_members.length < 1) return no_members();

            // AF MAKEN DOCENT EN IN LEERLING
            for (const group_member of group_members) {
                console.log('group_member:', group_member);

                const li_element = document.createElement('li');

                const span_element_1 = document.createElement('span');
                span_element_1.textContent = group_counter;
                span_element_1.classList.add('rank');

                const span_element_2 = document.createElement('span');
                span_element_2.textContent = group_member?.naam || '';
                span_element_2.classList.add('name');

                const span_element_3 = document.createElement('span');
                span_element_3.textContent = group_member?.punten || 0;
                span_element_3.classList.add('score');

                li_element.appendChild(span_element_1);
                li_element.appendChild(span_element_2);
                li_element.appendChild(span_element_3);

                leaderboard_element.appendChild(li_element);
                group_counter++;
            }
        } else if (data?.success == false) {
            no_members();
        } else return alert(data.message);
    })
};

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', async () => {
    loadContent()
});