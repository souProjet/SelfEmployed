import { sql_query } from "../query.ts";
const database_execute = new sql_query();

export class devis_func {
  async modif(
    token: string | undefined,
    idclient: string | undefined,
    iddevis: string | undefined,
  ) {
    if (token) {
      var result = await database_execute.query_select(
        "SELECT * FROM user WHERE token = '" + token + "'",
      );
      if (result.length) {
        var temp = Deno.readTextFileSync("./devis.html");
        temp = temp.replace(/<%=title%>/g, "Créer un devis");
        var private_key = result[0]["private_key"];
        
        if (iddevis) {
          var info = await database_execute.query_select(
            "SELECT * FROM devis WHERE user_key = '" + private_key +
              "' AND client_token = '" + idclient + "' AND token = '" +
              iddevis + "'",
          );
          temp = temp.replace(/<%=devistemplate%>/g, info[0]["html"]);
        } else {
          temp = temp.replace(
            /<%=devistemplate%>/g,
            `
        <div class="column quote-generator">
            <span contenteditable="true" class="editable quote-number self-end h2 namedevis"><%=namedevis%></span>
            <div>
                <br class="hidden-button">
                <span contenteditable="true" class="editable bold prevent-line-break" placeholder="Votre nom / société"><%=name%></span><br>
                <span contenteditable="true" class="editable" placeholder="Adresse"><%=address%></span><br>
                <span contenteditable="true" class="editable prevent-line-break" placeholder="Code postal"><%=zip%></span>
                <span contenteditable="true" class="editable prevent-line-break" placeholder="Ville"><%=city%></span>
                <span>
                    <br>
                    <span contenteditable="true" class="editable bold prevent-line-break" placeholder="Information">Siret</span> :
                <span contenteditable="true" class="editable prevent-line-break" placeholder="820 393 293 39294"><%=siret%></span>
                </span>
                <!-- <span>
                    <br>
                    <span contenteditable="true" class="editable bold prevent-line-break" placeholder="Information">N° TVA</span> :
                <span contenteditable="true" class="editable prevent-line-break" placeholder="FR45242563863"></span>
                <button class="fas fa-minus-circle h4"></button>
                </span> -->
                <span>
                    <br>
                    <span contenteditable="true" class="editable bold prevent-line-break" placeholder="Information">Tél</span> :
                <span contenteditable="true" class="editable prevent-line-break" placeholder="0123456789"><%=tel%></span>
                </span>
                <br>
                <!-- <button class="fas fa-plus-circle h4"></button> -->
            </div>


            <div class="right-align">
                <%=buttonselectclient%>
                    <br class="hidden-button">
                    <span contenteditable="true" id="<%=clientid%>" class="editable bold prevent-line-break clientname" placeholder="Nom client"><%=clientname%></span><br>
                    <span contenteditable="true" class="editable clientaddress" placeholder="Adresse"><%=clientaddress%></span><br>
                    <span contenteditable="true" class="editable prevent-line-break clientzip" placeholder="Code postal"><%=clientzip%></span>
                    <span contenteditable="true" class="editable prevent-line-break clientcity" placeholder="Ville"><%=clientcity%></span>
                    <span>
                    <br>
                    <span contenteditable="true" class="editable bold prevent-line-break" placeholder="Information">Tél</span> :
                    <span contenteditable="true" class="editable prevent-line-break clienttel" placeholder="0123456789"><%=clienttel%></span>
                    </span>
                    <br>
                    <!-- <button class="fas fa-plus-circle h4"></button> -->
            </div>

            <div class="relative mb3">
                <table class="quote-table-left-header width-5 medium mb0">
                    <tbody class="extrainfotable">
                        <tr>
                            <td style="background-color: rgb(231, 230, 230); color: black;"><span contenteditable="true" class="editable prevent-line-break" placeholder="En-tête">Date du devis</span></td>
                            <td class="relative">
                                <div class="absolute top-0 full-height flex-center" style="right: -8px;"></div> <span contenteditable="true" class="editable prevent-line-break" placeholder="Contenu"><%=date%></span></td>
                        </tr>
                    </tbody>
                </table>
                <div class="absolute flex-center width-5" style="bottom: -12px;"><button class="extrainfo fas fa-plus-circle h2"></button></div>
            </div>
            <div class="relative mb3 overflow-mobile">
                <table class="center medium mb0">
                    <tbody class="prestatable">
                        <tr>
                            <th style="background-color: rgb(231, 230, 230); color: black;">Description</th>
                            <th style="background-color: rgb(231, 230, 230); color: black;">Quantité</th>
                            <th style="background-color: rgb(231, 230, 230); color: black;">Prix unitaire TTC</th>
                            <th style="background-color: rgb(231, 230, 230); color: black;">Prix total TTC</th>
                        </tr>
                        <!-- <tr>
                            <td class="left-align"><span contenteditable="true" class="editable" placeholder="TITRE PRESTATION"></span><br> <span contenteditable="true" class="editable normal color-text" placeholder="Description prestation"></span></td>
                            <td><span contenteditable="true" class="editable prevent-line-break">1</span></td>
                            <td class="relative"><span contenteditable="true" class="editable prevent-line-break" placeholder="0,00"></span> €
                            </td>

                            <td class="relative">
                                0,00 €
                                <div class="absolute top-0 full-height flex-center" style="right: -8px;"><button class="fas fa-minus-circle h4"></button></div>
                            </td>
                        </tr> -->
                    </tbody>
                </table>
                <div class="absolute flex-center full-width" style="bottom: -12px;"><button class="addprestabutton fas fa-plus-circle h2"></button></div>
            </div>
            <div class="row justify-between items-end"><span contenteditable="true" class="editable col col-5" placeholder="Informations complémentaires (IBAN, BIC...)"></span>
                <table class="quote-table-left-header self-end mb0 col col-6">
                    <tbody>
                        <tr class="bold">
                            <td style="background-color: rgb(231, 230, 230); color: black;">Total TTC</td>
                            <td class="right-align total">0,00 €</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <hr>
            <div class="center h5 color-text mt3"><span contenteditable="true" class="editable" placeholder="Bas de page">En cas de retard, une pénalité au taux annuel de 5 % sera appliquée, à laquelle s’ajoutera une indemnité forfaitaire pour frais de recouvrement de 40 €</span></div>
        </div>
   `,
          );
        }

        function zip(zipcode) {
          zipcode = zipcode.toString();

          var newZip = "";

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

        temp = temp.replace(/<%=name%>/g, result[0]["name"].replace("+", " "));
        temp = temp.replace(
          /<%=address%>/g,
          result[0]["address"].replaceAll("+", " "),
        );
        temp = temp.replace(/<%=zip%>/g, zip(result[0]["zip"]));
        temp = temp.replace(/<%=tel%>/g, tel("0" + result[0]["tel"]));
        temp = temp.replace(/<%=city%>/g, result[0]["city"]);
        temp = temp.replace(/<%=siret%>/g, result[0]["siret"]);

        var date = new Date();

        var dateString = date.getDate() + "/" +
          ((date.getMonth() + 1).toString().length == 1
            ? "0" + (date.getMonth() + 1)
            : (date.getMonth() + 1)) +
          "/" + date.getFullYear();

        temp = temp.replace(/<%=date%>/g, dateString);

        var derndevis = await database_execute.query_select(
          "SELECT * FROM devis WHERE user_key = '" + private_key +
            "' ORDER BY id DESC",
        );
        var newnum = (derndevis.length == 0
          ? 1
          : parseInt(derndevis[0]["id"]) + 1);

        var nameDevis = "Devis N°" + newnum;

        temp = temp.replace(/<%=namedevis%>/g, nameDevis);

        if (idclient) {
          var clientinfo = await database_execute.query_select(
            "SELECT * FROM client WHERE token = '" + idclient + "'",
          );
          temp = temp.replace(/<%=buttonselectclient%>/g, "");
          temp = temp.replace(/<%=clientid%>/g, idclient);
          temp = temp.replace(
            /<%=clientname%>/g,
            clientinfo[0]["firstname"] + " " + clientinfo[0]["lastname"],
          );
          temp = temp.replace(
            /<%=clientaddress%>/g,
            clientinfo[0]["address"].replaceAll("+", " "),
          );
          temp = temp.replace(/<%=clientzip%>/g, zip(result[0]["zip"]));
          temp = temp.replace(/<%=clienttel%>/g, tel("0" + result[0]["tel"]));
          temp = temp.replace(/<%=clientcity%>/g, result[0]["city"]);
          temp = temp.replace(/<%=devistoken%>/g, iddevis ? iddevis : "");
        } else {
          temp = temp.replace(
            /<%=buttonselectclient%>/g,
            `<button class="selectclient btn el-button hidden-button el-button--text" style="color: rgb(112, 166, 216); padding-bottom: 4px;"><span>Séléctionner un client <i class="fas fa-level-down-alt" style="vertical-align: -1px;"></i></span></button>`,
          );
          temp = temp.replace(/<%=clientname%>/g, "");
          temp = temp.replace(/<%=clientaddress%>/g, "");
          temp = temp.replace(/<%=clientzip%>/g, "");
          temp = temp.replace(/<%=clienttel%>/g, "");
          temp = temp.replace(/<%=clientcity%>/g, "");
          temp = temp.replace(/<%=clientid%>/g, "");
          temp = temp.replace(/<%=devistoken%>/g, "");
        }
        if(result[0]["tva"] == 0){
          temp = temp.replaceAll("TTC", "HT");
        }
      } else {
        var temp = Deno.readTextFileSync("./register.html");
        temp = temp.replace(/<%=title%>/g, "Inscription");
      }
    } else {
      var temp = Deno.readTextFileSync("./register.html");
      temp = temp.replace(/<%=title%>/g, "Inscription");
    }
    return temp;
  }
}
