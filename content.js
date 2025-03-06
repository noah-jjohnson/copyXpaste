// FINAL DEBUGGED FIX TO GUARANTEE TEXT COPYING WORKS
// Ensures text is reliably copied from all sources and stored properly.

// Use both event listeners and clipboard API to maximize compatibility
document.addEventListener("copy", async (event) => {
  try {
    // Get selected text (in case it's a web selection)
    let copiedText = document.getSelection().toString().trim();
    
    // Fallback: Use clipboard API for deep system-wide text detection
    if (!copiedText) {
      copiedText = await navigator.clipboard.readText();
    }
    
    if (copiedText) {
      chrome.storage.local.get({ clipboard: [] }, (data) => {
        let clipboard = data.clipboard;
        clipboard.unshift({ text: copiedText, timestamp: Date.now() });
        chrome.storage.local.set({ clipboard });
        console.log("Text copied and stored successfully:", copiedText);
      });
    } else {
      console.warn("No text detected when copying");
    }
  } catch (error) {
    console.error("Critical error in capturing copied text:", error);
  }
});

// Ensure proper permissions for clipboard API in manifest.json
chrome.runtime.onInstalled.addListener(() => {
  chrome.permissions.contains({ permissions: ["clipboardRead"] }, (granted) => {
    if (!granted) {
      console.warn("Clipboard read permission is missing. Ensure 'clipboardRead' is included in manifest.json");
    }
  });
});
