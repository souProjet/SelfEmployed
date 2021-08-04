import { sql_query } from "../query.ts";
const database_execute = new sql_query();

export class login_func {
  async modif() {
    var temp = Deno.readTextFileSync("./login.html");
    temp = temp.replace(/<%=title%>/g, "Connexion");

    return temp;
  }
}
