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
export async function getclient(data: Object, token: String) {
  var query = escapeHtml(decodeURIComponent(data["query"]));
  var private_key = await database_execute.query_select(
    "SELECT * FROM user WHERE token = '" + token + "'",
  );
  private_key = private_key[0]["private_key"];
  if (query !== "undefined") {
    var client = await database_execute.query_select(
      "SELECT * FROM client WHERE user_key = '" + private_key +
        "' AND firstname LIKE '%" + query + "%' OR lastname LIKE '%" + query +
        "%' OR address LIKE '%" + query + "%' OR city LIKE '%" + query + "%' OR zip LIKE '%" + parseInt(query) +
        "%' OR tel LIKE '%" + parseInt(query) + "%'",
    );
  } else {
    var client = await database_execute.query_select(
      "SELECT * FROM client WHERE user_key = '" + private_key + "'",
    );
  }
  test_de_var.body = client;
  return test_de_var;
}
