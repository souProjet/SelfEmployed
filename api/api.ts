import { register } from "./register.ts";
import { login } from "./login.ts";
import { siret } from "./addsiret.ts";
import { addclient } from "./addclient.ts";
import { getclient } from "./getclient.ts";
import { addpresta } from "./addpresta.ts";
import { getpresta } from "./getpresta.ts";
import { getdevis } from "./getdevis.ts";
import { getfacture } from "./getfacture.ts";
import { adddevis } from "./adddevis.ts";
import { addfacture } from "./addfacture.ts";
import { issave } from "./issave.ts";
import { deldevis } from "./deldevis.ts";
import { delfacture } from "./delfacture.ts";
import { delclient } from "./delclient.ts";
import { editclient } from "./editclient.ts";
import { tvastate } from "./tvastate.ts";
import { getcot } from "./getcot.ts";

import { getCookies } from "https://deno.land/std@0.104.0/http/cookie.ts";

export class api {
  async traitement(req: any) {
    const cookies = getCookies(req);
    if (req.url.startsWith("/register")) {
      await this.register_func(req);
    }else if (req.url.startsWith("/login")) {
      await this.login_func(req);
    } else if (req.url.startsWith("/addsiret")) {
      await this.siret_func(req, cookies.token);
    } else if (req.url.startsWith("/addclient")) {
      await this.addclient_func(req, cookies.token);
    } else if (req.url.startsWith("/getclient")) {
      await this.getclient_func(req, cookies.token);
    } else if (req.url.startsWith("/addpresta")) {
      await this.addpresta_func(req, cookies.token);
    }else if (req.url.startsWith("/getpresta")) {
      await this.getpresta_func(req, cookies.token);
    }else if (req.url.startsWith("/adddevis")){
      await this.adddevis_func(req, cookies.token);
    }else if (req.url.startsWith("/addfacture")){
      await this.addfacture_func(req, cookies.token);
    }else if(req.url.startsWith("/issave")){
      await this.issave_func(req, cookies.token);
    }else if(req.url.startsWith("/getdevis")){
      await this.getdevis_func(req, cookies.token);
    }else if(req.url.startsWith("/getfacture")){
      await this.getfacture_func(req, cookies.token);
    }else if(req.url.startsWith("/deldevis")){
      await this.deldevis_func(req, cookies.token);
    }else if(req.url.startsWith("/delfacture")){
      await this.delfacture_func(req, cookies.token);
    }else if(req.url.startsWith("/delclient")){
      await this.delclient_func(req, cookies.token);
    }else if(req.url.startsWith("/editclient")){
      await this.editclient_func(req, cookies.token);
    }else if(req.url.startsWith("/tvastate")){
      await this.tvastate_func(req, cookies.token);
    }else if(req.url.startsWith("/getcot")){
      await this.getcot_func(req, cookies.token);
    }
  }
  private async register_func(req: any) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await register(data);

    req.respond(return_data);
  }
  private async login_func(req: any) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await login(data);

    req.respond(return_data);
  }
  private async siret_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await siret(data, token);

    req.respond(return_data);
  }
  public async addclient_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await addclient(data, token);

    req.respond(return_data);
  }
  public async addpresta_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await addpresta(data, token);

    req.respond(return_data);
  }
  public async adddevis_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await adddevis(data, token);

    req.respond(return_data);
  }
  public async addfacture_func(req: any, token: String) {
    var data: any = {};
    let body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));
    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await addfacture(data, token);

    req.respond(return_data);
  }
  public async issave_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await issave(data, token);

    req.respond(return_data);
  }
  public async deldevis_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await deldevis(data, token);

    req.respond(return_data);
  }
  public async delfacture_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await delfacture(data, token);

    req.respond(return_data);
  }
  public async delclient_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await delclient(data, token);

    req.respond(return_data);
  }
  public async editclient_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await editclient(data, token);

    req.respond(return_data);
  }
  public async tvastate_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });
    var return_data = await tvastate(data, token);

    req.respond(return_data);
  }
  public async getclient_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });

    var return_data = await getclient(data, token);
    var json = JSON.stringify(return_data);
    var head = new Headers();
    head.set("Access-Control-Allow-Origin", "*");
    head.set("content-type", "application/json; charset=UTF-8");

    req.respond({ headers: head, status: 200, body: json });
  }

  public async getpresta_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });

    var return_data = await getpresta(data, token);
    var json = JSON.stringify(return_data);
    var head = new Headers();
    head.set("Access-Control-Allow-Origin", "*");
    head.set("content-type", "application/json; charset=UTF-8");

    req.respond({ headers: head, status: 200, body: json });
  }
  public async getdevis_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });

    var return_data = await getdevis(data, token);
    var json = JSON.stringify(return_data);
    var head = new Headers();
    head.set("Access-Control-Allow-Origin", "*");
    head.set("content-type", "application/json; charset=UTF-8");

    req.respond({ headers: head, status: 200, body: json });
  }
  public async getfacture_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });

    var return_data = await getfacture(data, token);
    var json = JSON.stringify(return_data);
    var head = new Headers();
    head.set("Access-Control-Allow-Origin", "*");
    head.set("content-type", "application/json; charset=UTF-8");

    req.respond({ headers: head, status: 200, body: json });
  }
  public async getcot_func(req: any, token: String) {
    var data: any = [];
    const body = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));

    body.split("&").forEach((arg) => {
      data[arg.split("=")[0]] = arg.split("=")[1];
    });

    var return_data = await getcot(data, token);
    var json = JSON.stringify(return_data);
    var head = new Headers();
    head.set("Access-Control-Allow-Origin", "*");
    head.set("content-type", "application/json; charset=UTF-8");

    req.respond({ headers: head, status: 200, body: json });
  }
}
