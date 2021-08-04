import { sql_query } from "../class/query.ts";
import { Response } from "https://deno.land/std@0.89.0/http/server.ts";
const database_execute = new sql_query();
let test_de_var: Response = {};

test_de_var.body = "undefined";
export async function tvastate(data: Object, token: String) {
  var user = await database_execute.query_select(
    "SELECT * FROM user WHERE token = '" + token + "'",
  );
  await database_execute.query_update(
    "UPDATE user SET tva = " + (user[0]["tva"] ? 0 : 1) + " WHERE token = '"+token+"'",
  );
  test_de_var.body = "ok";
  return test_de_var;
}
