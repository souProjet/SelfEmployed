import { home_func } from "./class/modif/home.ts";
import { login_func } from "./class/modif/login.ts";
import { devis_func } from "./class/modif/devis.ts";
import { facture_func } from "./class/modif/facture.ts";

import { getCookies } from "https://deno.land/std/http/cookie.ts";
var statique = ["asset"];

const home = new home_func();
const login = new login_func();
const devis = new devis_func();
const facture = new facture_func();

export class site_principal {
  async traitement(req: any) {
    const cookies = getCookies(req);
    var array_url = req.url.split("/");
    var array_url = array_url.slice(1, array_url.length);
    if (statique.indexOf(array_url[0]) > -1) {
      var host = req.headers.get("host") || "Null";
      var the_data, the_status;

      try {
        the_data = Deno.readFileSync("." + req.url);
        the_status = 200;
      } catch (err) {
        the_status = 404;
      }

      req.respond({ status: the_status, body: the_data });
    } else {
      var the_data2: string, the_status;
      if (req.url == "/") req.url = "/accueil";
      if (req.url == "/accueil") {
        the_data2 = await home.modif(cookies.token);
      } else if (req.url.startsWith("/client/")) {
        var idclient = req.url.split("/")[2];
        var the_data2 = await home.modif(cookies.token, idclient);
      } else if (req.url.startsWith("/devis")) {
        var idclient = req.url.split("/")[2];
        var iddevis = req.url.split("/")[3];
        var the_data2 = await devis.modif(cookies.token, idclient, iddevis);
      }else if (req.url.startsWith("/facture")) {
        var idclient = req.url.split("/")[2];
        var idfacture = req.url.split("/")[3];
        var the_data2 = await facture.modif(cookies.token, idclient, idfacture);
      }else if (req.url == "/login") {
        the_data2 = await login.modif();
      }else {
        var error404 = Deno.readFileSync("404.html");
        the_data2 = error404;
      }

      var head = new Headers();
      head.set("Access-Control-Allow-Origin", "*");

      req.respond({ headers: head, status: the_status, body: the_data2 });
    }
  }
}
