import { sql_query } from "../class/query.ts";
import { Response } from "https://deno.land/std@0.89.0/http/server.ts";
import { sha512 } from "https://denopkg.com/chiefbiiko/sha512/mod.ts";
import { Cookie, setCookie } from "https://deno.land/std@0.89.0/http/cookie.ts";
const database_execute = new sql_query();
let test_de_var: Response = {};

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
export async function register(data: Object) {
  var name = escapeHtml(decodeURIComponent(data["name"]));
  var zip = parseInt(decodeURIComponent(data["zip"]));
  var city = escapeHtml(decodeURIComponent(data["city"]));
  var address = escapeHtml(decodeURIComponent(data["address"]));
  var tel = parseInt(decodeURIComponent(data["tel"]));
  var password = sha512(decodeURIComponent(data["password"]), "utf8", "hex");
  var repassword = sha512(
    decodeURIComponent(data["repassword"]),
    "utf8",
    "hex",
  );
  if (
    name !== "" && Number.isInteger(zip) && city !== "" && address !== "" &&
    Number.isInteger(tel) && password !== "" && repassword !== ""
  ) {
    if (password == repassword) {
      var token: String = randomString();
      var private_key: String = randomString();
      await database_execute.query_insert(
        "INSERT INTO user(name, password, token, private_key, zip, address, city, tel) VALUES('" +
          name + "','" + password + "','" + token + "','" + private_key +
          "', " + zip + ", '" + address + "', '" + city + "', " + tel + ")",
      );
      test_de_var.body = "ok";
      const cookie: Cookie = { name: "token", value: token, path: "/" };
      setCookie(test_de_var, cookie);
    }
  }
  return test_de_var;
}
