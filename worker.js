// chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
//   console.log('Worker',
//     sender.tab
//       ? "from a content script:" + sender.tab.url
//       : "from the extension"
//   );
//   if (msg.action === "execute-script") {
//     // Get the current tab.
//     const activeTab = msg.activeTab;
//     console.log("Worker execute-script", activeTab.id, activeTab);

//     // const contentResponse = await chrome.tabs.sendMessage(activeTab.id, {
//     //   action: "test",
//     //   tabId: activeTab.id,
//     // });
//     // console.log("worker contentResponse", contentResponse);

//     (async () => {
//       const activeTab = msg.activeTab;
//       console.log("async call", activeTab);
//       const response = await chrome.tabs.sendMessage(activeTab.id, {
//         action: "test",
//         tabId: activeTab.id,
//       });
//       // do something with response here, not outside the function
//       console.log('Async response to worker', response);
//     })();
//   }
//   sendResponse(true);
// });

// chrome.action.onClicked.addListener((tab) => {
//   console.log("Action clicked", tab);
//   alert("Action clicked");
// });


// service-worker.js

// Wrap in an onInstalled callback to avoid unnecessary work
// every time the service worker is run
chrome.runtime.onInstalled.addListener(() => {
  // Page actions are disabled by default and enabled on select tabs
  chrome.action.disable();

  // Clear all rules to ensure only our expected rules are set
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    // Declare a rule to enable the action on example.com pages
    let exampleRule = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlContains: "loop.microsoft.com/p/" },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    };

    console.log('rules', exampleRule);

    // Finally, apply our new array of rules
    let rules = [exampleRule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});
