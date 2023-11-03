// Get the list element where tasks will be displayed
const list = document.getElementById("tasksList"); // Assuming there's an element with id 'tasksList'

// Fonction pour ajouter une tâche à l'interface utilisateur
function addTaskToDOM(task) {
    // Vérification des propriétés de l'objet task
    console.log(task)
    if (!task || !task.priority || !task.category || !task.description) {
        console.error('Invalid task object:', task);
        return; // Sortie de la fonction si l'objet task est invalide
    }

    const taskWrap = document.createElement('div');
    taskWrap.className = `task ${task.priority}`;
    const taskItem = document.createElement('p');
    taskItem.textContent = `${task.category} : ${task.description}`;
    
    taskWrap.setAttribute('data-category', task.category);
    taskWrap.setAttribute('data-status', task.priority); // Assuming priority is used as status
    taskWrap.appendChild(taskItem);
    list.appendChild(taskWrap); // Ajoutez l'élément de tâche à la liste
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
            // Assurez-vous que la réponse de l'API contient la tâche ajoutée avant de l'ajouter au DOM
            if (addedTask && addedTask.description && addedTask.category && addedTask.priority) {
                addTaskToDOM(addedTask); // Mettre à jour l'interface utilisateur avec la nouvelle tâche
            } else {
                console.error('Invalid task returned from API:', addedTask);
            }
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
            const categorySelect = document.getElementById('category-select');
            const prioritySelect = document.getElementById('priority-select');

            const taskDescription = taskInput.value.trim();
            const taskCategory = categorySelect.value;
            const taskPriority = prioritySelect.value;

            // Validation des entrées
            if (!taskDescription || !taskCategory || !taskPriority) {
                console.error('Please fill in all fields.');
                return; // Sortie de la fonction si les champs ne sont pas valides
            }

            const task = {
                description: taskDescription,
                category: taskCategory,
                priority: taskPriority
            };

            addTask(task);
            location.reload()
            taskInput.value = '';
            categorySelect.value = '';
            prioritySelect.value = '';
        });
    }
});

// Appel initial pour obtenir et afficher les tâches au chargement de la pages
getTasks();



function filterTasks() {
    const statusFilter = document.getElementById('status-select').value;
    const categoryFilter = document.getElementById('category_select').value;
    const tasks = document.getElementsByClassName('task');

    
    for (let task of tasks) {
       
        const taskStatus = task.getAttribute('data-status');
        const taskCategory = task.getAttribute('data-category');

        // Check if the task matches the filter criteria
        const statusMatch = !statusFilter || taskStatus.includes(statusFilter);
        const categoryMatch = !categoryFilter || taskCategory.includes(categoryFilter);

        
        if (statusMatch && categoryMatch) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    }
}


document.getElementById('status-select').addEventListener('change', filterTasks);
document.getElementById('category_select').addEventListener('change', filterTasks);


document.addEventListener('DOMContentLoaded', filterTasks);
