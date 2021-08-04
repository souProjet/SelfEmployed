var selectclientbutton = document.querySelector('.selectclient');
var suggestclientblock = document.querySelector('.suggestclient');
var prestalistblock = document.querySelector('.prestalist');
var devis = document.querySelector('.letter');
var addprestabutton = document.querySelector('.addprestabutton');
var extrainfobutton = document.querySelector('.extrainfo');

var savedevis = document.querySelector('.savedevis');
var dlpdf = document.querySelector('.dlpdf');

suggestclientblock.style.opacity = "0";
prestalistblock.style.display = "none";

if (!!selectclientbutton) {
    selectclientbutton.addEventListener('click', function() {
        $.post("http://localhost:8003/api/getclient", {}, function(data) {
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
                document.querySelector('tbody.clientoption').innerHTML = "";
                for (var a = 0; a < data.body.length; a++) {
                    document.querySelector('tbody.clientoption').innerHTML += `
                <tr id="` + data.body[a]["token"] + `" onclick='applyclient(this)'>
                <td>` + data.body[a]["firstname"] + `</td>
                <td>` + data.body[a]["lastname"] + `</td>
                <td>` + data.body[a]["address"].replaceAll("+", " ") + `</td>
                <td>` + data.body[a]["city"] + `</td>
                <td>` + zip(data.body[a]["zip"]) + `</td>
                <td>` + tel("0" + data.body[a]["tel"]) + `</td>
            </tr>
                `;
                }
            }
        });
        suggestclientblock.style.opacity = parseInt(suggestclientblock.style.opacity) ? "0" : "1";
        devis.style.opacity = parseInt(suggestclientblock.style.opacity) ? ".3" : "1";

    });
}

function applyclient(client) {
    document.querySelector('.clientname').innerText = client.querySelectorAll('td')[0].innerText + " " + client.querySelectorAll('td')[1].innerText;
    document.querySelector('.clientaddress').innerText = client.querySelectorAll('td')[2].innerText;
    document.querySelector('.clientzip').innerText = client.querySelectorAll('td')[4].innerText;
    document.querySelector('.clientcity').innerText = client.querySelectorAll('td')[3].innerText;
    document.querySelector('.clienttel').innerText = client.querySelectorAll('td')[5].innerText;
    document.querySelector('.clientname').id = client.id;
    suggestclientblock.style.opacity = "0";
    devis.style.opacity = "1";
}

addprestabutton.addEventListener('click', function() {
    $.post("http://localhost:8003/api/getpresta", {}, function(data) {
        if (data) {
            document.querySelector('tbody.prestaoption').innerHTML = "";
            for (var a = 0; a < data.body.length; a++) {
                document.querySelector('tbody.prestaoption').innerHTML += `
                <tr onclick='applypresta(this)'>
                <td>` + data.body[a]["name"].replaceAll("+", " ") + `</td>
                <td>` + data.body[a]["description"].replaceAll("+", " ") + `</td>
                <td>` + data.body[a]["price"] + "€" + `</td>
            </tr>
                `;
            }
        }
    });
    devis.style.opacity = (prestalistblock.style.display == "none" ? ".2" : "1");
    prestalistblock.style.display = (prestalistblock.style.display == "none" ? "block" : "none");
});

function applypresta(presta) {
    document.querySelector('tbody.prestatable').innerHTML +=
        `<tr>
        <td class="left-align"><span contenteditable="true" class="editable" placeholder="TITRE PRESTATION">` + presta.querySelectorAll('td')[0].innerText + `</span><br> <span contenteditable="true" class="editable normal color-text" placeholder="Description prestation">` + presta.querySelectorAll('td')[1].innerText + `</span></td>
        <td><span contenteditable="true" onkeyup="changequantitypresta(this)" class="editable prevent-line-break">1</span></td>
        <td class="relative"><span contenteditable="true" class="editable prevent-line-break" placeholder="0,00">` + presta.querySelectorAll('td')[2].innerText.replace("€", "") + `</span> €
        </td>

        <td class="relative">
        ` + presta.querySelectorAll('td')[2].innerText + `
            <div onclick="deletepresta(this);" class="absolute top-0 full-height flex-center" style="right: -8px;"><button class="fas fa-minus-circle h4"></button></div>
        </td>
    </tr>`;
    devis.style.opacity = "1";
    prestalistblock.style.display = "none";
    calculatetotal();
}

