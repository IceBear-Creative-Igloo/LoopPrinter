chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  console.log('Worker',
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (msg.action === "execute-script") {
    // Get the current tab.
    const activeTab = msg.activeTab;
    console.log("Worker execute-script", activeTab.id, activeTab);

    // const contentResponse = await chrome.tabs.sendMessage(activeTab.id, {
    //   action: "test",
    //   tabId: activeTab.id,
    // });
    // console.log("worker contentResponse", contentResponse);

    (async () => {
      const activeTab = msg.activeTab;
      console.log("async call", activeTab);
      const response = await chrome.tabs.sendMessage(activeTab.id, {
        action: "test",
        tabId: activeTab.id,
      });
      // do something with response here, not outside the function
      console.log('Async response to worker', response);
    })();
  }
  sendResponse(true);
});


