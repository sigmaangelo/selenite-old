
let backupIcon = null;
let backupTitle = document.title;

function getCookie(name) {
  const cookies = decodeURIComponent(document.cookie).split(";");
  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(name + "=")) return c.slice(name.length + 1);
  }
  return "";
}
function setFavicon(href) {
  document.querySelectorAll("link[rel*='icon']").forEach(l => l.remove());
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = href;
  document.head.appendChild(link);
}

function setCloak(title, icon) {
  const savedIcon = getCookie("tabicon");
  const savedTitle = getCookie("tabname");

  if (!backupIcon) {
    backupIcon = document.querySelector("link[rel*='icon']");
  }

  if (icon || savedIcon) {
    setFavicon(icon || savedIcon);
  }

  if (title || savedTitle) {
    document.title = title || savedTitle;
  }

  initPanic();
}

/* =========================
   DEBUG MODE
========================= */

if (getCookie("debugging") === "1") {
  const s = document.createElement("script");
  s.src = "/js/debug.js";
  document.head.appendChild(s);
}

/* =========================
   PANIC MODE
========================= */

let panicUrl = "https://google.com";

function initPanic() {
  const saved = getCookie("panicurl");
  if (saved) panicUrl = saved;
}

let keyBuffer = "";

document.addEventListener("keydown", e => {
  keyBuffer += e.key.toLowerCase();
  if (keyBuffer.length > 20) keyBuffer = keyBuffer.slice(-20);

  if (keyBuffer.includes("safemode")) {
    location.href = panicUrl;
    keyBuffer = "";
  }

  if (keyBuffer.includes("debugplz")) {
    const on = getCookie("debugging") === "1";
    document.cookie = `debugging=${on ? 0 : 1}; path=/`;
    alert(`debugging ${on ? "off" : "on"}!`);
    keyBuffer = "";
  }
});

/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {
  setCloak();

  // analytics (unchanged)
  const gtag = document.createElement("script");
  gtag.async = true;
  gtag.src = "https://www.googletagmanager.com/gtag/js?id=G-XVTVBR1D5V";

  const inline = document.createElement("script");
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-98DP5VKS42');
  `;

  document.head.append(gtag, inline);
});

/* =========================
   TAB DISGUISE ON BLUR
========================= */

document.addEventListener("visibilitychange", () => {
  if (localStorage.getItem("selenite.tabDisguise") !== "true") return;

  if (document.visibilityState === "hidden") {
    setCloak("Google", "https://www.google.com/favicon.ico");
  } else {
    if (backupIcon) document.head.appendChild(backupIcon);
    document.title = backupTitle;
  }
});

/* =========================
   ENCODER
========================= */

const enc = {
  encode(str) {
    if (!str) return str;
    return btoa(
      encodeURIComponent(
        [...str].map((c, i) =>
          i % 3 ? String.fromCharCode(c.charCodeAt(0) + i) : c
        ).join("")
      )
    );
  },

  decode(str) {
    if (!str) return str;
    const [base, ...rest] = str.split("?");
    const decoded = decodeURIComponent(atob(base));
    return decoded
      .split("")
      .map((c, i) =>
        i % 3 ? String.fromCharCode(c.charCodeAt(0) - i) : c
      )
      .join("") + (rest.length ? "?" + rest.join("?") : "");
  }
};

/* =========================
   PASSWORD GATE
========================= */

if (location.hash && !location.pathname.includes("gba")) {
  localStorage.setItem("selenite.password", location.hash.slice(1));

  let att = JSON.parse(localStorage.getItem("selenite.passwordAtt") || "null");

  const expired = !att || Date.now() / 1000 - att[1] > 600;

  if (!att || !att[0] || expired) {
    const pass = prompt("Type the right password:");
    if (pass === enc.decode(location.hash.slice(1)) || pass === "tempgbafix") {
      localStorage.setItem(
        "selenite.passwordAtt",
        JSON.stringify([true, Math.floor(Date.now() / 1000)])
      );
    } else {
      localStorage.setItem(
        "selenite.passwordAtt",
        JSON.stringify([false, Math.floor(Date.now() / 1000)])
      );
      location.href = "https://google.com";
    }
  }
}
