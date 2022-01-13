import { sql_query } from "../class/query.ts";
import { Response } from "https://deno.land/std@0.89.0/http/server.ts";
const database_execute = new sql_query();
let test_de_var: Response = {};

function escapeHtml(text: any) {
  var map: any = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m: any) {
    return map[m];
  });
}
function randomString(
  length: number = 40,
  chars: string =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
) {
  var result = "";
  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
test_de_var.body = "undefined";
export async function addfacture(data: Object, token: String) {
  var name = escapeHtml(decodeURIComponent(data["name"]));
  var client_token = decodeURIComponent(data["clienttoken"]);
  var html = decodeURIComponent(data["html"]).replace(/([+]{2,})/g, "").replace(
    /(\+{1}?)/g,
    " ",
  );
  var idfacture = decodeURIComponent(data["idfacture"]);
 
  var date = escapeHtml(decodeURIComponent(data["date"]));

  if (name !== "" && client_token !== "" && html !== "" && date !== "") {
    var private_key = await database_execute.query_select(
      "SELECT * FROM user WHERE token = '" + token + "'",
    );
    private_key = private_key[0]["private_key"];
   
    if (idfacture != "undefined") {
      await database_execute.query_update(
        "UPDATE facture SET html = '" + html + "', name = '" + name +
          "' , date = '" + date + "' WHERE user_key = '" + private_key +
          "' AND client_token = '" + client_token + "' AND token = '" +
          idfacture + "'",
      );
    } else {
      var token2 = randomString();
      var dernfacture = await database_execute.query_select(
        "SELECT * FROM facture WHERE user_key = '" + private_key +
          "' ORDER BY id DESC",
      );
      var id = (dernfacture.length == 0 ? 1 : parseInt(dernfacture[0]["id"]) + 1);
      await database_execute.query_insert(
        "INSERT INTO facture(user_key,client_token, token, name, html, date, id) VALUES('" +
          private_key + "','" + client_token + "','" + token2 + "','" + name +
          "','" + html + "', '" + date + "', " + id + ")",
      );
    }
    test_de_var.body = "ok";
  }
  return test_de_var;
}
