import { serve } from "bun";
import homepage from "./frontend/index.html";
import api from "./backend";

const server = serve({
  routes: {
    "/": homepage,
  },
  async fetch(req) {
    return api.fetch(req);
  },
  development: process.env.NODE_ENV !== "production",
});

console.log(`Listening on ${server.url}`);
