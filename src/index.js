const ALLOWED_HOSTS = new Set([
  "web.whatsapp.com",
  "www.nicovideo.jp",
  // Add domains you own or are authorized to access here.
]);

const HOME = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Portal</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#080b12;color:#f5f7ff;font:16px system-ui,-apple-system,Segoe UI,sans-serif}
header{padding:28px 20px 12px;text-align:center}h1{margin:0;font-size:38px}p{color:#9ca8bc}
main{max-width:900px;margin:30px auto;padding:20px}.box{background:#111827;border:1px solid #263247;border-radius:18px;padding:20px;box-shadow:0 20px 60px #0006}
form{display:flex;gap:10px}input{flex:1;padding:15px;border-radius:12px;border:1px solid #334155;background:#0b1220;color:white;font-size:16px}
button{padding:15px 20px;border:0;border-radius:12px;background:#7c3aed;color:#fff;font-weight:700;cursor:pointer}
button:hover{filter:brightness(1.1)}.hint{font-size:14px}.error{color:#ff8f8f;margin-top:12px}
iframe{width:100%;height:70vh;border:1px solid #263247;border-radius:14px;margin-top:18px;background:white}
code{color:#c4b5fd}
</style>
</head>
<body>
<header><h1>Portal</h1><p>Authorized-site gateway</p></header>
<main>
<div class="box">
<form id="f"><input id="url" placeholder="https://example.com" autocomplete="off"><button>Open</button></form>
<p class="hint">Only domains configured in the Worker allowlist can be opened.</p>
<div id="err" class="error"></div>
<iframe id="view" title="Authorized site viewer" hidden></iframe>
</div>
</main>
<script>
const f=document.querySelector("#f"), input=document.querySelector("#url");
const err=document.querySelector("#err"), view=document.querySelector("#view");
f.addEventListener("submit",e=>{
  e.preventDefault(); err.textContent="";
  let u;
  try{u=new URL(input.value.trim());}catch{err.textContent="Enter a valid HTTPS URL.";return;}
  if(u.protocol!=="https:"){err.textContent="Only HTTPS URLs are allowed.";return;}
  view.hidden=false;
  view.src="/proxy?url="+encodeURIComponent(u.href);
});
</script>
</body></html>`;

function isAllowed(url) {
  return url.protocol === "https:" &&
    (ALLOWED_HOSTS.has(url.hostname) || [...ALLOWED_HOSTS].some(h => url.hostname.endsWith("." + h)));
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HOME, {headers: {"content-type":"text/html;charset=UTF-8"}});
    }

    if (url.pathname !== "/proxy") {
      return new Response("Not found", {status:404});
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {status:405});
    }

    const targetText = url.searchParams.get("url");
    if (!targetText) return new Response("Missing url", {status:400});

    let target;
    try { target = new URL(targetText); }
    catch { return new Response("Invalid URL", {status:400}); }

    if (!isAllowed(target)) {
      return new Response(
        "This domain is not on the authorized allowlist. Edit src/index.js and deploy again.",
        {status:403, headers: {"content-type":"text/plain;charset=UTF-8"}}
      );
    }

    // Manual redirects prevent an allowed site from silently redirecting
    // the Worker to an unapproved hostname.
    const upstream = await fetch(target.toString(), {
      method: request.method,
      redirect: "manual",
      headers: {
        "User-Agent": "Authorized-Portal/1.0"
      }
    });

    const location = upstream.headers.get("Location");
    if (location) {
      const next = new URL(location, target);
      if (!isAllowed(next)) {
        return new Response("Redirect blocked: destination is not allowlisted.", {status:403});
      }
    }

    const headers = new Headers(upstream.headers);
    headers.delete("content-security-policy");
    headers.delete("x-frame-options");

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers
    });
  }
};
