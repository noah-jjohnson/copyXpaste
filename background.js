chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy",
    title: "Save to Study Clipboard",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy") {
    chrome.storage.local.get({ clipboard: [] }, (data) => {
      let clipboard = data.clipboard;
      clipboard.unshift({ text: info.selectionText, timestamp: Date.now() });
      chrome.storage.local.set({ clipboard });
    });
  }
});
