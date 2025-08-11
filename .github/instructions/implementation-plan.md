# AI-Powered GSU Schedule Maker Extension — Implementation Plan

## Tech Stack & Architecture

### Extension Framework
- **React + TypeScript** for popup UI & injected content scripts
- **WebExtension APIs** (`tabs`, `storage`, `webRequest`, `content_scripts`)

### PDF Parsing
- `pdf.js` or `pdf-lib` for client-side PDF extraction

### Data Storage
- **IndexedDB** (via `idb` wrapper) or `chrome.storage.local` for persisting:
  - Parsed academic evaluation
  - User preferences (time blocks, class prefs)
  - Cached RateMyProfessor ratings
  - Saved schedules

### Web Scraping
- Content scripts injected on GSU class add/drop pages to parse DOM tables
- Programmatic pagination handling with `MutationObserver` for dynamic loading

### RateMyProfessor Data
- Use unofficial public API or scraping approach with caching
- Cache per professor with TTL ~1 week in storage

### AI Chatbot
- Frontend **React** chat UI injected into GSU portal pages and/or accessible from popup
- Backend calls to **OpenAI API** with context (cached course catalog + policies + user data)
- Context updated manually by user trigger

---

## Phases & Milestones

### **Phase 1: MVP & Core Data Collection**
- Build basic React extension popup
- Implement PDF upload & client-side parsing of key academic evaluation fields
- Save parsed data in local storage, allow re-upload/reset
- Inject content script into GSU course add/drop page
- Scrape visible course list from the DOM and convert to JSON
- Support manual pagination: add “Load next page” button in popup that triggers content script to click and scrape next page
- Store scraped courses in local storage

### **Phase 2: Preferences & Scheduling Logic**
- Add UI in popup for user preferences:
  - Preferred class times (morning/evening)
  - Online/in-person toggle
  - Time blocks to avoid (e.g. 10–12am)
- Implement logic to detect and flag time conflicts in scraped schedule data
- Show warnings in popup UI (non-blocking)

### **Phase 3: RateMyProfessor Integration**
- Research & integrate unofficial RateMyProfessor API or implement scraping logic
- For each scraped class, fetch professor rating & store in cache
- Display ratings alongside classes in popup UI

### **Phase 4: AI Chatbot Integration**
- Build chatbot UI (React) injected into GSU pages & accessible from popup
- Prepare course catalog & policy context data:
  - Scrape course catalog website on-demand (or periodically if feasible)
  - Format into knowledge base for chatbot prompts
- Connect chatbot frontend with OpenAI API backend calls
- Provide ability to ask questions about schedules, requirements, preferences, and get AI-generated recommendations

### **Phase 5: UX Refinement & Persistence**
- Allow saving/loading multiple schedules locally
- Enable manual refresh of course catalog context for chatbot
- Improve UI/UX: loading states, error handling, accessibility
- Test across browsers (Chrome, Edge, Firefox)
- Prepare for public release (store listing, documentation)

---

## Additional Notes
- **Performance:** Paginated scraping with delays and `MutationObserver` will avoid race conditions and partial data.
- **Security & Privacy:** All sensitive data stays on user device unless user explicitly shares.
- **Permissions:** Minimal permissions (GSU domains + local files) requested to maintain trust.
- **Extensibility:** Architecture allows adding new data sources, deeper AI features, or calendar integration later.
