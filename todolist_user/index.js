
// Get the list element where tasks will be displayed
const list = document.getElementById("tasksList"); // Assuming there's an element with id 'tasksList'

// Fonction pour ajouter une tâche à l'interface utilisateur
function addTaskToDOM(task) {
    const taskItem = document.createElement('li');
    taskItem.textContent = task.description; // Utilisez les propriétés de votre objet de tâche ici
    // Ajouter d'autres détails de la tâche ici si nécessaire
    
    const list = document.getElementById('tasksList');
    list.appendChild(taskItem); // Ajoutez l'élément de tâche à la liste
}

// Fonction pour obtenir et afficher les tâches existantes
async function getTasks() {
    try {
        const rawResponse = await fetch('http://localhost:3000/getTasks');
        const tasks = await rawResponse.json();
        tasks.forEach(addTaskToDOM); // Pour chaque tâche, ajoutez-la à l'interface utilisateur
    } catch (error) {
        console.error('Failed to get tasks:', error);
    }
}

// Fonction pour ajouter une nouvelle tâche au serveur
async function addTask(task) {
    try {
        const response = await fetch('http://localhost:3000/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (response.ok) {
            const addedTask = await response.json();
            addTaskToDOM(addedTask); // Mettez à jour l'interface utilisateur avec la nouvelle tâche
        } else {
            console.error('Failed to add task', response.status);
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Gestionnaire d'événements pour le clic sur le bouton "Ajouter"
document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addTaskButton');
    if (addButton) {
        addButton.addEventListener('click', () => {
            const taskInput = document.querySelector('.add');
            const taskDescription = taskInput.value.trim();
            if (taskDescription) {
                addTask({ description: taskDescription });
                taskInput.value = ''; // Effacer le champ de saisie après l'ajout de la tâche
            }
        });
    }
});

// Appel initial pour obtenir et afficher les tâches au chargement de la page
getTasks();

