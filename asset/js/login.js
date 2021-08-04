var errorMsg = document.querySelector('.warning');

let tel = '';
let password = '';

function init() {
    for (var i = 0; i < count; i++) {
        var ul = document.querySelector('ul.items'),
            li = document.createElement("li");

        ul.appendChild(li);
    }
    ul.children[0].classList.add('active');
}

function next(target) {
    var enable = document.querySelector('form fieldset.enable'),
        nextEnable = enable.nextElementSibling;

    var input = target.previousElementSibling;
    if (input.name == "tel") {
        tel = parseInt(input.value);
    } else if (input.name == "password") {
        password = input.value;
    }
    if (tel !== '' && password !== '') {
        if (Number.isInteger(tel)) {
            $.post("http://localhost:8003/api/login/", {
                tel: tel,
                password: password
            }, function(data) {
                if (data == "ok") {
                    window.location = "accueil";
                } else {
                    errorMsg.style.opacity = "1";
                    errorMsg.innerText = data;
                    body.classList.add('error');
                }
            });
        } else {
            tel = '';
            enable.classList.remove('enable');
            enable.classList.add('disable');
            document.querySelector('input[name="tel"]').parentNode.classList.remove('disable');
            document.querySelector('input[name="tel"]').parentNode.classList.add('enable');
            errorMsg.style.opacity = "1";
            errorMsg.innerText = "Numéro de téléphone invalide";
            body.classList.add('error');
        }

    } else {
        // Check if input is empty
        if (input.value === '') {
            errorMsg.style.opacity = "1";
            errorMsg.innerText = "Veuillez remplir le champ";
            body.classList.add('error');
        } else {
            body.classList.remove('error');
            errorMsg.style.opacity = "0";

            enable.classList.remove('enable');
            enable.classList.add('disable');
            nextEnable.classList.add('enable');
            nextEnable.querySelector('input').focus();

            // Switch active class on left list
            var active = document.querySelector('ul.items li.active'),
                nextActive = active.nextElementSibling;
            active.classList.remove('active');
            nextActive.classList.add('active');
        }
    }
}

function keyDown(event) {

    var key = event.keyCode,
        target = document.querySelector('fieldset.enable .button');

    if (key == 13 || key == 9) {

        if (target.parentNode.querySelector('input').value.length >= 40) {
            body.classList.add('error');
            errorMsg.style.opacity = "1";
            errorMsg.innerText = "Le contenu de ce champ est trop long";
        } else {
            errorMsg.style.opacity = "0";
            next(target);
        }
    }
}

var body = document.querySelector('body'),
    form = document.querySelector('form'),
    count = form.querySelectorAll('fieldset').length;

window.onload = init;
document.body.onmouseup = function(event) {
    var target = event.target || event.toElement;
    if (target.classList.contains("button")) next(target);
};
document.addEventListener("keydown", keyDown, false);