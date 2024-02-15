const execBtn = document.getElementById("execBtn");
const isDev = true;

function _log(isDev, log) {
  if(isDev) {console.log(log)};
}

// Function to send message to worker.js
const listData = async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const activeTab = tabs[0];
  console.log('isDev', isDev);
  _log(isDev, ["popup.js activeTab", activeTab, isDev]);

  (async () => {
    const contentResponse = await chrome.tabs.sendMessage(activeTab.id, {
      action: "print-loop",
      tabId: activeTab.id,
      isDev: isDev,
    });

    _log(isDev, ["contentResponse", contentResponse]);
  })();
};

document.addEventListener("DOMContentLoaded", function () {
  // Button event listeners
  execBtn.addEventListener("click", listData);
});
