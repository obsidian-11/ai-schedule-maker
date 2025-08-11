# Additional Context for Developers & AI Agents

## 1. GSU Portal Environment
- The extension operates primarily on GSU’s official student portal sites, specifically:
  - **Course add/drop pages:** `https://registration.gosolar.gsu.edu/*`
  - **Academic evaluation upload and interaction** through the extension UI (not the portal itself)
- These pages are **non-SPA**, mostly server-rendered HTML with pagination links.
- Course listings appear in **tabular format**, making DOM scraping straightforward but sensitive to layout changes.

---

## 2. Academic Evaluation PDF
- Evaluation PDFs have a **consistent structure** for GSU students but may vary by program.
- **Key data to extract:**
  - Remaining required courses (course codes, titles)
  - Number of credits left until graduation
  - Completed coursework summaries
- Parsing should be **robust to minor formatting changes** and rely on **text extraction** rather than visual layout.

---

## 3. RateMyProfessor Data Source
- **No official API exists**; common approaches involve:
  - Unofficial endpoints
  - HTML scraping
- Data includes:
  - Professor names
  - Average ratings
  - Review counts
  - Tags
- **Caching strategy** is important to avoid rate limits or excessive scraping.

---

## 4. AI Chatbot & Context Management
- Chatbot context is a **curated knowledge base** derived from:
  - GSU’s public course catalog website (scraped or manually updated)
  - University academic policies (graduation requirements, credit limits)
  - User’s personal academic evaluation and schedule data
- Context must be **structured and pruned** to fit OpenAI API token limits (e.g., chunked summaries).
- User queries may span:
  - Scheduling advice
  - Policy clarifications
  - Course info lookups

---

## 5. User Experience Considerations
- The **extension popup** is the primary interaction point for:
  - Uploading & viewing academic evaluation data
  - Viewing scraped course info with professor ratings and conflict warnings
  - Entering scheduling preferences and blocked time ranges
  - Chatting with the AI assistant
- **Injected UI panels** within the GSU portal pages provide in-context assistance without forcing users to switch contexts.

---

## 6. Privacy & Security
- **No user credentials** are handled by the extension; authentication is managed via the existing GSU login session in the browser.
- All sensitive data (academic evaluation, preferences, scraped info) is stored **only in browser storage**, not transmitted externally unless the user explicitly exports/shares it.
- Extension permissions are scoped **narrowly** to GSU domains and local file access to maintain user trust.

---

## 7. Development & Maintenance Notes
- The GSU portal may update HTML structures periodically — **scraping selectors and logic** must be maintainable and tested regularly.
- Pagination automation must be **robust to network delays** and possible user interactions.
- RateMyProfessor scraping may require **user-agent rotation** or proxy support if extended beyond casual use.
- AI context updates and **prompt engineering** require iterative refinement based on real user queries and feedback.
