import { serve } from "https://deno.land/std@0.88.0/http/server.ts";
import { site_principal } from "./site.ts";
import { api } from "./api/api.ts";

let port = 8003;
const server = serve({ hostname: "0.0.0.0", port: port });
const traitement_site_principal = new site_principal();
const traitement_api = new api();

async function main(req: any) {
  try {
    if (req.method === "GET" || req.method === "POST") {
      var host = req.headers.get("host") || "Null";
        if (req.url.startsWith("/api/")) {
          req.url = req.url.replace('/api', '')
          host = "api.localhost:8003";
        }
      switch (host) {
        case "localhost:8003":
          await traitement_site_principal.traitement(req);
          break;

        case "api.localhost:8003":    
          await traitement_api.traitement(req);
          break;
        default:
          req.respond({ status: 418 });
      }
    } else {
      req.respond({ status: 418 });
    }
  } catch (err) {
    console.log(err);
  }
}

console.log(
  "[DIVERTIX] - Online -  Access at:  http://localhost On port " + port + "",
);

for await (const req of server) main(req);
