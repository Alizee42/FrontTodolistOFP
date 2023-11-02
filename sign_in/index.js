const loginButton = document.getElementById('submit');

loginButton.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("first")

    try {
        const response = await fetch(`http://localhost:3000/users/signin?email=${email}&password=${password}`)
        const data = await response.json();

        if (response.ok) {
            // Authentification réussie, redirigez l'utilisateur vers la page appropriée
            window.location.href = '../todolist_user/index.html';
        } else {
            // Affichez un message d'erreur à l'utilisateur
            console.error(data.message);
        }
    } catch (error) {
        // Gérez les erreurs liées à la requête AJAX
        console.error('Erreur lors de la requête AJAX:', error);
    }
});
