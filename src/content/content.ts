// Content script for GSU course registration pages
// Will be expanded in Phase 2 for course scraping

console.log('GSU Schedule Assistant content script loaded');

// Detect if we're on a GSU course registration page
const isGSUCoursePage = () => {
  return window.location.hostname.includes('registration.gosolar.gsu.edu');
};

if (isGSUCoursePage()) {
  console.log('GSU course registration page detected');
  
  // Add visual indicator that extension is active
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #0366d6;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    font-family: sans-serif;
  `;
  indicator.textContent = 'GSU Schedule Assistant Active';
  document.body.appendChild(indicator);
  
  // Remove indicator after 3 seconds
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }, 3000);
}
