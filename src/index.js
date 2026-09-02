import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="app">

    <header class="topbar">
      <div class="toolbar">

        <button class="nav-button" id="backButton">
          ‹
        </button>

        <button class="nav-button" id="forwardButton">
          ›
        </button>

        <button class="nav-button" id="reloadButton">
          ↻
        </button>

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

          <button class="go-button" id="goButton">
            GO
          </button>

        </div>

      </div>
    </header>


    <main class="browser">

      <section class="home" id="home">

        <div class="home-card">

          <h1 class="logo">
            Wen Browser
          </h1>

          <input
            id="homeSearch"
            class="home-search"
            type="text"
            placeholder="Search or enter a web address"
          >

          <div class="shortcuts">

            <button
              class="shortcut"
              data-url="https://www.google.com/"
            >
              Google
            </button>

            <button
              class="shortcut"
              data-url="https://www.nicovideo.jp/"
            >
              Niconico
            </button>

            <button
              class="shortcut"
              data-url="https://www.youtube.com/"
            >
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


      <div
        class="status"
        id="status"
      ></div>

    </main>

  </div>
`;


const addressBar =
  document.querySelector("#addressBar");

const homeSearch =
  document.querySelector("#homeSearch");

const viewer =
  document.querySelector("#viewer");

const home =
  document.querySelector("#home");

const backButton =
  document.querySelector("#backButton");

const forwardButton =
  document.querySelector("#forwardButton");

const reloadButton =
  document.querySelector("#reloadButton");

const goButton =
  document.querySelector("#goButton");

const status =
  document.querySelector("#status");


let historyList = [];
let historyPosition = -1;


function normalizeURL(input) {

  input = input.trim();

  if (!input) return "";


  // Already a URL
  if (/^[a-zA-Z][a-zA-Z\\d+\\-.]*:\\/\\//.test(input)) {
    return input;
  }


  // Looks like a domain
  if (/^[\\w.-]+\\.[a-z]{2,}(\\/.*)?$/i.test(input)) {
    return "https://" + input;
  }


  // Otherwise search Google
  return (
    "https://www.google.com/search?q=" +
    encodeURIComponent(input)
  );
}


let statusTimer;


function showStatus(message) {

  status.textContent = message;

  status.style.display = "block";

  clearTimeout(statusTimer);

  statusTimer = setTimeout(() => {

    status.style.display = "none";

  }, 3000);

}


function updateButtons() {

  backButton.disabled =
    historyPosition <= 0;

  forwardButton.disabled =
    historyPosition >= historyList.length - 1;

}


function loadWebsite(input, addHistory = true) {

  const url = normalizeURL(input);

  if (!url) return;


  addressBar.value = url;


  if (addHistory) {

    historyList =
      historyList.slice(
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


goButton.addEventListener(
  "click",
  () => submit(addressBar)
);


addressBar.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {

      event.preventDefault();

      submit(addressBar);

      addressBar.blur();

    }

  }
);


homeSearch.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {

      event.preventDefault();

      submit(homeSearch);

      homeSearch.blur();

    }

  }
);


document
  .querySelectorAll("[data-url]")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        loadWebsite(button.dataset.url);

      }
    );

  });


backButton.addEventListener(
  "click",
  () => {

    if (historyPosition > 0) {

      historyPosition--;

      const url =
        historyList[historyPosition];

      addressBar.value = url;

      viewer.src = url;

      updateButtons();

    }

  }
);


forwardButton.addEventListener(
  "click",
  () => {

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

  }
);


reloadButton.addEventListener(
  "click",
  () => {

    if (!viewer.hidden) {

      viewer.src = viewer.src;

    }

  }
);


viewer.addEventListener(
  "load",
  () => {

    showStatus("Page loaded");

  }
);


updateButtons();
