const button = document.getElementById('button');

button.addEventListener('click', async () => {
    await fetch('account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': 123
        })
    }).then(response => response.text()).then(data => {
        console.log(data);
    })
})