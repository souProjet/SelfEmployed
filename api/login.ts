import { sql_query } from "../class/query.ts";
import { Response } from "https://deno.land/std@0.89.0/http/server.ts";
import { sha512 } from "https://denopkg.com/chiefbiiko/sha512/mod.ts";
import { Cookie, setCookie } from "https://deno.land/std@0.89.0/http/cookie.ts";
const database_execute = new sql_query();
let test_de_var: Response = {};

test_de_var.body = "undefined";
export async function login(data: Object) {
  
  var tel = parseInt(decodeURIComponent(data["tel"]));
  var password = sha512(decodeURIComponent(data["password"]), "utf8", "hex");

  if (Number.isInteger(tel) && password !== "") {
    var user_exist = await database_execute.query_select(
      "SELECT * FROM user WHERE tel = '" + tel + "' AND password = '" +
        password + "'",
    );
    if (user_exist.length == 1) {
      test_de_var.body = "ok";
      const cookie: Cookie = {
        name: "token",
        value: user_exist[0]["token"],
        path: "/",
      };
      setCookie(test_de_var, cookie);
    } else {
      test_de_var.body = "Identifiants incorrects";
    }
  }
  return test_de_var;
}
