/**
 * array with all created tasks
 */
let tasksToDos = [];


/**
 * array with ids from borad for changing status with buttons on detail cards
 */
let boardListIds = ['todo-list', 'in-progress-list', 'testing-list', 'done-list'];


/**
 * array with all current employees
 */
let employees = [
    {
        'name': 'Leta Marshall',
        'email': 'leta.marshall@example.com',
        'img': 'https://randomuser.me/api/portraits/women/72.jpg'
    },
    {
        'name': 'Joachim Cancel',
        'email': 'joachim.Cancel@example.com',
        'img': 'https://randomuser.me/api/portraits/men/89.jpg'
    },
    {
        'name': 'Kirsten Büchler',
        'email': 'kirsten.buchler@example.com',
        'img': 'https://randomuser.me/api/portraits/women/69.jpg'
    },
    {
        'name': 'Miguel Olson',
        'email': 'miguel.olson@example.com',
        'img': 'https://randomuser.me/api/portraits/men/40.jpg'
    }
];


/**
 * url for backend
 */
setURL('https://gruppe-260.developerakademie.net/smallest_backend_ever-master');


/**
 * initial load function
 */
async function init() {
    await includeHTML();
    await downloadFromServer();
    loadFromBackend();
}


/**
 *  stops event propagation
 * 
 * @param {event} event 
 */
function stopPropagation(event) {
    event.stopPropagation();
}


/**
 * creates card details before fade in
 * 
 * @param {number} id - index of task
 */
function openCardDetails(id) {
    let task = tasksToDos[id]
    let container = document.getElementById("card-details-container");
    container.innerHTML = fillCardDetailsHTML(task);
    window.scrollTo(0, 0)//Auslagern
    fillCardDetailsButtonsContainer(task, id);
    fillCardDeatilCollaborators(id);
    createUrgentBoarder(id, document.getElementById("card-details"))
    fadeIn();
}


/**
 * creates collaborator details on detail card before fade in
 * 
 * @param {number} id - index of task
 */
function fillCardDeatilCollaborators(id) {
    let collaborators = tasksToDos[id]['collaborators'];
    for (let i = 0; i < collaborators.length; i++) {
        const collaborator = collaborators[i];
        document.getElementById('assignee-container').innerHTML += fillCardDeatilCollaboratorsHTML(collaborator)
        ;
    } 
}


/**
 * fades objekts in with removing class d-none and adds opacity transition
 */
function fadeIn() {
    document.getElementById('card-details-container').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('card-details-container').classList.remove('fade-out')
    }, 50);
}


/**
 * fades objekts out with opacity transition and adding class d-none
 */
function closeCardDetails() {
    document.getElementById('card-details-container').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('card-details-container').classList.add('d-none')
    }, 500);
}


/**
 * adds colored border to cards depending on their urgent status
 * 
 * @param {number} i - index of task
 * @param {HTMLBodyElement} container - gives the complete path to container element by document.indexOf('')
 */
function createUrgentBoarder(i, container) {
    let task = tasksToDos[i];
    if (task['currentStatus'] === 'done-list') {
        container.classList.add("done")
    } else if (task['urgency'] === 'High') {
        container.classList.add("urgent")    
        } else if (task['urgency'] === 'Intermediate') {
            container.classList.add("medium") 
        } else if (task['urgency'] === 'Low') {
            container.classList.add("low") 
        }
}


/**
 * creates buttons on detail card depending on their current status
 * 
 * @param {Element} task - a single task element
 * @param {number} id - index of task
 */
function fillCardDetailsButtonsContainer(task, id) {
    container = document.getElementById('button-container');
    container.innerHTML = '';
    if(task['currentStatus'] === 'todo-list') {
        container.innerHTML += addCurrentStatusTitleHTML('To Do');
        container.innerHTML += addForwardButtonHTML(id);
        container.innerHTML += addCloseCardDEatilsButtonHTML(id);
    } else if (task['currentStatus'] === 'in-progress-list') {
        container.innerHTML += addBackButtonHTML(id);
        container.innerHTML += addCurrentStatusTitleHTML('In Progress');
        container.innerHTML += addForwardButtonHTML(id);
        container.innerHTML += addCloseCardDEatilsButtonHTML(id);
    } else if (task['currentStatus'] === 'testing-list') {
        container.innerHTML += addBackButtonHTML(id);
        container.innerHTML += addCurrentStatusTitleHTML('Testing');
        container.innerHTML += addForwardButtonHTML(id);
        container.innerHTML += addCloseCardDEatilsButtonHTML(id);
    } else {
        container.innerHTML += addBackButtonHTML(id);
        container.innerHTML += addCurrentStatusTitleHTML('Done');
        container.innerHTML += addDeleteButtonHTML(id);
        container.innerHTML += addCloseCardDEatilsButtonHTML(id);
    }
}


/**
 * moves task to next status
 * 
 * @param {number} id - index of task
 */
function nextStatus(id) {
    let task = tasksToDos[id];
    let currentStatus = task['currentStatus'];
    let currentStatusIndex = boardListIds.indexOf(currentStatus);
    let newStatusIndex = currentStatusIndex + 1;
    task['currentStatus'] = boardListIds[newStatusIndex];
    fillCardDetailsButtonsContainer(task, id);
    saveToBackend();
    checkCurrentHtmlLocationAndUpdateCards();
    openCardDetails(id);
}


