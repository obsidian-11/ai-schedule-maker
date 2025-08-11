# GSU AI-Powered Class Schedule Assistant — Project Overview

## Purpose
This browser extension aims to simplify and optimize the class scheduling process for Georgia State University students by combining automated data extraction, user preferences, and AI-powered assistance — all while keeping user data private and processed locally.

The extension helps students:

- Understand their academic progress by parsing their official academic evaluation PDF.
- Automatically gather detailed information about available courses from the GSU portal.
- Access professor ratings from RateMyProfessor to make informed decisions.
- Detect and highlight scheduling conflicts and respect personalized preferences (time blocks, class formats).
- Interactively plan their course schedule with a conversational AI chatbot that understands GSU’s course catalog and policies.

---

## How It Works

### 1. User Authentication & Data Input
- The student logs into their GSU portal as usual through their browser.
- They open the extension and upload their academic evaluation PDF (standardized format).
- The extension parses key data from the PDF client-side, extracting required classes, remaining credits, and other graduation-related info.

### 2. Course Data Extraction
- When the student visits the GSU course add/drop pages, the extension injects content scripts that scrape course listings directly from the page’s DOM.
- It supports paginated course lists by automating “next page” clicks and scraping additional data, consolidating course info (timings, instructors, locations) into a structured JSON format.

### 3. Professor Ratings Integration
- The extension queries RateMyProfessor’s unofficial API or scrapes their website to retrieve professor ratings.
- Ratings are cached locally for performance and displayed alongside each course within the extension UI.

### 4. Scheduling Assistance & Conflict Detection
- Users input their scheduling preferences such as preferred class times, online/in-person modes, and blocked time ranges.
- The extension analyzes scraped course data and highlights any time conflicts or classes that fall into blocked periods, providing visual warnings without restricting choices.

### 5. AI-Powered Chatbot Support
- An AI chatbot, integrated via OpenAI’s API, is accessible through the extension’s UI.
- It is fed curated GSU course catalog data and policy information, allowing it to answer complex scheduling questions, suggest course combinations, and guide users through graduation requirements interactively.
- The chatbot’s context data is refreshed manually to ensure up-to-date information.

### 6. Data Privacy & Storage
- All user data, including academic evaluation details, course information, preferences, and cached ratings, are stored locally within the browser (IndexedDB or Chrome storage).
- No sensitive data leaves the user’s device unless explicitly shared.

---

## Key Technical Details
- **Frontend:** React + TypeScript for responsive UI in extension popup and injected content scripts.
- **PDF Parsing:** Client-side parsing using `pdf.js` or `pdf-lib` to extract structured academic info.
- **Web Scraping:** DOM scraping of GSU course pages with automated pagination handling using `MutationObserver` and event simulation.
- **External Data:** Integration with RateMyProfessor via unofficial API or web scraping with local caching.
- **AI Integration:** OpenAI API for chatbot, with custom prompt engineering leveraging scraped course catalog and policy data.
- **Storage:** Local browser storage for persistence across sessions.
- **Permissions:** Minimal, limited to GSU portal domains and local file access to ensure user trust and security.

---

## Benefits
- Reduces manual effort and guesswork in planning semester schedules.
- Empowers students to make data-driven decisions based on course details and professor quality.
- Provides personalized scheduling advice and conflict warnings tailored to individual preferences.
- Leverages AI to answer nuanced questions beyond static scheduling tools.
- Maintains strong privacy by processing data locally without external servers.
