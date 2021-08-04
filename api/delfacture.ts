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
test_de_var.body = "undefined";
export async function delfacture(data: Object, token: String) {
  var idfacture = decodeURIComponent(data["idfacture"]);

  if (idfacture !== "") {
    var private_key = await database_execute.query_select(
      "SELECT * FROM user WHERE token = '" + token + "'",
    );
    private_key = private_key[0]["private_key"];
    await database_execute.query_update(
      "DELETE FROM facture WHERE user_key = '" + private_key + "' AND token = '" +
      idfacture + "'",
    );
    test_de_var.body = "ok";
  }
  return test_de_var;
}
