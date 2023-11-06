// Get the list element where tasks will be displayed
const list = document.getElementById("tasksList"); // Assuming there's an element with id 'tasksList'
// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.getElementById("close");

const descriptionInput = document.getElementById('description-modal');

const categoryInputModal = document.getElementById('category-select-modal');

const priorityInputModal = document.getElementById('priority-select-modal');

const statusInputModal = document.getElementById('status-select-modal');

// Fonction pour ajouter une tâche à l'interface utilisateur
function addTaskToDOM(task) {
    // Vérification des propriétés de l'objet task
    if (!task || !task.priority || !task.category || !task.description) {
        console.error('Invalid task object:', task);
        return; // Sortie de la fonction si l'objet task est invalide
    }


    // CREATION DU WRAP POUR UNE TACHE
    const taskWrap = document.createElement('div');
    taskWrap.className = `task ${task.priority}`;
    // CREATION DU TEXT POUR UNE TACHE
    const taskItem = document.createElement('p');
    taskItem.textContent = `${task.category} : ${task.description}`;
    // CREATION DES ICONES UPDATE ET DELETE POUR UNE TACHE
    const editWrap = document.createElement('div');
    const penIcon = document.createElement('i');
    const binIcon = document.createElement('i');

    // AJOUT DES CLASSES POUR IMPORTER LES ICONES
    penIcon.classList.add("fa-regular", "fa-pen-to-square", "pen-icon");
    binIcon.classList.add("fa-solid", "fa-trash", "bin-icon");

    taskWrap.setAttribute('data-category', task.category);
    taskWrap.setAttribute('data-status', task.priority); // Assuming priority is used as status

    // EMBRICAGE ET AJOUT DE CES ÉLEMENTS DANS LA LISTE
    taskWrap.appendChild(taskItem);
    list.appendChild(taskWrap); // Ajoutez l'élément de tâche à la liste
    editWrap.appendChild(penIcon);
    editWrap.appendChild(binIcon);
    taskWrap.appendChild(editWrap);


    // DELETE 
    binIcon.addEventListener('click', () => {
        deleteTask(task._id);
    });

    let currentTaskId = "";

    // UPDATE 
    penIcon.onclick = function () {
        modal.style.display = "block";
        descriptionInput.value = task.description;
        setSelectValue('#category-select-modal', task.category);
        setSelectValue('#priority-select-modal', task.priority);
        modal.id = `#${task._id}`
    }

    // OUVERTURE MODAL LORS DU CLIC SUR LE CRAYON
    span.addEventListener('click', function () {
        modal.style.display = "none";
    })

    function setSelectValue(selectId, valueToSet) {
        const selectElement = document.querySelector(selectId);

        // Ensure the select element exists
        if (selectElement) {
            const option = selectElement.querySelector(`option[value="${valueToSet}"]`);

            // Set the value if the option is found
            if (option) {
                selectElement.value = valueToSet;
            }
        }
    }

    document.getElementById("button-modal").addEventListener('click', function () {
        updateTask(task, currentTaskId);
        modal.style.display = "none";
    })
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
                'Access-Control-Allow-Origin': '*'
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
            const categorySelect = document.getElementById('category-select-add');
            const prioritySelect = document.getElementById('priority-select-add');

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




function filterTasks() {
    const statusFilter = document.getElementById('status-select').value;
    const categoryFilter = document.getElementById('category-select').value;
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

async function deleteTask(id) {
    console.log(id)
    try {
        const rawResponse = await fetch(`http://localhost:3000/deleteTask?id=${id}`, {
            method: 'DELETE',
        });
        const response = await rawResponse.json()
        if (response) {
            location.reload()
        }
    } catch (error) {
        console.log(error)
    }
}

async function updateTask() {
    console.log(modal.id)
    try {
        const rawResponse = await fetch(`http://localhost:3000/updateTask`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: modal.id,
                description: descriptionInput.value,
                category: categoryInputModal.value,
                priority: priorityInputModal.value,
            }),
        });
        const response = await rawResponse.json();
        if (response) {
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}

getTasks()

document.getElementById('button-modal').addEventListener('click', console.log("first"))
document.getElementById('status-select').addEventListener('change', filterTasks);
document.getElementById('category-select').addEventListener('change', filterTasks);
document.addEventListener('DOMContentLoaded', filterTasks);
