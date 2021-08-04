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
export async function addclient(data: Object, token: String) {
  var lastname = escapeHtml(decodeURIComponent(data["lastname"]));
  var firstname = escapeHtml(decodeURIComponent(data["firstname"]));
  var zip = parseInt(decodeURIComponent(data["zip"]));
  var city = escapeHtml(decodeURIComponent(data["city"]));
  var address = escapeHtml(decodeURIComponent(data["address"]));
  var tel = parseInt(decodeURIComponent(data["tel"]));
  if (
    lastname !== "" && firstname !== "" && Number.isInteger(zip) &&
    city !== "" && address !== "" && Number.isInteger(tel)
  ) {
    var private_key = await database_execute.query_select(
      "SELECT * FROM user WHERE token = '" + token + "'",
    );
    private_key = private_key[0]["private_key"];
    var token2 = randomString();
    await database_execute.query_insert(
      "INSERT INTO client(user_key,token, firstname,lastname, address, city, zip, tel) VALUES('" +
        private_key + "','" + token2 + "','" +
        firstname + "','" + lastname + "', '" + address + "', '" + city +
        "', " + zip + ", " + tel + ")",
    );
    test_de_var.body = "ok";
  }
  return test_de_var;
}
