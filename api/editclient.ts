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
export async function editclient(data: Object, token: String) {
  var lastname = escapeHtml(decodeURIComponent(data["lastname"]));
  var firstname = escapeHtml(decodeURIComponent(data["firstname"]));
  var zip = parseInt(decodeURIComponent(data["zip"]));
  var city = escapeHtml(decodeURIComponent(data["city"]));
  var address = escapeHtml(decodeURIComponent(data["address"]));
  var tel = parseInt(decodeURIComponent(data["tel"]));
  var idclient = decodeURIComponent(data["idclient"]);

  var private_key = await database_execute.query_select(
    "SELECT * FROM user WHERE token = '" + token + "'",
  );
  private_key = private_key[0]["private_key"];

  var clientinfo = await database_execute.query_select(
    "SELECT * FROM client WHERE user_key = '" + private_key +
      "' AND token = '" + idclient + "'",
  );

  if (clientinfo.length == 1) {
    await database_execute.query_update(
      "UPDATE client SET firstname = '" + (firstname == ""
        ? clientinfo[0]["firstname"]
        : firstname) +
        "', lastname = '" + (lastname == ""
          ? clientinfo[0]["lastname"]
          : lastname) +
        "', address = '" +
        (address == "" ? clientinfo[0]["address"] : address) + "', city = '" +
        (city == "" ? clientinfo[0]["city"] : city) + "', zip = " +
        (Number.isNaN(zip) ? clientinfo[0]["zip"] : zip) +
        ", tel = " + (Number.isNaN(NaN) ? clientinfo[0]["tel"] : tel) +
        " WHERE user_key = '" + private_key + "' AND token = '" + idclient +
        "'",
    );
  }
  test_de_var.body = "ok";

  return test_de_var;
}
