/**
 * loads navbar from templates forlder to the website
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "./templates/navbar.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    updateActivePage();
}


/**
 * shows active bar next to the right link on navbar
 */
function updateActivePage() {
    let active = window.location.pathname.split('/').pop();
    let linksActiveBar = document.getElementsByClassName('slected-nav-item');
    let link = document.getElementsByClassName('nav-link');
    
    for (let i = 0; i < linksActiveBar.length; i++) {
        const linkActiveBar = linksActiveBar[i];
        const activeLink = link[i];
        linkActiveBar.classList.remove('active');
        linkActiveBar.ariaCurrent = null;
        let path = activeLink.getAttribute('href'); 
        if (active == path) {
            linkActiveBar.classList.add('active');
            activeLink.ariaCurrent = "page";
        }
    }
}
