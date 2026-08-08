/* ------------------ Typing Effect ------------------ */

const text = "Welcome to Digital Blogg";
let i = 0;

function type() {

    if (i < text.length) {

        document.getElementById("typing").innerHTML += text.charAt(i);

        i++;

        setTimeout(type, 80);

    }

}

type();

/* ------------------ Navigation ------------------ */

function goCreate() {

    window.location.href = "create.html";

}