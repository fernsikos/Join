let currentDraggedElement; // used for drag and drop
let currentMouseoverId;    // ---------^^-----------


/**
 * initial load function
 */
async function initBoard() {
    await includeHTML();
    await downloadFromServer();
    loadFromBackend();
    loadTasksToBoard();
}


/**
 * load tasks to board
 */
function loadTasksToBoard() {
    emptyBoardLists();
    for (let i = 0; i < tasksToDos.length; i++) {
        const task = tasksToDos[i];
        let container = document.getElementById(task['currentStatus']);
        let collaborators = task['collaborators'];
        container.innerHTML += createToDoTaskCardHTML(task, i);
        insertTodoCollaboratorsToCard(collaborators, i);
    }
    filterUrgentBorder();
}


/**
 * iterates through tasks in preparation for filtering
 */
function filterUrgentBorder() {
    for (let i = 0; i < tasksToDos.length; i++) {
        let container = document.getElementById(i);
        createUrgentBoarder(i, container);
    }
}


/**
 * insert collaborators to board cards
 * 
 * @param {array} collaborators - array with all collaborators from this task
 * @param {number} i - index of task
 */
function insertTodoCollaboratorsToCard(collaborators, i) {
    for (let y = 0; y < collaborators.length; y++) {
        const collaborator = collaborators[y];
        document.getElementById('taskCollaborators' + i).innerHTML += /*html*/ `
                <img src="${collaborator['img']}" alt="">`
    }
}


/**
 * empty board in preparation for loading new cards
 */
function emptyBoardLists() {
    for (let i = 0; i < boardListIds.length; i++) {
        const id = boardListIds[i];
        document.getElementById(id).innerHTML = '';
    }
}


// drag and drop functions

/**
 * starts dragging
 * 
 * @param {number} i - index of task
 */
function startDragging(i) {
    currentDraggedElement = i;
}


/**
 * catches id from element under mouse hover 
 * 
 * @param {number} obj - index id from element
 */
function getId(obj) {
    currentMouseoverId = obj.id;
}


/**
 * allows to drop elements
 * 
 * @param {Event} ev - event
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * changes the status from dragged element to the status from the list where it has droped
 */
function moveTo() {
    tasksToDos[currentDraggedElement]['currentStatus'] = currentMouseoverId;
    saveToBackend();
    loadFromBackend();
    setTimeout(loadTasksToBoard, 0);
}

// HTML snippets

/**
 * returns html code for creating task cards on board
 * 
 * @param {element} task - single task element
 * @param {number} i - index of task
 * @returns - html code for creating task cards on board
 */
function createToDoTaskCardHTML(task, i) {
    return /*html*/ `
    <div class="task-card" onclick="openCardDetails(${i})" ondragstart="startDragging(${i})" draggable="true" id="${i}">
       <div class="task-card-headline">${task['title']}</div>
       <span><b>Due Date:</b> ${task['dueDate']}</span>
       <span><b>Collaborators:</b></span>
       <div class="collaborators-container" id="taskCollaborators${i}">
       </div>
   </div>
   `
}