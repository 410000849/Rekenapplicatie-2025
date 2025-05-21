const logout_button = document.getElementById('logout-button');

logout_button.addEventListener('click', async () => {
    await fetch('/account/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        if (!data?.message) return;
        const { message } = data;
        if (message.toLowerCase().includes('sucessfully')) document.location.href = '/';
    })
});