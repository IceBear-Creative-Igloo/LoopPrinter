const execBtn = document.getElementById("execBtn");
const debugBtn = document.getElementById("debugBtn");
let DEBUG = false;
let documentLoadingComplete = false;

const messagesBox = document.getElementById("messages");
const contetLoadingMsg = document.getElementById("contetLoading");

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  log('getCurrentTab function', queryOptions);
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  log('tab', tab);
  return tab;
}

const log = function () {
  if (DEBUG) {
    console.log.apply(console, arguments);
  }
};

function isLoopPage(tab) {
  return (tab.url.includes('loop.microsoft.com') && tab.active && tab.status === "complete");
}

function toggleAvailability(info, tabId, activeTab) {
  if (info.status === "complete" && tabId === activeTab.id) {
    // console.log("Document is loaded [chrome.tabs.onUpdated]");
    documentLoadingComplete = true;
    execBtn.disabled = false;
    debugBtn.disabled = false;
    // contetLoadingMsg.style.display = "none";
  } else {
    // console.log("still loading [chrome.tabs.onUpdated]");
    execBtn.disabled = true;
    debugBtn.disabled = true;
    // contetLoadingMsg.style.display = "block";
    documentLoadingComplete = false;
  }
}

// Function to send message to worker.js
const listData = async () => {
  const activeTab = await getCurrentTab();

  (async () => {
    const contentResponse = await chrome.tabs.sendMessage(activeTab.id, {
      action: "print-loop",
      tabId: activeTab.id,
      isDev: DEBUG,
    });

    log("contentResponse", contentResponse);
  })();
};

const debugWindow = async () => {
  console.clear();
  const time = new Date().getTime();
  console.group("DEBUG action", time);
  log(
    "Document loaded [documentLoadingComplete]",
    documentLoadingComplete
  );
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const _activeTab = tabs[0];
  const activeTab = await getCurrentTab();
  log("isDev", DEBUG);
  log("getCurrentTab", activeTab);
  log("Alternative activeTab", _activeTab);

  if(isLoopPage(activeTab)) {
    log("som na aktivnej a nacitanej Loop stranke");
    (async () => {
      const contentResponse = await chrome.tabs.sendMessage(activeTab.id, {
        action: "test",
        tabId: activeTab.id,
        isDev: DEBUG,
      });
  
      log('Content response here!', contentResponse);
      log("contentResponse", contentResponse);
    })();
  }
  console.groupEnd();

};

chrome.tabs.onUpdated.addListener(async function (tabId, info) {
  const activeTab = await getCurrentTab();
  toggleAvailability(info, tabId, activeTab);
});

document.addEventListener("DOMContentLoaded", function () {
  // Button event listeners
  execBtn.addEventListener("click", listData);
  debugBtn.addEventListener("click", debugWindow);
  if(DEBUG) {
    debugBtn.style.display = "block";
  }
});
