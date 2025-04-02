const signup_form = document.getElementById('signup-form');

signup_form.addEventListener('submit', async (event) => {
    event.preventDefault();
    

    await fetch('account/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email': "admin1@example.com"
        })
    }).then(response => response.text()).then(data => {
        console.log(data);
    })
})