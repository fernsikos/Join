/**
 * array for choosed users on create new task card
 */
let choosedUsers = [];


/**
 * initial load function
 */
async function initNewTask() {
    await includeHTML();
    await downloadFromServer();
    loadFromBackend();
    setCurrentDateToInputField();
    showUsersOnAddTask();
}


/**
 * shows the current date
 */
function setCurrentDateToInputField() {
    document.getElementById('input-field-date').value = new Date().toISOString().substring(0, 10);
}


/**
 * creates a new task
 */
async function createNewTask() { // creat task button
    let titles = document.getElementById('input-field-title').value;
    let dueDates = document.getElementById('input-field-date').value;
    let categorys = document.getElementById('input-field-category').value;
    let descriptions = document.getElementById('input-field-description').value;
    let urgencys = document.getElementById('input-field-urgency').value;
    let date = new Date().toDateString();
    if (choosedUsers.length === 0) {
        document.getElementById('add-user-button').classList.toggle('add-user-button')
        console.log(choosedUsers);
    } else {
        pushTaskInArray(titles, dueDates, categorys, descriptions, urgencys, date);
        showLoadingAnimation();
        await saveToBackend();
        window.close();
        window.open("index.html");
    }
}


/**
 * shows loading animation
 */
function showLoadingAnimation() {
    document.getElementById('loading-container').classList.remove('d-none')
}


/**
 * deletes the employees
 */
function clearInputFields() {
    choosedUsers = [];
    showUsersOnAddTask();
    setCurrentDateToInputField();
}


//push in taskToDos Array
/**
 * pushes the content from the input field into an array
 * 
 * @param {string} titles - content from the input field from the function createNewTask
 * @param {string} dueDates - content from the input field from the function createNewTask 
 * @param {string} categorys - content from the input field from the function createNewTask 
 * @param {string} descriptions - content from the input field from the function createNewTask 
 * @param {string} urgencys - content from the input field from the function createNewTask 
 * @param {string} date - content from the input field from the function createNewTask 
 */
function pushTaskInArray(titles, dueDates, categorys, descriptions, urgencys, date) {
    tasksToDos.push({
        'currentStatus': 'todo-list',
        'title': titles,
        'description': descriptions,
        'dueDate': dueDates,
        'category': categorys,
        'urgency': urgencys,
        'createdDate': date,
        'collaborators': choosedUsers,
    });
}


/**
 * opens the large user card in the category AddTask
 */
function openUsersCard() {
    fadeIn();
    let openCard = document.getElementById('card-details-container');

    openCard.innerHTML = openUsersCardHTML();
    showUsers();
}


/**
 * shows the emlpoyees on details card
 */
function showUsers() {
    let showUsers = document.getElementById('card-details-users');

    for (let u = 0; u < employees.length; u++) {
        const employee = employees[u];
        let userAlreadySelected = checkIfUserAlreadySelected(employee);
        if (userAlreadySelected)
            showUsers.innerHTML += showSelectedUsersHTML(u);
        else
            showUsers.innerHTML += showUsersHTML(u);
    }
}


/**
 * checks if user is already selectet
 * 
 * @param {Element} employee - a single employee element
 * @returns - true or false
 */
function checkIfUserAlreadySelected(employee) {
    for (let i = 0; i < choosedUsers.length; i++) {
        const user = choosedUsers[i];
        if (employee['name'] === user['name']) {
            return true
        }
    }
    return false
}


/**
 * removes selected user from choosedUsers
 * 
 * @param {number} u - index of task
 */
function removeUser(u) {
    let UserToSearch = employees[u]['name'];

    for (let i = 0; i < choosedUsers.length; i++) {
        const user = choosedUsers[i];
        if (UserToSearch === user['name']) {
            choosedUsers.splice(i, 1);
            break
        }
    }
    closeCardDetails();
    showUsersOnAddTask();
}


/**
 * In this function, you can pick a single employee and push it into an array
 * 
 * @param {number} u - index of task
 */
function chooseTheUser(u) {
    choosedUsers.push({
        'name': employees[u]['name'],
        'email': employees[u]['email'],
        'img': employees[u]['img']
    })
    closeCardDetails();
    showUsersOnAddTask();
}


/**
 * shows the selected employees
 */
function showUsersOnAddTask() {
    let showUsers = document.getElementById('user-icon');

    showUsers.innerHTML = '';

    for (let i = 0; i < choosedUsers.length; i++) {
        const userImg = choosedUsers[i]['img'];

        showUsers.innerHTML += `<img src="${userImg}">`;
    }
}


// HTML snippets

/**
 * returns html code for creating choose user card
 * 
 * @returns - html code for creating choose user card
 */
function openUsersCardHTML() {
    return /*html*/`
    <div id="card-details" class="card-details-user" onclick="stopPropagation(event)">
        <div class="close-button-container">
            <img onclick="closeCardDetails()" src="img/x-mark-24.png" title="Go Back">
        </div>
        <div id="card-details-users"></div>
    </div>
    `
}


/**
 * returns html code for creating each user on choose user card
 * 
 * @param {number} u - index of task
 * @returns - html code for creating each user on choose user card
 */
function showUsersHTML(u) {
    return /*html*/`
        <div id="user-container${u}" onclick="chooseTheUser(${u})" class="user-container-main">
            <div class="user-container">
                <div class="img-user-container width-responsive"><img id="user-img${u}" class="user-img" src="${employees[u]['img']}"></div>
                <div class="assignee-user-name width-responsive">Name: <span id="user-name${u}">${employees[u]['name']}</span></div>
                <div class="assignee-email width-responsive">E-Mail: <span id="user-email${u}">${employees[u]['email']}</span></div>
            </div>
        </div>
    `
}


/**
 * returns html code for creating each selected user on choose user card
 * 
 * @param {number} u - index of task
 * @returns - returns html code for creating each selected user on choose user card 
 */
function showSelectedUsersHTML(u) {
    return /*html*/`
        <div id="user-container${u}" onclick="removeUser(${u})" class="user-container-main user-inactive">
            <div class="user-container">
                <div class="img-user-container width-responsive"><img id="user-img${u}" class="user-img" src="${employees[u]['img']}"></div>
                <div class="assignee-user-name width-responsive">Name: <span id="user-name${u}">${employees[u]['name']}</span></div>
                <div class="assignee-email width-responsive">E-Mail: <span id="user-email${u}">${employees[u]['email']}</span></div>
            </div>
        </div>
    `
}