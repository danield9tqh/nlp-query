import { serve } from "bun";
import homepage from "./index.html";
import api from "./routes";

const server = serve({
  routes: {
    "/": homepage,
  },
  async fetch(req) {
    return api.fetch(req);
  },
  development: true,
});

console.log(`Listening on ${server.url}`);


