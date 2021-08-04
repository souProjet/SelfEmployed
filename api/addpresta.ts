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
export async function addpresta(data: Object, token: String) {
  var type = escapeHtml(decodeURIComponent(data["type"]));
  var name = escapeHtml(decodeURIComponent(data["name"]));
  var description = escapeHtml(decodeURIComponent(data["description"]));
  var price = decodeURIComponent(data["price"]);

  if (type !== "" && name !== "" && !Number.isNaN(Number.parseFloat(price))) {
    var private_key = await database_execute.query_select(
      "SELECT * FROM user WHERE token = '" + token + "'",
    );
    private_key = private_key[0]["private_key"];
    var token2 = randomString();
    var date = new Date();
    var dateString = date.getDate() + "/" +
      ((date.getMonth() + 1).toString().length == 1
        ? "0" + (date.getMonth() + 1)
        : (date.getMonth() + 1)) +
      "/" + date.getFullYear();
    await database_execute.query_insert(
      "INSERT INTO presta(user_key,token, name,description, price, isproperty, date) VALUES('" +
        private_key + "','" + token2 + "','" + name + "','" + description +
        "', " + price + ", " + (type == "bien" ? 1 : 0) + ", '"+dateString+"')",
    );

    test_de_var.body = "ok";
  }
  return test_de_var;
}
