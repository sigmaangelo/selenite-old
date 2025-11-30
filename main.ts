import { serve } from "https://deno.land/std/http/server.ts";
import { serveDir } from "https://deno.land/std/http/file_server.ts";

serve((req) => {
  const url = new URL(req.url);

  return serveDir(req, {
    fsRoot: ".",
    urlRoot: "",
    enableCors: true,
    quiet: true,
    // This ensures /game/ loads /game/index.html automatically
    index: "index.html",
  });
});
