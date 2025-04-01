const login_form = document.getElementById('login-form');

login_form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await fetch('account/login', {
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