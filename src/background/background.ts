// Background script for GSU Schedule Assistant
// Handles extension lifecycle and cross-tab communication

chrome.runtime.onInstalled.addListener(() => {
  console.log('GSU Schedule Assistant installed');
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  // Handle specific message types here in future phases
  switch (request.type) {
    case 'PING':
      sendResponse({ status: 'pong' });
      break;
    default:
      console.log('Unknown message type:', request.type);
  }
});