/**
 * moves task to previous status
 * 
 * @param {number} id - index of task
 */
function lastStatus(id) {
    let task = tasksToDos[id];
    let currentStatus = task['currentStatus'];
    let currentStatusIndex = boardListIds.indexOf(currentStatus);
    let newStatusIndex = currentStatusIndex - 1;
    task['currentStatus'] = boardListIds[newStatusIndex];
    fillCardDetailsButtonsContainer(task, id);
    saveToBackend();
    checkCurrentHtmlLocationAndUpdateCards();
    openCardDetails(id)
}


/**
 * deletes Task
 * 
 * @param {number} id - index of task
 */
function deleteTask(id) {
    tasksToDos.splice(id, 1);
    saveToBackend();
    checkCurrentHtmlLocationAndUpdateCards();
    closeCardDetails();
}


/**
 * checks request origin by searchin for specific class
 */
function checkCurrentHtmlLocationAndUpdateCards() {
    if(document.getElementById('card-details-container').classList.contains('primary')) {
        loadTasksToBoard();
    } else {
        loadTasksToBacklog()
    }
}


/**
 * shows navbar when in mobile mode and hide it after 4s
 */
function toggleNavbar() {
    document.getElementById('navbar').classList.toggle('show-navbar');
    setTimeout(() => {
        document.getElementById('navbar').classList.remove('show-navbar');
    }, 4000)
}



/**
 * save to LocalStorage
 */
async function saveToBackend() {
    let tasksToDosAsText = JSON.stringify(tasksToDos);
   await backend.setItem('tasksToDos', tasksToDosAsText);
}


/**
 * load from LocalStorage
 */
function loadFromBackend() {
    let tasksToDosAsText = backend.getItem('tasksToDos');
    if (tasksToDosAsText) {
        tasksToDos = JSON.parse(tasksToDosAsText);
    }
}

//Snippets

/**
 * returns html code for card details
 * 
 * @param {Element} task - a single task element
 * @returns - html code for card details
 */
function fillCardDetailsHTML(task) {
    return /*html*/ `
    <div class="card-details-content" id="card-details" onclick="stopPropagation(event)">
            <div class="card-details-content-left">
                <h2>${task['title']}</h2>
                <span><b>Urgency:</b> ${task['urgency']}</span>
                <span><b>Category:</b> ${task['category']}</span>
                <div class="deadline-container">
                    <span><b>Created On:</b> ${task['createdDate']}</span>
                    <span><b>Due Date:</b> ${task['dueDate']}</span>
                </div>
                <span><b>Task Description:</b></span>
                <span class="card-details-description">${task['description']}</span>
            </div>
            <div class="card-details-content-right">
                <div class="card-details-button-container" id="button-container">
                </div>
                <div id="assignee-container">
                </div>
            </div>
        </div>
`
}


/**
 * returns html code for collaborators on card details
 * 
 * @param {Element} collaborator - a single collaborator element
 * @returns - html code for collaborators on card details
 */
function fillCardDeatilCollaboratorsHTML(collaborator) {
    return /*html*/ `
    <div class="assignee-container">
       <img src="${collaborator['img']}" alt="">
       <div class="person-data-container">
           <div class="assignee-name">${collaborator['name']}</div>
           <div class="assignee-email"><a href="mailto:"${collaborator['email']}">${collaborator['email']}</div>
       </div>
   </div>
`
}


/**
 * returns html code for creating go back button
 * 
 * @param {number} id  - index of task
 * @returns - html code for creating go back button
 */
function addBackButtonHTML(id) {
    return /*html*/ `
    <img src="img/arrow-97-24.png" alt="" title="Last Status" onclick="lastStatus('${id}')">
    `
}


/**
 * returns html code for creating staus title on card details
 * 
 * @param {string} title - th etitle string from task element
 * @returns - html code for creating staus title on card details
 */
function addCurrentStatusTitleHTML(title){
    return /*html*/ `
    <span><b>${title}</b></span>
    `
}


/**
 * returns html code for creating foward button on card details
 * 
 * @param {number} id - index of task
 * @returns - html code for creating foward button on card details
 */
function addForwardButtonHTML(id) {
    return /*html*/ `
    <img src="img/arrow-32-24.png" alt="" title="Next Status" onclick="nextStatus('${id}')">
    `
}


/**
 * returns html code for creating button for close card details
 * 
 * @param {number} id - index of task
 * @returns - html code for creating button for close card details
 */
function addCloseCardDEatilsButtonHTML(id) {
    return /*html*/ `
    <img src="img/close-window-24.png" alt="" title="Go Back" onclick="closeCardDetails('${id}')">
    `
}


/**
 * returns html code for creating delete task button
 * 
 * @param {number} id - index of task
 * @returns - html code for creating delete task button
 */
function addDeleteButtonHTML(id) {
    return /*html*/ `
    <img src="img/trash-2-24.png" alt="" title="Delete Task" onclick="deleteTask('${id}')">
    `
}