# Testing the GSU Schedule Assistant Extension

## Phase 1 Test Cases

### 1. Extension Installation
- [ ] Load unpacked extension in Chrome/Edge
- [ ] Extension appears in extensions list
- [ ] No console errors during load
- [ ] Extension icon appears in toolbar (if icon added)

### 2. Popup Interface
- [ ] Click extension icon opens popup
- [ ] Popup displays upload interface
- [ ] "Choose PDF File" button is functional
- [ ] Upload area is visually appealing

### 3. PDF Upload & Parsing
- [ ] Upload a PDF file (any PDF for initial test)
- [ ] File upload triggers processing
- [ ] Loading state shows during processing
- [ ] Results display after processing (may be minimal for non-GSU PDFs)

### 4. Data Storage
- [ ] Uploaded data persists after closing popup
- [ ] Re-opening popup shows saved data
- [ ] Reset button clears stored data
- [ ] Re-upload replaces existing data

### 5. GSU Portal Content Script
- [ ] Visit a GSU registration page (`https://registration.gosolar.gsu.edu/*`)
- [ ] Blue indicator appears briefly in top-right
- [ ] No console errors on page load

## Test PDF Content (for realistic testing)

Create a test PDF with content like:
```
Student Name: John Doe
Student ID: 123456789
Program: Computer Science
Total Credits Required: 120
Credits Completed: 90
Credits Remaining: 30

REQUIRED COURSES:
CS 4200 Software Engineering (3 credits)
CS 4250 Computer Networks (3 credits)
MATH 3020 Probability and Statistics (3 credits)
```

## Expected Behavior
- Extension should parse and display summary of academic info
- User can upload, view, and reset their data
- All data stays local (check chrome storage in DevTools)
- Content script activates on GSU pages
