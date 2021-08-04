var clientpart = document.querySelector('.client');
var dashboard = document.querySelector('.dashboard');
var addclientpart = document.querySelector('.addclientpart');
var addprestapart = document.querySelector('.addprestapart');
var header = document.querySelector('header');

var siret = document.querySelector('.siret');
var addclient = document.querySelector('.addclient');
var addpresta = document.querySelector('.addpresta');
var checkboxtva = document.querySelector('.option-input');
var monthSelectCot = document.querySelector('.form-select2');

var searchclient = document.querySelector('.searchclient');

siret.addEventListener('keyup', function(e) {
    if (this.value.toString().length == 14) {
        $.post("http://localhost:8003/api/addsiret", {
            siret: this.value
        }, function(data) {});
    }
});

addclient.addEventListener('click', function() {
    dashboard.style.filter = clientpart.style.filter = "blur(7px)";
    dashboard.style.opacity = clientpart.style.opacity = ".6";
    addclientpart.style.display = "block";
});
addpresta.addEventListener('click', function() {
    dashboard.style.filter = clientpart.style.filter = "blur(7px)";
    dashboard.style.opacity = clientpart.style.opacity = ".6";
    addprestapart.style.display = "block";
});
if (!!searchclient) {
    searchclient.addEventListener('focus', function() {
        dashboard.style.filter = clientpart.style.filter = "blur(0px)";
        dashboard.style.opacity = clientpart.style.opacity = "1";
        addclientpart.style.display = "none";
        addprestapart.style.display = "none";
    });


    searchclient.addEventListener('keyup', function() {
        $.post("http://localhost:8003/api/getclient", {
            query: this.value
        }, function(data) {
            function zip(zipcode) {
                zipcode = zipcode.toString();

                var newZip = '';

                for (var t = 0; t < 5; t++) {
                    newZip += (t == 2 ? " " + zipcode.charAt(t) : zipcode.charAt(t));
                }
                return newZip;
            }

            function tel(ndt) {
                if (isNaN(ndt * 1)) {
                    return false;
                } else {
                    ndt = ndt.toString();
                }
                var newTel = "";
                var count = 0;
                for (var n = 0; n != ndt.length; n++) {
                    switch (count) {
                        case 0:
                            newTel += ndt.charAt(n);
                            count++;
                            break;
                        case 1:
                            newTel += ndt.charAt(n);
                            count++;
                            break;
                        case 2:
                            newTel += " " + ndt.charAt(n);
                            count = 1;
                            break;
                    }
                }
                return newTel;
            }
            if (data) {
                document.querySelector('tbody').innerHTML = "";
                for (var a = 0; a < data.body.length; a++) {
                    document.querySelector('tbody').innerHTML += `
                    <tr>
                        <td onclick='window.location="client/` + data.body[a]["token"] + `";'>` + data.body[a]["firstname"] + `</td>
                        <td onclick='window.location="client/` + data.body[a]["token"] + `";'>` + data.body[a]["lastname"] + `</td>
                        <td onclick='window.location="client/` + data.body[a]["token"] + `";'>` + data.body[a]["address"].replaceAll("+", " ") + `</td>
                        <td onclick='window.location="client/` + data.body[a]["token"] + `";'>` + data.body[a]["city"] + `</td>
                        <td onclick='window.location="client/` + data.body[a]["token"] + `";'>` + zip(data.body[a]["zip"]) + `</td>
                        <td onclick='window.location="client/` + data.body[a]["token"] + `";'>` + tel("0" + data.body[a]["tel"]) + `</td>
                        <td style="width: 20%;">
                            <a onclick="editclient('` + data.body[a]["token"] + `', this)" class="table-link" title="Modifier ce client"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-pencil fa-stack-1x fa-inverse"></i> </span> </a>
                            <a onclick="delclient('` + data.body[a]["token"] + `')" class="table-link danger" title="Supprimer"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i> </span> </a>
                        </td>
                    </tr>
                    `;
                }
            }
        });
    });
}
var errorMsg = document.querySelector('.warning.clientpart');
var lastname = '';
var firstname = '';
var zip = '';
var city = '';
var address = '';
var tel = '';

