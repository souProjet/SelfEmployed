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
export async function getcot(data: Object, token: String) {
  var query = escapeHtml(decodeURIComponent(data["query"]));
  var private_key = await database_execute.query_select(
    "SELECT * FROM user WHERE token = '" + token + "'",
  );
  private_key = private_key[0]["private_key"];
  if (query !== "undefined") {
    var numMonth = (query.toString().length == 1
      ? "0" + query.toString()
      : query);
    var presta = await database_execute.query_select(
      "SELECT * FROM presta WHERE user_key = '" + private_key +
        "' AND isproperty = 0 AND date LIKE '%/" +
        numMonth + "/%'",
    );
    var turnover = 0;
    presta.forEach((prestaItem) => {
      turnover = turnover + prestaItem["price"];
    });
    var profit = Math.round((0.22 * turnover) * 100) / 100;

    var bien = await database_execute.query_select(
      "SELECT * FROM presta WHERE user_key = '" + private_key +
        "' AND isproperty = 1 AND date LIKE '%/" +
        numMonth + "/%'",
    );
    var turnover2 = 0;
    bien.forEach((bienItem) => {
      turnover2 = turnover2 + bienItem["price"];
    });
    var profit2 = Math.round((0.128 * turnover2) * 100) /
      100;

    var table = {
      "presta": { 0: turnover, 1: profit },
      "bien": { 0: turnover2, 1: profit2 },
    };
    test_de_var.body = table;
  }
  return test_de_var;
}
