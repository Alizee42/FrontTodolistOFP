const loginButton = document.getElementById('submit');
const message_error = document.getElementById('message_error');
message_error.style.color = "red";

loginButton.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const rawResponse = await fetch(`http://localhost:3000/users/signin?email=${email}&password=${password}`)
        const response = await rawResponse.json();
        if (response.user) {
            if (response.user) {

                if (response.user.role === "Admin") {
                    window.location.href = '../todolist_admin/index.html';
                } else {
                    window.location.href = '../todolist_user/index.html';
                }
            }
        }
        else {
            message_error.textContent = response.message
        }
    } catch (error) {
        // Gérez les erreurs liées à la requête AJAX
        console.error('Erreur lors de la requête AJAX:', error);
    }
});
