import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // === Proxy endpoint for cloaked games ===
  if (url.pathname === "/proxy") {
    const game = url.searchParams.get("game");
    if (!game) return new Response("Missing game", { status: 400 });

    const targetUrl = `https://heavenlyselenite.deno.dev/${game}/`; // Your selenite-old games
    const res = await fetch(targetUrl);
    if (!res.ok) return new Response("Failed to fetch game", { status: 500 });

    let html = await res.text();

    // Insert <base> so relative paths load correctly
    html = html.replace(/<head>/i, `<head><base href="${targetUrl}">`);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*" // allows fetch from main page
      }
    });
  }

  // === Serve main index.html ===
  if (url.pathname === "/" || url.pathname === "/index.html") {
    try {
      const html = await Deno.readTextFile("./index.html");
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    } catch {
      return new Response("index.html not found", { status: 404 });
    }
  }

  // === Default 404 ===
  return new Response("Not Found", { status: 404 });
});
