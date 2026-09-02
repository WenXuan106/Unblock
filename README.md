# School Portal Proxy — Authorized Use

A small Cloudflare Workers portal that fetches only domains you explicitly allow.

## 1. Install

Install Node.js, then run:

```bash
npm install
```

## 2. Configure the allowlist

Open `src/index.js` and edit:

```js
const ALLOWED_HOSTS = new Set([
  "example.com",
  "www.example.com"
]);
```

Put only domains you own or are authorized to proxy.

## 3. Test locally

```bash
npm run dev
```

Wrangler will give you a local URL.

## 4. Deploy

Log in:

```bash
npx wrangler login
```

Then:

```bash
npm run deploy
```

Cloudflare will give you your `workers.dev` URL.

## Important

This project intentionally uses an allowlist and manual redirect checks. It is not an unrestricted web proxy and is not intended to bypass school, workplace, parental, or network filtering.

Some websites also prevent iframe embedding or depend on client-side features that a simple reverse proxy cannot reproduce.
