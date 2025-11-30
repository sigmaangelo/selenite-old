// main.ts – PERFECT static hosting for game folders

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.224.0/path/mod.ts";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
};

serve(async (req) => {
  try {
    let urlPath = new URL(req.url).pathname;

    if (urlPath.endsWith("/")) urlPath += "index.html";
    const filePath = join(".", urlPath);

    const file = await Deno.readFile(filePath);
    const ext = extname(filePath);
    const type = MIME_TYPES[ext] || "application/octet-stream";

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
});
