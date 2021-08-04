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
export async function getpresta(data: Object, token: String) {
  var query = escapeHtml(decodeURIComponent(data["query"]));
  var private_key = await database_execute.query_select(
    "SELECT * FROM user WHERE token = '" + token + "'",
  );
  private_key = private_key[0]["private_key"];
  if (query !== "undefined") {
    var presta = await database_execute.query_select(
      "SELECT * FROM presta WHERE user_key = '" + private_key +
        "' AND name LIKE '%" + query + "%' OR description LIKE '%" + query +
        "%' OR price LIKE '%" + parseFloat(query) + "%' AND isproperty = 0",
    );
  } else {
    var presta = await database_execute.query_select(
      "SELECT * FROM presta WHERE user_key = '" + private_key + "' AND isproperty = 0",
    );
  }
  test_de_var.body = presta;
  return test_de_var;
}
