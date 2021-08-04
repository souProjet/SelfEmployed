import { sql_query } from "../class/query.ts";
import { Response } from "https://deno.land/std@0.89.0/http/server.ts";
import { Cookie, setCookie } from "https://deno.land/std@0.89.0/http/cookie.ts";
const database_execute = new sql_query();
let test_de_var: Response = {};
test_de_var.body = "undefined";
export async function siret(data: Object, token:String) {
    
  var siret = decodeURIComponent(data["siret"]);
  if (siret !== "") {
    await database_execute.query_insert("UPDATE user SET siret = "+siret+" WHERE token = '"+token+"'");
    test_de_var.body = "ok";
  }
  return test_de_var;
}
