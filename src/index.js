const HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#202124">
<title>Wen Browser</title>

<style>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  background: #202124;
  color: #e8eaed;
}

body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 8px 10px;
  background: #202124;
  border-bottom: 1px solid #3c4043;
}

.toolbar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-button {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #e8eaed;
  font-size: 25px;
  cursor: pointer;
}

.nav-button:active {
  background: #3c4043;
}

.nav-button:disabled {
  opacity: 0.3;
}

.address-wrapper {
  flex: 1;
  min-width: 0;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 7px 0 15px;
  background: #303134;
  border: 1px solid #5f6368;
  border-radius: 24px;
}

.lock {
  margin-right: 8px;
  color: #9aa0a6;
  font-size: 14px;
}

.address {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #e8eaed;
  font-size: 16px;
}

.address::placeholder {
  color: #9aa0a6;
}

.go-button {
  height: 34px;
  padding: 0 15px;
  border: none;
  border-radius: 18px;
  background: #8ab4f8;
  color: #202124;
  font-weight: bold;
  cursor: pointer;
}

.browser {
  position: relative;
  flex: 1;
  min-height: 0;
  background: white;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.home {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  background: #202124;
}

.home-card {
  width: min(700px, 100%);
  text-align: center;
}

.logo {
  margin-bottom: 25px;
  font-size: clamp(38px, 8vw, 64px);
  font-weight: 700;
  letter-spacing: -3px;
}

.home-search {
  width: 100%;
  height: 52px;
  padding: 0 20px;
  border: 1px solid #5f6368;
  border-radius: 27px;
  outline: none;
  background: #303134;
  color: #e8eaed;
  font-size: 16px;
}

.home-search:focus {
  border-color: #8ab4f8;
}

.shortcuts {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.shortcut {
  padding: 9px 16px;
  border: 1px solid #5f6368;
  border-radius: 20px;
  background: #303134;
  color: #e8eaed;
  cursor: pointer;
}

.shortcut:active {
  background: #3c4043;
}

.description {
  margin-top: 25px;
  color: #9aa0a6;
  font-size: 13px;
  line-height: 1.5;
}

.status {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: none;
  padding: 10px 15px;
  border: 1px solid #5f6368;
  border-radius: 12px;
  background: #303134;
  color: #e8eaed;
  font-size: 13px;
  z-index: 10;
}

@media (max-width: 700px) {
  .topbar {
    padding: 6px;
  }

  .toolbar {
    gap: 3px;
  }

  .nav-button {
    width: 38px;
    min-width: 38px;
    height: 40px;
  }

  .address-wrapper {
    height: 42px;
  }

  .lock {
    display: none;
  }

  .go-button {
    padding: 0 11px;
  }

  input {
    font-size: 16px !important;
  }
}
</style>
</head>

<body>

<div class="app">

<header class="topbar">
  <div class="toolbar">

    <button class="nav-button" id="backButton" disabled>‹</button>
    <button class="nav-button" id="forwardButton" disabled>›</button>
    <button class="nav-button" id="reloadButton">↻</button>

    <div class="address-wrapper">
      <span class="lock">🔒</span>

      <input
        id="addressBar"
        class="address"
        type="text"
        inputmode="url"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
        spellcheck="false"
        placeholder="Search or enter a web address"
      >

      <button class="go-button" id="goButton">GO</button>
    </div>

  </div>
</header>

<main class="browser">

  <section class="home" id="home">
    <div class="home-card">

      <div class="logo">Wen Browser</div>

      <input
        id="homeSearch"
        class="home-search"
        type="text"
        placeholder="Search or enter a web address"
      >

      <div class="shortcuts">
        <button class="shortcut" data-url="https://www.google.com/">
          Google
        </button>

        <button class="shortcut" data-url="https://www.nicovideo.jp/">
          Niconico
        </button>

        <button class="shortcut" data-url="https://www.youtube.com/">
          YouTube
        </button>
      </div>

      <p class="description">
        A lightweight browser-style web viewer designed for iPad.
      </p>

    </div>
  </section>

  <iframe
    id="viewer"
    title="Web Viewer"
    hidden
  ></iframe>

  <div class="status" id="status"></div>

</main>

</div>

<script>

const addressBar = document.getElementById("addressBar");
const homeSearch = document.getElementById("homeSearch");
const viewer = document.getElementById("viewer");
const home = document.getElementById("home");

const backButton = document.getElementById("backButton");
const forwardButton = document.getElementById("forwardButton");
const reloadButton = document.getElementById("reloadButton");
const goButton = document.getElementById("goButton");

const status = document.getElementById("status");

let historyList = [];
let historyPosition = -1;
let statusTimer;


function normalizeURL(input) {
  input = input.trim();

  if (!input) return "";

  // Already has http:// or https://
  if (/^[a-zA-Z][a-zA-Z\\d+\\-.]*:\\/\\//.test(input)) {
    return input;
  }

  // Looks like a domain
  if (/^[\\w.-]+\\.[a-z]{2,}(\\/.*)?$/i.test(input)) {
    return "https://" + input;
  }

  // Otherwise search Google
  return "https://www.google.com/search?q=" + encodeURIComponent(input);
}


function showStatus(message) {
  status.textContent = message;
  status.style.display = "block";

  clearTimeout(statusTimer);

  statusTimer = setTimeout(() => {
    status.style.display = "none";
  }, 3000);
}


function updateButtons() {
  backButton.disabled = historyPosition <= 0;

  forwardButton.disabled =
    historyPosition >= historyList.length - 1;
}


function loadWebsite(input, addHistory = true) {

  const url = normalizeURL(input);

  if (!url) return;

  addressBar.value = url;

  if (addHistory) {
    historyList = historyList.slice(
      0,
      historyPosition + 1
    );

    historyList.push(url);
    historyPosition++;
  }

  home.hidden = true;
  viewer.hidden = false;
  viewer.src = url;

  updateButtons();
}


function submit(input) {
  const value = input.value.trim();

  if (value) {
    loadWebsite(value);
  }
}


goButton.addEventListener("click", () => {
  submit(addressBar);
  addressBar.blur();
});


addressBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submit(addressBar);
    addressBar.blur();
  }
});


homeSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submit(homeSearch);
    homeSearch.blur();
  }
});


document
  .querySelectorAll("[data-url]")
  .forEach((button) => {

    button.addEventListener("click", () => {
      loadWebsite(button.dataset.url);
    });

  });


backButton.addEventListener("click", () => {

  if (historyPosition > 0) {

    historyPosition--;

    const url =
      historyList[historyPosition];

    addressBar.value = url;
    viewer.src = url;

    updateButtons();
  }

});


forwardButton.addEventListener("click", () => {

  if (
    historyPosition <
    historyList.length - 1
  ) {

    historyPosition++;

    const url =
      historyList[historyPosition];

    addressBar.value = url;
    viewer.src = url;

    updateButtons();
  }

});


reloadButton.addEventListener("click", () => {

  if (!viewer.hidden) {
    viewer.src = viewer.src;
  }

});


viewer.addEventListener("load", () => {
  showStatus("Page loaded");
});


updateButtons();

</script>

</body>
</html>
`;

export default {
  async fetch() {
    return new Response(HTML, {
      headers: {
        "content-type": "text/html; charset=UTF-8"
      }
    });
  }
};
