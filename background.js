let activeTabId = null;
let startTime = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
  startTime = new Date();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    const endTime = new Date();
    const timeSpent = (endTime - startTime) / 1000; // in seconds
    const url = new URL(changeInfo.url).hostname;

    // Classify website as productive or unproductive
    const isProductive = classifyWebsite(url);

    // Send data to backend
    fetch("http://localhost:3000/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, timeSpent, isProductive }),
    });

    startTime = new Date();
  }
});

function classifyWebsite(url) {
  const productiveSites = ["leetcode.com", "github.com", "stackoverflow.com"];
  const unproductiveSites = ["facebook.com", "youtube.com", "twitter.com"];
  if (productiveSites.includes(url)) return true;
  if (unproductiveSites.includes(url)) return false;
  return null; // Neutral
}
