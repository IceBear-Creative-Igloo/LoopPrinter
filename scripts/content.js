(async () => {
  const log = function () {
    if (DEBUG) {
      console.log.apply(console, arguments);
    }
  };

  let DEBUG = false;

  const allContent = [];

  /**NOTE - Content modificators */
  function replaceIframesWithUrls(content) {
    const iframes = content.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      const iframeUrl = iframe.src;
      if (iframeUrl) {
        const placeholder = document.createElement("div");
        placeholder.textContent = `Embedded content: ${iframeUrl}`;
        placeholder.style.border = "1px solid #ccc";
        placeholder.style.padding = "10px";
        placeholder.style.marginBottom = "10px";
        placeholder.style.backgroundColor = "#f9f9f9";
        placeholder.style.borderRadius = "8px";

        iframe.parentNode.replaceChild(placeholder, iframe);
      } else {
        iframe.parentNode.remove();
      }
    });
    return content;
  }

  function getTablesReady(content) {
    // data-automation-type="Tablero"
    content
      .querySelectorAll('[data-automation-type="Tablero"]')
      .forEach((tableContainer) => {
        log("table", tableContainer);
        // #tableWrapper-
        let table = tableContainer.querySelector('[id*="tableWrapper-"');
        // table.querySelectorAll('[contenteditable="true"]').forEach((c) => { c.remove(); });
        let numbers = table.querySelector(
          '[data-automation-type="row-grabber-table"]'
        );
        let tableContent = table.querySelector('[role="table"]');
        tableContent
          .querySelector("thead")
          .querySelectorAll("svg")
          .forEach((e) => {
            e.remove();
          });
        let alignedTables = document.createElement("div");
        alignedTables.style.display = "flex";
        alignedTables.style.flexDirection = "row";
        alignedTables.appendChild(numbers);
        alignedTables.appendChild(tableContent);

        // console.log("to", alignedTables);
        // table.parentNode.remove();
        tableContainer.parentNode.replaceChild(alignedTables, tableContainer);
      });
    // console.log('getTablesReady done', content);
    return content;
  }

  function removeLoopUI(content) {
    content
      .querySelectorAll(
        "header, #Sidebar, #loopApp-menu9, aside, editor-card, .fui-Tooltip__content, data-tabster-dummy, div[role='toolbar'], #headerContainer button, .scriptor-block-ui-button, .scriptor-highlightWrapper, .conversa-comment, .conversa-focus-wrapper, [role='button']"
      )
      .forEach((e) => {
        // e.style.display = "none"
        // console.log("remove", e);
        e.remove();
      });
    return content;
  }

  function removeToCLinks(content) {
    content
      .querySelectorAll(".scriptor-table-of-contents-entry a")
      .forEach((e) => {
        e.removeAttribute("href");
        // _log(isDev, ["Remove href attribute", e]);
      });
    return content;
  }

  function addStyles() {
    return `
        @page {size: A4 portrait;margin: 2cm;}
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important; font-size: 12pt !important;}
      h1, .scriptor-paragraph[role="heading"][aria-level="1"]{font-size: 24pt !important;}
      h2, .scriptor-paragraph[role="heading"][aria-level="2"]{font-size: 20pt !important;}
      h3, .scriptor-paragraph[role="heading"][aria-level="3"]{font-size:18pt !important;}
      h4, .scriptor-paragraph[role="heading"][aria-level="4"]{font-size:16pt !important;}
      h5, .scriptor-paragraph[role="heading"][aria-level="5"]{font-size:14pt !important;}
      h1, h2, h3, h4, h5, .scriptor-paragraph[role="heading"] {page-break-after: avoid;font-weight: bold;}
        table, figure {page-break-inside: avoid;}
      a:link, a:active, a:link:hover, a:visited { text-decoration: none; color: inherit; }
      a:link:after { content: "(" attr(href) ")"; text-decoration: underline; display: inline-block; margin: 0 4px;font-size: 75%;}
      div[role="application"] { display: block !important; height: 100% !important; }
      div[role="application"] > div {position: static !important;}
      #headerContainer > div > div > button { display: none !importanr; }
      #headerContainer .scriptor-instance-1 { top: 0 !important; }
      .scriptor-pageFrameContainer .scriptor-pageFrame,
      .scriptor-pageContainer .scriptor-pageFrame {
        max-width: 100% !important;
      }
      .scriptor-inline .scriptor-hosting-element.scriptor-component-inline {
        display: inline-block;
      }
      .scriptor-inline .scriptor-hosting-element.scriptor-component-inline img {
        width: 24px;
        margin-right: 16px;
      }
      .scriptor-inline .scriptor-hosting-element.scriptor-component-inline a {
        max-width: 80vw;
        word-wrap: break-word;
      }
      .scriptor-inline .scriptor-hosting-element.scriptor-component-inline .fui-FluentProvider > div > div > div {
        display: inline-flex;
        flex-direction: row;
        padding: 4px 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-bottom: 10px;
        background: #f9f9f9;
      }
      .scriptor-table-of-contents-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
      }

      .scriptor-inline .scriptor-hosting-element.scriptor-component-block {
        padding: 4px 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-bottom: 10px;
        background: #f9f9f9;
      }
    `;
  }

  function getContentReady(content, title) {
    let _html = document.createElement("html");
    let _head = document.createElement("head");
    let _body = document.createElement("body");
    let _title = document.createElement("title");

    let _doc = document.createElement("div");
    _doc.insertAdjacentHTML("beforeend", content);

    _doc = removeLoopUI(_doc);
    _doc = removeToCLinks(_doc);
    _doc = replaceIframesWithUrls(_doc);
    _doc = getTablesReady(_doc);

    _title.insertAdjacentText("beforeend", title);
    let _titleH1 = document.createElement("h1");
    _titleH1.innerText = title;

    let _style = document.createElement("style");
    _style.innerHTML = addStyles();

    _head.appendChild(_title);
    _head.appendChild(_style);

    _body.appendChild(_titleH1);
    _body.appendChild(_doc);

    _html.appendChild(_head);
    _html.appendChild(_body);

    log(_html);
    return _html;
  }

  /**NOTE - Scroll and capture */
  async function getContentSize() {
    let totalHeight = 0;
    document
      .querySelectorAll(".scriptor-canvas .scriptor-pageContainer")
      .forEach((pc) => {
        log("pageContainer", pc);

        pc.querySelectorAll(".scriptor-pageFrameContainer").forEach((e) => {
          totalHeight += e.offsetHeight;
        });
      });

    return totalHeight;
  }

  // Scrolls through the page and captures content of each visible .scriptor-pageFrameContainer .scriptor-pageFrame
  async function scrollAndCapture() {
    // .scriptor-canvas.scriptor-styled-scrollbar
    // Selector for the custom scrollable element
    const scrollableSelector = ".scriptor-canvas.scriptor-styled-scrollbar"; // Update this selector as needed
    const scrollableElement = document.querySelector(scrollableSelector);
    
    if (!scrollableElement) {
        console.error("Scrollable element not found:", scrollableSelector);
        return;
    }
    
    scrollableElement.scrollTo(0, 0);
    const scrollHeight = await getContentSize();

    // const scrollHeight = scrollableElement.scrollHeight;
    const viewportHeight = scrollableElement.clientHeight;
    let lastScrollTop = -1;

    console.log(
      "Starting scrollAndCapture",
      scrollHeight,
      viewportHeight,
      lastScrollTop
    );

    
    while (
      scrollableElement.scrollTop < scrollHeight &&
      scrollableElement.scrollTop !== lastScrollTop
    ) {
      lastScrollTop = scrollableElement.scrollTop;
      scrollableElement.scrollTop += viewportHeight;
      // Wait for any dynamic content to load
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Ensure we capture the bottom of the content
    scrollableElement.scrollTop = scrollableElement.scrollHeight;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Setup IntersectionObserver to observe .scriptor-pageFrameContainer .scriptor-pageFrame elements
  function setupObserver() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      log('observer entries', entries);
      entries.forEach(async (entry) => {
        log("observe entry", entry);
        if (entry.isIntersecting) {
          let element = entry.target;
          log("isIntersecting", element, entry);
          log("innerHTML", element.innerHTML);
          while (
            element &&
            element !== document.body &&
            element.innerHTML === ""
          ) {
            log("wait for innerHTML to have content", element);
            await new Promise((resolve) => setTimeout(resolve, 600));
          }
          const htmlContent = element.innerHTML;
          if (!allContent.includes(htmlContent)) {
            // Avoid duplicates
            allContent.push(htmlContent);
          }

          observer.unobserve(entry.target); // Stop observing the current target
        }
      });
    }, observerOptions);

    log("allContent", allContent);

    // .scriptor-canvas .scriptor-pageContainer .scriptor-pageFrameContainer
    document
      //   .querySelectorAll(".scriptor-pageFrameContainer .scriptor-pageFrame")
      .querySelectorAll(
        ".scriptor-canvas .scriptor-pageContainer .scriptor-pageFrameContainer"
      )
      .forEach((element) => {
        log("setup observer", element);
        observer.observe(element);
      });
  }

  // Main function to orchestrate the scrolling and content capturing
  async function captureAndDisplayContent() {
    setupObserver();
    await scrollAndCapture();

    // Create a new tab with the captured content
    let capturedHTML = allContent.join("");
    let title = document.title;
    let processedContent = await getContentReady(capturedHTML, title);
    let newWindow = window.open(" ", "_blank");
    log('newWindow', newWindow);
    newWindow.document.open();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    newWindow.document.write(processedContent.innerHTML);
    newWindow.document.close();
    log('newWindow document write');

    newWindow.focus();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if(!DEBUG) {
      newWindow.print();
      newWindow.close();
    }

    // chrome.runtime.sendMessage({ status: "printDone" });
    return true;
  }

  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    DEBUG = msg.isDev;
    log("isDev in content", DEBUG);
    log(
      "Content",
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension",
    );

    if (msg.action === "test") {
      log('Run action "test" on ', msg.tabId);
      sendResponse({ content: "content.js saying goodbey" });
    }

    if (msg.action === "print-loop") {
      log('Run action "print-loop" on ', msg.tabId);
      captureAndDisplayContent().then(() => {
        log("captureAndDisplay done");
        sendResponse({ status: "printDone" });
      });
    }

    return true;
  });
})();
