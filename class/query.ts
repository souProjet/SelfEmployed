import { Client } from "https://deno.land/x/mysql@v2.10.2/mod.ts";

//On importe les conf
const config = JSON.parse(Deno.readTextFileSync("./class/config.json"));

const client = await new Client().connect({
  hostname: config.hostname,
  username: config.username,
  db: config.db,
  password: config.password,
  poolSize: 14
});

export class sql_query {
  async query_insert(sql: string) {
    let result = await client.execute(`${sql}`);
  }
  async query_update(sql: string) {
    let result = await client.execute(`${sql}`);
  }
  async query_delete(sql: string) {
    let result = await client.execute(`${sql}`);
  }
  async query_select(sql: string) {
    let result = await client.query(`${sql}`);
    return result;
  }
}
