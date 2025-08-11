# GSU AI-Powered Schedule Maker

A browser extension that helps Georgia State University students optimize their class scheduling through AI assistance and automated data extraction.

## Features

- **Academic Evaluation Parsing**: Upload and parse PDF academic evaluations
- **Course Data Extraction**: Scrape GSU portal course listings  
- **Professor Ratings**: Integration with RateMyProfessor
- **AI Assistant**: Conversational scheduling guidance
- **Conflict Detection**: Highlight scheduling conflicts and preferences

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load in browser:
   - Open Chrome/Edge extensions page
   - Enable Developer mode
   - Click "Load unpacked" and select the `dist` folder

## Project Structure

```
src/
├── popup/          # Extension popup UI
├── content/        # Content scripts for GSU pages
├── background/     # Background service worker
├── types/          # TypeScript type definitions
└── utils/          # Utility functions (PDF parsing, storage)
```

## Current Implementation Status

✅ **Phase 1: MVP & Core Data Collection** 
- Basic extension structure
- **Real GSU PDF parsing** - Updated with actual GSU evaluation format
- Local data storage  
- React popup UI

### GSU Parser Features
- **Accurate Student Info**: Extracts name, ID, GPA from real GSU format
- **Credit Tracking**: Parses "Credits required/applied" sections
- **Smart Course Detection**: Finds required courses from "Still needed" sections
- **Multiple Requirements**: Handles Major, Core Curriculum, and Electives
- **Course Options**: Supports "CSC 4320 or 4330" type requirements

🚧 **Phase 2: Preferences & Scheduling Logic** (Coming next)
- User preference settings
- Conflict detection
- GSU course scraping

📋 **Phase 3: RateMyProfessor Integration** (Planned)
📋 **Phase 4: AI Chatbot Integration** (Planned)  
📋 **Phase 5: UX Refinement** (Planned)

## Privacy & Security

- All data processed locally in browser
- No external servers for sensitive information
- Minimal permissions (GSU domains only)
- User data never transmitted without consent
