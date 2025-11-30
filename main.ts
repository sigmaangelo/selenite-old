import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { contentType } from "https://deno.land/std@0.203.0/media_types/mod.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Serve index.html for root
  if (pathname === "/" || pathname === "/index.html") {
    try {
      const html = await Deno.readTextFile("./index.html");
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    } catch {
      return new Response("index.html not found", { status: 404 });
    }
  }

  // Serve static files and game folders
  try {
    // Prevent directory traversal
    const safePath = "." + decodeURIComponent(pathname).replace(/\.\./g, "");
    const fileInfo = await Deno.stat(safePath);

    if (fileInfo.isDirectory) {
      // If it's a folder (like a game), serve its index.html
      const indexPath = safePath + "/index.html";
      const indexHtml = await Deno.readTextFile(indexPath);
      return new Response(indexHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    } else {
      // Serve file with correct content type
      const data = await Deno.readFile(safePath);
      const mimeType = contentType(safePath) || "application/octet-stream";
      return new Response(data, { headers: { "Content-Type": mimeType } });
    }
  } catch {
    return new Response("Not Found", { status: 404 });
  }
});
