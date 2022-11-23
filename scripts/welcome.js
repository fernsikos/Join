/**
 * array with valid user data
 */
let userData = [
    // {
    //     'username': 'admin',
    //     'password': 'admin'
    // }
];

async function initWelcome() {
    await downloadFromServer();
    // saveUserToBackend();
    loadUsersFromBackend();
}

/**
 * save to Backend
 */
async function saveUserToBackend() {
    let userDataAsText = JSON.stringify(userData);
    await backend.setItem('userData', userDataAsText);
    //    console.log('saved')
}

/**
 * load from Backend
 */
function loadUsersFromBackend() {
    let userDataAsText = backend.getItem('userData');
    if (userDataAsText) {
        userData = JSON.parse(userDataAsText);
    }
}


/**
 * searches for insert login data in userData array
 */
function login() {
    let userNameInUserdata = false;
    let passwordInUserData = false;
    let userNameInput = document.getElementById('user-name').value.toLowerCase();
    let passwordInput = document.getElementById('user-password').value;
    for (let i = 0; i < userData.length; i++) {
        const user = userData[i];
        if (user['username'] === userNameInput) {
            userNameInUserdata = true;
        }
        if (user['password'] === passwordInput) {
            passwordInUserData = true;
        }
    }
    checkIfLoginDataValid(userNameInUserdata, passwordInUserData)
}


/**
 * checks if login data is valid
 * 
 * @param {boolean} userNameInUserdata - a true/false boolean if have found element
 * @param {boolean} passwordInUserData - a true/false boolean if have found element
 */
function checkIfLoginDataValid(userNameInUserdata, passwordInUserData) {
    if (userNameInUserdata && passwordInUserData === true) {
        window.location.replace('./index.html')
    } else {
        document.getElementById('wrong-login-data-container').classList.remove('opacity-zero')
    }
}

/**
 * runs login function on keypress enter
 */
function enter() {
    let input = document.getElementById('user-password');
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            login()
        }
    });
}

/**
 * validate lenght of name and password and creates account
 */
async function createNewAccount() {
    let userNameInput = document.getElementById('new-user-name').value.toLowerCase();
    let passwordInput = document.getElementById('new-user-password').value;

    if(userNameInput.length < 5) {
        document.getElementById('wrong-data-container').innerText = 'please insert a name longer then 4 characters';
    } else if (passwordInput.length < 6) {
        document.getElementById('wrong-data-container').innerText = 'please choose a password longer then 5 characters';
    } else {
        createAccount(userNameInput, passwordInput)
    }
}

async function createAccount(userNameInput, passwordInput) {
    let newAccount = {
        'username': userNameInput,
        'password': passwordInput
    };
    userData.push(newAccount);
    console.log(userData);
    showLoadingAnimation();
    await saveUserToBackend();
    window.location.replace('./index.html')
}

/**
 * toggles between login and signup card
 */
function toggleLogin() {
    document.getElementById('login-card').classList.toggle('d-none');
    document.getElementById('signup-card').classList.toggle('d-none');
    clearInput();
    clearUserData();
}

/**
 * clears user inputs after toggle
 */
function clearInput() {
    document.getElementById('user-name').value = "";
    document.getElementById('user-password').value = "";
    document.getElementById('new-user-name').value = "";
    document.getElementById('new-user-password').value = "";
    document.getElementById('wrong-login-data-container').classList.add('opacity-zero');
    document.getElementById('wrong-data-container').innerText = '';

}

//For developer purpose only

/**
 * clears all user data and leaves admin login
 */
function clearUserData() {
    userData = [
        {
            'username': 'admin',
            'password': 'admin'
        }
    ];
    saveUserToBackend()
}