function deletepresta(presta) {
    document.querySelector('tbody.prestatable').removeChild(presta.parentNode.parentNode);
    calculatetotal();
}

function changequantitypresta(presta) {
    presta.parentNode.parentNode.querySelectorAll('td')[3].innerHTML =
        parseInt(presta.innerText) * parseFloat(presta.parentNode.parentNode.querySelectorAll('td')[2].firstChild.innerText) + ` €<div onclick="deletepresta(this);" class="absolute top-0 full-height flex-center" style="right: -8px;"><button class="fas fa-minus-circle h4"></button></div>`;
    calculatetotal();
}

function calculatetotal() {
    var price = 0.00;
    for (var c = 1; c < document.querySelectorAll('tbody.prestatable tr').length; c++) {
        price = price + parseInt(document.querySelectorAll('tbody.prestatable tr')[c].querySelectorAll('td')[1].firstChild.innerText) * parseFloat(document.querySelectorAll('tbody.prestatable tr')[c].querySelectorAll('td')[2].firstChild.innerText);
    }
    document.querySelector('.total').innerText = price + " €";
}

extrainfobutton.addEventListener('click', function() {
    document.querySelector('.extrainfotable').innerHTML += `<tr>
    <td style="background-color: rgb(231, 230, 230); color: black;"><span contenteditable="true" class="editable prevent-line-break" placeholder="En-tête"></span></td>
    <td class="relative">
        <div class="absolute top-0 full-height flex-center" style="right: -8px;"></div> <span contenteditable="true" class="editable prevent-line-break" placeholder="Contenu"></span>
        <div onclick="delextrainfo(this);" class="absolute top-0 full-height flex-center" style="right: -8px;"><button class="fas fa-minus-circle h4"></button></div>

        </td>
</tr>`;
});

function delextrainfo(extra) {
    document.querySelector('tbody.extrainfotable').removeChild(extra.parentNode.parentNode);
}

function generatedevis(dl) {
    var devishtml = devis.innerHTML;
    if (dl) {
        devishtml = devishtml.replace(`<button class="selectclient btn el-button hidden-button el-button--text" style="color: rgb(112, 166, 216); padding-bottom: 4px;"><span>Séléctionner un client <i class="fas fa-level-down-alt" style="vertical-align: -1px;"></i></span></button>`, '');
        devishtml = devishtml.replace(`<div class="absolute flex-center width-5" style="bottom: -12px;"><button class="extrainfo fas fa-plus-circle h2"></button></div>`, '');
        devishtml = devishtml.replace(`<div class="absolute flex-center full-width" style="bottom: -12px;"><button class="addprestabutton fas fa-plus-circle h2"></button></div>`, '');
        devishtml = devishtml.replaceAll(`<div onclick="delextrainfo(this);" class="absolute top-0 full-height flex-center" style="right: -8px;"><button class="fas fa-minus-circle h4"></button></div>`, '');
        devishtml = devishtml.replaceAll(`<div onclick="deletepresta(this);" class="absolute top-0 full-height flex-center" style="right: -8px;"><button class="fas fa-minus-circle h4"></button></div>`, '');
        devishtml = devishtml.replaceAll('contenteditable="true"', 'contenteditable="false"');
        devishtml = devishtml.replaceAll('editable', '');
    }
    return devishtml;
}

savedevis.addEventListener('click', function() {
    var date = new Date();
    var dateString = date.getDate() + "/" +
        ((date.getMonth() + 1).toString().length == 1 ?
            "0" + (date.getMonth() + 1) :
            (date.getMonth() + 1)) +
        "/" + date.getFullYear();
    $.post("http://localhost:8003/api/adddevis/", {
        clienttoken: document.querySelector('.clientname').id,
        iddevis: document.body.id,
        name: document.querySelector('.namedevis').innerText,
        html: generatedevis(false),
        date: dateString
    }, function(data) {
        if (data == "ok") {
            window.location = "http://localhost:8003/client/" + document.querySelector('.clientname').id;
        }
    });
});

dlpdf.addEventListener('click', function() {
    var opt = {
        margin: 5,
    };

    html2pdf().set(opt).from(generatedevis(true)).save(document.querySelector('.namedevis').innerText + ".pdf");

    $.post("http://localhost:8003/api/issave/", {
        iddevis: document.body.id
    }, function(data) {
        if (data == "ok") {}
    });
});