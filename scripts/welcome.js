/**
 * array with valid user data
 */
let userData = [
    {
        'username': 'admin',
        'password': 'admin'
    }
]


/**
 * searches for insert login data in userData array
 */
function login() {
    let userNameInUserdata = false;
    let passwordInUserData = false;
    let userNameInput = document.getElementById('user-name').value.toLowerCase() ;
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
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            login()
        }
    });
}