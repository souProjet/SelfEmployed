import { sql_query } from "../query.ts";
const database_execute = new sql_query();

export class home_func {
  async modif(token: string | undefined, idclient: string | undefined) {
    if (token) {
      var result = await database_execute.query_select(
        "SELECT * FROM user WHERE token = '" + token + "'",
      );

      if (result.length) {
        var temp = Deno.readTextFileSync("./home.html");
        temp = temp.replace(/<%=title%>/g, "Accueil");

        var name = result[0]["name"];
        var siret = result[0]["siret"];
        var private_key = result[0]["private_key"];

        temp = temp.replace(/<%=name%>/g, name.replace("+", " "));
        temp = temp.replace(/<%=siret%>/g, siret == null ? "" : siret);
        temp = temp.replace(/<%=checked%>/g, result[0]["tva"] ? "checked" : "");
        temp = temp.replace(/<%=havetva%>/g, result[0]["tva"] ? "TTC" : "HC");

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
        var month = new Date();
        var numMonth = (month.getMonth() + 1).toString();
        numMonth = (numMonth.toString().length == 1
          ? "0" + numMonth.toString()
          : numMonth);
        var presta = await database_execute.query_select(
          "SELECT * FROM presta WHERE user_key = '" + private_key +
            "' AND isproperty = 0   AND date LIKE '%/" +
            numMonth + "/%'",
        );
        var turnover = 0;
        presta.forEach((prestaItem) => {
          turnover = turnover + prestaItem["price"];
        });
        var profit = Math.round((0.22 * turnover) * 100) / 100;

        temp = temp.replace(/<%=turnoverpresta%>/g, turnover);
        temp = temp.replace(/<%=cotpresta%>/g, profit);

        var bien = await database_execute.query_select(
          "SELECT * FROM presta WHERE user_key = '" + private_key +
            "' AND isproperty = 1  AND date LIKE '%/" +
            numMonth + "/%'",
        );
        var turnover2 = 0;
        bien.forEach((bienItem) => {
          turnover2 = turnover2 + bienItem["price"];
        });
        var profit2 = Math.round((0.128 * turnover2) * 100) /
          100;

        temp = temp.replace(/<%=turnoverbien%>/g, turnover2);
        temp = temp.replace(/<%=cotbien%>/g, profit2);

        if (idclient) {
          temp = temp.replaceAll(/<%=idclient%>/g, "/" + idclient);
          temp = temp.replace(/<%=devistitle%>/g, "Devis :");
          temp = temp.replace(/<%=facturetitle%>/g, "Facture :");
          temp = temp.replace(
            /<%=secondetable%>/g,
            `<table class="table user-list">
                <thead>
                    <%=header2%>
                </thead>
                <tbody>
                    <%=client2%>
                </tbody>
            </table>`,
          );
          var clientinfo = await database_execute.query_select(
            "SELECT * FROM client WHERE token = '" + idclient + "'",
          );

          temp = temp.replace(
            /<%=titleSection%>/g,
            clientinfo[0]["firstname"] + " " + clientinfo[0]["lastname"] + " :",
          );

          temp = temp.replace(/<%=searchbar%>/g, "");

          temp = temp.replace(
            /<%=header%>/g,
            `
          <tr>
              <th><span>Nom</span></th>
              <th><span>Date</span></th>
              <th><span>Enregistrement</span></th>
              <th>&nbsp;</th>
          </tr>`,
          );
          temp = temp.replace(
            /<%=header2%>/g,
            `
          <tr>
              <th><span>Nom</span></th>
              <th><span>Date</span></th>
              <th>&nbsp;</th>
          </tr>`,
          );

          var devis = "";
          var getdevis = await database_execute.query_select(
            "SELECT * FROM devis WHERE user_key = '" + private_key +
              "' AND client_token = '" + idclient + "'",
          );
          for (var i = 0; i < getdevis.length; i++) {
            devis += `<tr>
                <td>` + getdevis[i]["name"].replaceAll("+", " ") + `</td>
                <td>` + getdevis[i]["date"] + `</td>
                <td>` + (parseInt(getdevis[i]["issave"])
              ? "<p style='color:green;'>téléchargé</p>"
              : "<p style='color:red;'>non téléchargé</p>") +
              `</td>
                <td style="width: 20%;">
                    <a onclick="dlpdf('` + getdevis[i]["token"] +
              `', this)" class="table-link" title="Télécharger ce devis"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-download fa-stack-1x fa-inverse"></i> </span> </a>
                    <a onclick="generatefacture('` + getdevis[i]["token"] +
              `')" class="table-link" title="générer la facture"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-plus fa-stack-1x fa-inverse"></i> </span> </a>
                    <a href="http://localhost:8003/devis/` + idclient + `/` +
              getdevis[i]["token"] +
              `" class="table-link" title="Modifier ce devis"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-pencil fa-stack-1x fa-inverse"></i> </span> </a>
                    <a onclick="deldevis('` + getdevis[i]["token"] +
              `')" class="table-link danger" title="Supprimer ce devis"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i> </span> </a>
                </td>
            </tr>
                `;
          }
          temp = temp.replace(/<%=client%>/g, devis);

          var facture = "";
          var getfacture = await database_execute.query_select(
            "SELECT * FROM facture WHERE user_key = '" + private_key +
              "' AND client_token = '" + idclient + "'",
          );
          for (var i = 0; i < getfacture.length; i++) {
            facture += `<tr>
                <td>` + getfacture[i]["name"].replaceAll("+", " ") + `</td>
                <td>` + getfacture[i]["date"] + `</td>
                
                <td style="width: 20%;">
                    <a onclick="dlpdffacture('` + getfacture[i]["token"] +
              `')" class="table-link" title="Télécharger cette facture"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-download fa-stack-1x fa-inverse"></i> </span> </a>
                    <a onclick="print('` + getfacture[i]["token"] +
              `')" class="table-link" title="Imprimer cette facture"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-print fa-stack-1x fa-inverse"></i> </span> </a>
              <a href="http://localhost:8003/facture/` + idclient + `/` +
              getfacture[i]["token"] +
              `" class="table-link" title="Modifier cette facture"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-pencil fa-stack-1x fa-inverse"></i> </span> </a>       
              <a onclick="delfacture('` + getfacture[i]["token"] +
              `')" class="table-link danger" title="Supprimer cette facture"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i> </span> </a>
              
              </td>
            </tr>
                `;
          }
          temp = temp.replace(/<%=client2%>/g, facture);
        } else {
          var getclient = await database_execute.query_select(
            "SELECT * FROM client WHERE user_key = '" + private_key + "'",
          );
          var client = "";

          temp = temp.replace(/<%=titleSection%>/g, "Vos clients :");
          temp = temp.replace(/<%=secondetable%>/g, "");
          temp = temp.replace(/<%=devistitle%>/g, "");
          temp = temp.replace(/<%=facturetitle%>/g, "");
          temp = temp.replaceAll(/<%=idclient%>/g, "");
          temp = temp.replace(
            /<%=searchbar%>/g,
            `<div id="video-search-header">
            <input type="text" placeholder="Rechercher des clients..." aria-label="Search" class="searchclient">
        </div>`,
          );

          temp = temp.replace(
            /<%=header%>/g,
            `
          <tr>
              <th><span>Prénom</span></th>
              <th><span>Nom</span></th>
              <th><span>Adresse</span></th>
              <th><span>Ville</span></th>
              <th><span>Code postal</span></th>
              <th><span>Téléphone</span></th>
              <th>&nbsp;</th>
          </tr>`,
          );
          for (var i = 0; i < getclient.length; i++) {
            client += `<tr >
                <td onclick='window.location="client/` +
              getclient[i]["token"] + `";' >` + getclient[i]["firstname"] +
              `</td>
                <td onclick='window.location="client/` +
              getclient[i]["token"] + `";'>` + getclient[i]["lastname"] + `</td>
                <td onclick='window.location="client/` +
              getclient[i]["token"] + `";'>` +
              getclient[i]["address"].replaceAll("+", " ") + `</td>
                <td onclick='window.location="client/` +
              getclient[i]["token"] + `";'>` + getclient[i]["city"] + `</td>
                <td onclick='window.location="client/` +
              getclient[i]["token"] + `";'>` + zip(getclient[i]["zip"]) + `</td>
                <td onclick='window.location="client/` +
              getclient[i]["token"] + `";'>` + tel("0" + getclient[i]["tel"]) +
              `</td>
                <td style="width: 20%;">
                    <a onclick="editclient('` + getclient[i]["token"] +
              `', this)" class="table-link" title="Modifier ce client"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-pencil fa-stack-1x fa-inverse"></i> </span> </a>
                    <a onclick="delclient('` + getclient[i]["token"] +
              `')" class="table-link danger" title="Supprimer"> <span class="fa-stack"> <i class="fa fa-square fa-stack-2x"></i> <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i> </span> </a>
                </td>
            </tr>
                `;
          }
          temp = temp.replace(/<%=client%>/g, client);
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
