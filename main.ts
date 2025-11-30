import { serve } from "https://deno.land/std/http/server.ts";
import { serveDir } from "https://deno.land/std/http/file_server.ts";

serve((req) => {
  const url = new URL(req.url);

  // If user requests /game/ → serve /game/index.html
  if (url.pathname.endsWith("/")) {
    return serveDir(req, {
      fsRoot: ".",
      urlRoot: "",
      index: "index.html",
    });
  }

  // Otherwise serve normally
  return serveDir(req, {
    fsRoot: ".",
    urlRoot: "",
  });
});