function init() {
    for (var i = 0; i < count; i++) {
        var ul = document.querySelector('ul.items.clientpart'),
            li = document.createElement("li");
        li.classList.add('clientpart');

        ul.appendChild(li);
    }
    ul.children[0].classList.add('active');
}

function next(target) {
    var enable = document.querySelector('form fieldset.clientpart.enable'),
        nextEnable = enable.nextElementSibling;

    var input = target.previousElementSibling;
    if (input.name == "lastname") {
        lastname = input.value;
    } else if (input.name == "firstname") {
        firstname = input.value;
    } else if (input.name == "zip") {
        zip = parseInt(input.value);
    } else if (input.name == "city") {
        city = input.value;
    } else if (input.name == "address") {
        address = input.value;
    } else if (input.name == "tel") {
        tel = parseInt(input.value);
    }
    if (lastname !== '' && firstname !== '' && zip !== '' && city !== '' && address !== '' && tel !== '') {
        if (Number.isInteger(zip)) {
            if (Number.isInteger(tel)) {
                $.post("http://localhost:8003/api/addclient/", {
                    lastname: lastname,
                    firstname: firstname,
                    zip: zip,
                    city: city,
                    address: address,
                    tel: tel,
                }, function(data) {
                    if (data == "ok") {
                        dashboard.style.filter = clientpart.style.filter = "blur(0px)";
                        dashboard.style.opacity = clientpart.style.opacity = "1";
                        addclientpart.style.display = "none";
                        window.location.reload();
                    } else {
                        errorMsg.innerText = "Une erreur est survenue, veuillez actualiser la page";
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
            }
        } else {
            zip = '';
            enable.classList.remove('enable');
            enable.classList.add('disable');
            document.querySelector('input[name="zip"]').parentNode.classList.remove('disable');
            document.querySelector('input[name="zip"]').parentNode.classList.add('enable');
            errorMsg.style.opacity = "1";
            errorMsg.innerText = "Code postal invalide";
        }
    } else {
        // Check if input is empty
        if (input.value === '') {
            errorMsg.style.opacity = "1";
            errorMsg.innerText = "Veuillez remplir le champ";
        } else {
            errorMsg.style.opacity = "0";

            enable.classList.remove('enable');
            enable.classList.add('disable');
            nextEnable.classList.add('enable');
            nextEnable.querySelector('input').focus();

            // Switch active class on left list
            var active = document.querySelector('ul.items.clientpart li.clientpart.active'),
                nextActive = active.nextElementSibling;
            active.classList.remove('active');
            nextActive.classList.add('active');
        }
    }
}

function keyDown(event) {

    var key = event.keyCode,
        target = document.querySelector('fieldset.clientpart.enable .button');

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
    form = document.querySelector('form.clientpart'),
    count = form.querySelectorAll('fieldset.clientpart').length;

window.onload = init;
document.body.onmouseup = function(event) {
    var target = event.target || event.toElement;
    if (target.classList.contains("button")) next(target);
};
document.addEventListener("keydown", keyDown, false);




var errorMsg2 = document.querySelector('.warning.prestapart');
var type = '';
var nom = '';
var description = '';
var price = '';

function init2() {
    for (var i = 0; i < count2; i++) {
        var ul = document.querySelector('ul.items.prestapart'),
            li = document.createElement("li");
        li.classList.add('prestapart');

        ul.appendChild(li);
    }
    ul.children[0].classList.add('active');
}

function next2(target) {
    var enable2 = document.querySelector('form fieldset.prestapart.enable'),
        nextEnable2 = enable2.nextElementSibling;

    var input2 = target.previousElementSibling;
    if (input2.name == "type") {
        type = input2.value;
    } else if (input2.name == "name") {
        nom = input2.value;
    } else if (input2.name == "description") {
        description = input2.value;
    } else if (input2.name == "price") {
        price = parseFloat(input2.value);
    }
    if (nom !== '' && price !== '' && type !== 0) {
        if (!Number.isNaN(Number.parseFloat(price))) {

            $.post("http://localhost:8003/api/addpresta/", {
                type: type,
                name: nom,
                description: description,
                price: price
            }, function(data) {
                if (data == "ok") {
                    dashboard.style.filter = clientpart.style.filter = "blur(0px)";
                    dashboard.style.opacity = clientpart.style.opacity = "1";
                    addprestapart.style.display = "none";
                    window.location.reload();

                } else {
                    errorMsg2.innerText = "Une erreur est survenue, veuillez actualiser la page";
                }
            });
        } else {
            price = '';
            enable2.classList.remove('enable');
            enable2.classList.add('disable');
            document.querySelector('input[name="price"]').parentNode.classList.remove('disable');
            document.querySelector('input[name="price"]').parentNode.classList.add('enable');
            errorMsg2.style.opacity = "1";
            errorMsg2.innerText = "Prix invalide";
        }
    } else {
        // Check if input is empty
        if (input2.name !== "description") {
            if (input2.value === '') {
                errorMsg2.style.opacity = "1";
                errorMsg2.innerText = "Veuillez remplir le champ";
            } else {
                errorMsg2.style.opacity = "0";

                enable2.classList.remove('enable');
                enable2.classList.add('disable');
                nextEnable2.classList.add('enable');
                nextEnable2.querySelector('input').focus();

                // Switch active class on left list
                var active2 = document.querySelector('ul.items.prestapart li.prestapart.active'),
                    nextActive2 = active2.nextElementSibling;
                active2.classList.remove('active');
                nextActive2.classList.add('active');
            }
        } else {
            errorMsg2.style.opacity = "0";

            enable2.classList.remove('enable');
            enable2.classList.add('disable');
            nextEnable2.classList.add('enable');
            nextEnable2.querySelector('input').focus();

            // Switch active class on left list
            var active2 = document.querySelector('ul.items.prestapart li.prestapart.active'),
                nextActive2 = active2.nextElementSibling;
            active2.classList.remove('active');
            nextActive2.classList.add('active');
        }
    }
}

function keyDown2(event) {

    var key2 = event.keyCode,
        target2 = document.querySelector('fieldset.prestapart.enable .button');

    if (key2 == 13 || key2 == 9) {

        if (target2.parentNode.querySelector('input').value.length >= 40) {
            body.classList.add('error');
            errorMsg2.style.opacity = "1";
            errorMsg2.innerText = "Le contenu de ce champ est trop long";
        } else {
            errorMsg2.style.opacity = "0";
            next2(target2);
        }
    }
}

var body = document.querySelector('body'),
    form2 = document.querySelector('form.prestapart'),
    count2 = form2.querySelectorAll('fieldset.prestapart').length;

window.onload = init2;
document.body.onmouseup = function(event) {
    var target2 = event.target || event.toElement;
    if (target2.classList.contains("button")) next2(target2);
};
document.addEventListener("keydown", keyDown2, false);

function generatedevis(html) {
    var devishtml = html;
    devishtml = devishtml.replace(`<button class="selectclient btn el-button hidden-button el-button--text" style="color: rgb(112, 166, 216); padding-bottom: 4px;"><span>Séléctionner un client <i class="fas fa-level-down-alt" style="vertical-align: -1px;"></i></span></button>`, '');
    devishtml = devishtml.replace(`<div class="absolute flex-center width-5" style="bottom: -12px;"><button class="extrainfo fas fa-plus-circle h2"></button></div>`, '');
    devishtml = devishtml.replace(`<div class="absolute flex-center full-width" style="bottom: -12px;"><button class="addprestabutton fas fa-plus-circle h2"></button></div>`, '');
    devishtml = devishtml.replaceAll(`<div onclick="delextrainfo(this);" class="absolute top-0 full-height flex-center" style="right: -8px;"><button class="fas fa-minus-circle h4"></button></div>`, '');
    devishtml = devishtml.replaceAll(`<div onclick="deletepresta(this);" class="absolute top-0 full-height flex-center" style="right: -8px;"><button class="fas fa-minus-circle h4"></button></div>`, '');
    devishtml = devishtml.replaceAll('contenteditable="true"', 'contenteditable="false"');
    devishtml = devishtml.replaceAll('editable', '');

    return devishtml;
}

function dlpdf(iddevis, element) {
    var opt = {
        margin: 5,
    };
    $.post("http://localhost:8003/api/getdevis", {
        iddevis: iddevis
    }, function(data) {
        if (data.body.length !== 0) {
            clientpart.style.opacity = "0";
            dashboard.style.opacity = "0";
            var pdftodl = generatedevis('<link rel="stylesheet" href="http://localhost:8003/asset/css/devis.css">' + data.body[0]["html"].trim());
            html2pdf().set(opt).from(pdftodl).save(data.body[0]["name"].replaceAll("+", " ")).then(() => {
                clientpart.style.opacity = "1";
                dashboard.style.opacity = "1";
                element.parentNode.parentNode.querySelectorAll('td')[2].querySelector('p').innerText = "téléchargé";
                element.parentNode.parentNode.querySelectorAll('td')[2].querySelector('p').style.color = "green";
            });
        }
    });

    $.post("http://localhost:8003/api/issave/", {
        iddevis: iddevis
    }, function(data) {
        if (data == "ok") {}
    });
}

function dlpdffacture(idfacture) {
    var opt = {
        margin: 5,
    };
    $.post("http://localhost:8003/api/getfacture", {
        idfacture: idfacture
    }, function(data) {
        if (data.body.length !== 0) {
            clientpart.style.opacity = "0";
            dashboard.style.opacity = "0";
            var pdftodl = generatedevis('<link rel="stylesheet" href="http://localhost:8003/asset/css/devis.css">' + data.body[0]["html"].trim());
            html2pdf().set(opt).from(pdftodl).save(data.body[0]["name"].replaceAll("+", " ")).then(() => {
                clientpart.style.opacity = "1";
                dashboard.style.opacity = "1";
            });
        }
    });

}

function deldevis(iddevis) {
    $.post("http://localhost:8003/api/deldevis/", {
        iddevis: iddevis
    }, function(data) {
        if (data == "ok") {
            window.location.reload();
        }
    });
}

function delfacture(idfacture) {
    $.post("http://localhost:8003/api/delfacture/", {
        idfacture: idfacture
    }, function(data) {
        if (data == "ok") {
            window.location.reload();
        }
    });
}

function delclient(idclient) {
    $.post("http://localhost:8003/api/delclient/", {
        idclient: idclient
    }, function(data) {
        if (data == "ok") {
            window.location.reload();
        }
    });
}

function print(idfacture) {
    var opt = {
        margin: 5,
    };
    $.post("http://localhost:8003/api/getfacture", {
        idfacture: idfacture
    }, function(data) {
        if (data.body.length !== 0) {
            var printContents = generatedevis('<link rel="stylesheet" href="http://localhost:8003/asset/css/devis.css">' + data.body[0]["html"].trim());

            var newWin = window.open('', 'Print-Window');

            newWin.document.open();

            newWin.document.write('<html><head><title>' + data.body[0]["name"].replaceAll("+", " ") + '</title></head><body onload="window.print()">' + printContents + '</body></html>');

            newWin.document.close();

            setTimeout(function() { newWin.close(); }, 10);

        }
    });

}

function generatefacture(iddevis) {
    $.post("http://localhost:8003/api/getdevis", {
        iddevis: iddevis
    }, function(data) {
        if (data.body.length !== 0) {
            var html = generatedevis('<link rel="stylesheet" href="http://localhost:8003/asset/css/devis.css">' + data.body[0]["html"].trim());
            html = html.replace(`Date du devis`, 'Date de facture');
            html = html.replace(`</tbody>`, `
        <tr>
            <td style="background-color: rgb(231, 230, 230); color: black;"><span contenteditable="true" class="editable prevent-line-break" placeholder="En-tête">Date de livraison</span></td>
            <td class="relative">
                <div class="absolute top-0 full-height flex-center" style="right: -8px;"></div> <span contenteditable="true" class="editable prevent-line-break" placeholder="Contenu">` + data.body[0]["date"] + `</span></td>
        </tr>
        <tr>
            <td style="background-color: rgb(231, 230, 230); color: black;"><span contenteditable="true" class="editable prevent-line-break" placeholder="En-tête">Echéance de paiement</span></td>
            <td class="relative">
                <div class="absolute top-0 full-height flex-center" style="right: -8px;"></div> <span contenteditable="true" class="editable prevent-line-break" placeholder="Contenu">` + prompt("donné une échéance de paiement au format jj/mm/aa") + `</span></td>
        </tr></tbody>`)
            html += `<div class="center h5 color-text mt3"><span contenteditable="true" class="editable" placeholder="Bas de page">En cas de retard, une pénalité au taux annuel de 5 % sera appliquée, à laquelle s’ajoutera une indemnité forfaitaire pour frais de recouvrement de 40 €</span></div>`
            html = html.replace(`<span content="false" class=" quote-number self-end h2 namedevis">Devis N°` + data.body[0].id + `</span>`, `<span content="false" class=" quote-number self-end h2 namedevis">Facture N°` + data.body[0].id + `</span>`);

            $.post("http://localhost:8003/api/addfacture/", {
                clienttoken: window.location.href.split("/")[4],
                name: data.body[0]["name"].replaceAll("+", " ").replace("Devis", "Facture"),
                html: html,
                date: data.body[0]["date"]
            }, function(data) {
                if (data == "ok") {
                    window.location.reload();
                }
            });
        }
    });

}

function editclient(idclient, element) {
    element.title = "Terminer";
    element.children[0].children[1].classList.remove('fa-pencil');
    element.children[0].children[1].classList.add('fa-check-square');
    element.removeAttribute('onclick');
    element.setAttribute('onclick', "finisheditclient('" + idclient + "', this)");

    element = element.parentNode.parentNode;

    for (var i = 0; i < element.querySelectorAll('td').length - 1; i++) {
        element.querySelectorAll('td')[i].setAttribute('contenteditable', true);
        element.querySelectorAll('td')[i].removeAttribute('onclick');
        element.querySelectorAll('td')[i].classList.add('editable');
        element.querySelectorAll('td')[i].setAttribute('onkeyup', "editclientkeyup('" + idclient + "', this)");
    }
}

function finisheditclient(idclient, element) {
    element.title = "Modifier ce client";
    element.children[0].children[1].classList.add('fa-pencil');
    element.children[0].children[1].classList.remove('fa-check-square');
    element.removeAttribute('onclick');
    element.setAttribute('onclick', "editclient('" + idclient + "', this)");
    element = element.parentNode.parentNode;

    for (var i = 0; i < element.querySelectorAll('td').length - 1; i++) {
        element.querySelectorAll('td')[i].removeAttribute('contenteditable');
        element.querySelectorAll('td')[i].setAttribute('onclick', "window.location='client/" + idclient + "';");
        element.querySelectorAll('td')[i].classList.remove('editable');
        element.querySelectorAll('td')[i].removeAttribute('onkeyup');
    }
}

function editclientkeyup(idclient, element) {
    let firstname = '';
    let lastname = '';
    let address = '';
    let city = '';
    let zip = '';
    let tel = '';
    for (var n = 0; n < element.parentNode.querySelectorAll('td').length; n++) {
        if (element == element.parentNode.querySelectorAll('td')[n]) {
            switch (n) {
                case 0:
                    firstname = element.innerText;
                    break;
                case 1:
                    lastname = element.innerText;
                    break;
                case 2:
                    address = element.innerText;
                    break;
                case 3:
                    city = element.innerText;
                    break;
                case 4:
                    zip = element.innerText;
                    break;
                case 5:
                    tel = element.innerText;
                    break;
            }
        }
    }
    $.post("http://localhost:8003/api/editclient/", {
        firstname: firstname,
        lastname: lastname,
        address: address,
        city: city,
        zip: zip,
        tel: tel,
        idclient: idclient
    }, function(data) {
        if (data == "ok") {}
    });
}
checkboxtva.addEventListener('change', function() {
    $.post("http://localhost:8003/api/tvastate/", {});
});

var month = new Date();
month = month.getMonth() + 1;
document.querySelector('option[value="' + month + '"').setAttribute("selected", "selected");

monthSelectCot.addEventListener('change', function(e) {
    $.post("http://localhost:8003/api/getcot", {
        query: e.target.value
    }, function(data) {
        document.querySelector('.turnoverpresta').innerText = data.body["presta"][0] + "€";
        document.querySelector('.turnoverbien').innerText = data.body["bien"][0] + "€";
        document.querySelector('.cotpresta').innerText = data.body["presta"][1] + "€";
        document.querySelector('.cotbien').innerText = data.body["bien"][1] + "€";
    });
});