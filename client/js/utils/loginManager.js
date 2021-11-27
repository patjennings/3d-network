import * as globals from "../globals";
import appState from "../globals";
let st = new appState();

let resetAfterCaution;

export default function loginManager(){
    const form = document.getElementById("login-form");
    const input = document.getElementById("login-input");

    input.value = "";

    //listener
    form.addEventListener("submit", e => {
    	e.preventDefault;
	st.user = input.value;
	updateLoginInfo();
    })
}

function updateLoginInfo(){
    const login = document.getElementById("login");
    const info = document.getElementById("login-info");

    if(st.user !== null){
	clearTimeout(resetAfterCaution);
	info.innerHTML = "Logged as <strong>"+st.user+"</strong>";
	login.setAttribute("class", "logged");
    } else {
	info.innerHTML = "You are currently anonymous. Please enter a name in order to manipulate content.";
	login.setAttribute("class", "not-logged");
    }
}

export function loginAlert(){
    console.log('you have to login in order to manipulate informations');

    const login = document.getElementById("login");
    const loginClasses = login.getAttribute("class")

    // add caution class
    login.setAttribute("class", loginClasses+" caution");

    // then reset after a few seconds, back to original classes
    resetAfterCaution = setTimeout(function(){
	login.setAttribute("class", loginClasses);
    }, 3500);
}
