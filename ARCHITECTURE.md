# 🏗️ System Architecture & Data Flow

## Component Hierarchy

```
App (Next.js)
│
└─ StreamCall (Stream.io)
   │
   └─ MeetingPage
      │
      └─ StreamTheme
         │
         └─ MeetingRoom ⭐ (Main Container)
            │
            ├─ ResizablePanelGroup (Horizontal Layout)
            │  │
            │  ├─ ResizablePanel (25%)
            │  │  └─ VideoPanel
            │  │     ├─ PaginatedGridLayout / SpeakerLayout (Stream.io)
            │  │     ├─ CallParticipantsList
            │  │     ├─ CallControls
            │  │     └─ Video Control Buttons
            │  │
            │  ├─ ResizableHandle (Draggable Divider)
            │  │
            │  ├─ ResizablePanel (50% or 75% when collapsed)
            │  │  └─ CodeEditor
            │  │     ├─ Question Selector
            │  │     ├─ Language Selector
            │  │     ├─ Problem Statement
            │  │     └─ Monaco Editor
            │  │
            │  ├─ ResizableHandle (Draggable Divider)
            │  │
            │  └─ ResizablePanel (25%) OR Collapsed Button
            │     └─ AIAssistantSidebar ✨
            │        ├─ Header (Status Indicator)
            │        ├─ Quick Actions (Buttons)
            │        ├─ ScrollArea (Message History)
            │        │  └─ Message List
            │        │     ├─ User Messages
            │        │     ├─ AI Messages
            │        │     └─ Timestamps
            │        └─ Input Section
            │           ├─ Textarea
            │           └─ Send Button
            │
            └─ State Management
               ├─ isAISidebarCollapsed (boolean)
               └─ setIsAISidebarCollapsed (setState)
```

---

## Data Flow Diagram

### User Sends Message

```
┌──────────────────┐
│  User Types      │
│  Clicks "Send"   │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────┐
│ AIAssistantSidebar.tsx           │
│ ├─ Validate input                │
│ ├─ Add to local messages array   │
│ ├─ Clear input field             │
│ └─ Set loading state = true      │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ fetch("/api/ai", {               │
│   method: "POST",                │
│   body: {                        │
│     prompt: "user input",        │
│     action: "explain|hint|etc"   │
│   }                              │
│ })                               │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ src/app/api/ai/route.ts          │
│ ├─ Receive POST request          │
│ ├─ Extract prompt & action       │
│ └─ Forward to Python Flask       │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ fetch(                           │
│   "http://localhost:5000/api/chat" │
│   {                              │
│     method: "POST",              │
│     body: { prompt, action }     │
│   }                              │
│ )                                │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ ai-assistant/api_server.py       │
│ @app.route('/api/chat', ...)     │
│ ├─ Receive request               │
│ ├─ Enhance prompt based on action│
│ ├─ Call ask_ai(prompt)           │
│ └─ Return response               │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ ai-assistant/ai.py               │
│ def ask_ai(prompt):              │
│ ├─ Add to chat_history           │
│ ├─ Create system_prompt          │
│ ├─ Call Gemini API               │
│ │  (https://generativelanguage   │
│ │   .googleapis.com/...)          │
│ ├─ Extract response              │
│ └─ Return answer                 │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ Google Gemini API                │
│ ├─ Process request               │
│ ├─ Generate response             │
│ │  (Explain only, no solutions)  │
│ └─ Return text                   │
└────────┬─────────────────────────┘
         │
         ↓ Response flows back through same chain...
         │
┌──────────────────────────────────┐
│ AIAssistantSidebar.tsx           │
│ ├─ Receive response              │
│ ├─ Add AI message to array       │
│ ├─ Set loading state = false     │
│ └─ Auto-scroll to latest message │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ User Sees AI Response            │
│ in Chat History                  │
└──────────────────────────────────┘
```

---

## Collapse/Expand Animation

```
Normal State (Both Panels Open)
┌─────────┬──────────────┬─────────┐
│ Video   │ Code Editor  │ AI Chat │
│ 25%     │ 50%          │ 25%     │
└─────────┴──────────────┴─────────┘

User clicks Collapse Button
         ↓

Animated Transition
┌─────────┬─────────────────────┐ [>]
│ Video   │ Code Editor (75%)   │
│ 25%     │                     │
└─────────┴─────────────────────┘

Collapsed State
┌─────────┬─────────────────────────────┐
│ Video   │ Code Editor (75%)           │ [>]
│ 25%     │                             │
└─────────┴─────────────────────────────┘
                                    └─ Minimal AI Sidebar Button

User clicks Expand Button
         ↓

Animated Transition (Reverse)
         ↓

Back to Normal State
```

---

## Service Communication Layers

```
Layer 1: Frontend UI
┌────────────────────────────────┐
│ React Components               │
│ - AIAssistantSidebar           │
│ - VideoPanel                   │
│ - CodeEditor                   │
│ - MeetingRoom                  │
└────────────┬───────────────────┘
             │ HTTP POST

Layer 2: Next.js Backend Bridge
┌────────────────────────────────┐
│ src/app/api/ai/route.ts        │
│ - Validates request            │
│ - Routes to Python backend     │
│ - Handles errors               │
└────────────┬───────────────────┘
             │ HTTP POST (localhost:5000)

Layer 3: Python Flask API Server
┌────────────────────────────────┐
│ ai-assistant/api_server.py     │
│ - /health endpoint             │
│ - /api/chat endpoint           │
│ - CORS enabled                 │
└────────────┬───────────────────┘
             │ Python function call

Layer 4: AI Logic Engine
┌────────────────────────────────┐
│ ai-assistant/ai.py             │
│ - ask_ai(prompt) function      │
│ - Chat history management      │
│ - System prompt engineering    │
└────────────┬───────────────────┘
             │ HTTPS API call

Layer 5: External AI Service
┌────────────────────────────────┐
│ Google Gemini API              │
│ - Processes request            │
│ - Generates response           │
│ - Returns text                 │
└────────────────────────────────┘
```

---

## State Management Flow

### MeetingRoom State
```
MeetingRoom.tsx
├─ isAISidebarCollapsed: boolean
│  ├─ false → Show all 3 panels
│  └─ true  → Show minimized AI panel
│
└─ onChange: setIsAISidebarCollapsed
   └─ Triggers ResizablePanel size recalculation
```

### AIAssistantSidebar State
```
AIAssistantSidebar.tsx
├─ messages: Message[]
│  ├─ Array of chat messages
│  └─ Each has: id, type, content, timestamp, action
│
├─ input: string
│  └─ Current textarea value
│
├─ isLoading: boolean
│  ├─ true → Show "Thinking..." placeholder
│  └─ false → Enable input
│
└─ aiServiceConnected: boolean
   ├─ true → Show green indicator, enable UI
   └─ false → Show red indicator, disable UI
```

### CodeEditor State (Context)
```
CodeEditor.tsx
├─ selectedQuestion: Question
│  └─ Current problem being solved
│
├─ language: "javascript" | "python" | "java"
│  └─ Selected programming language
│
└─ code: string
   └─ Current code in editor
```

---

## File Structure & Dependencies

```
Remote Interview Platform
│
├─ Frontend (React/Next.js)
│  ├─ src/components/
│  │  ├─ MeetingRoom.tsx ◄── Entry point
│  │  ├─ VideoPanel.tsx ◄── NEW
│  │  ├─ AIAssistantSidebar.tsx ◄── NEW
│  │  ├─ CodeEditor.tsx
│  │  └─ ui/ (shadcn components)
│  │
│  ├─ src/app/
│  │  ├─ api/
│  │  │  └─ ai/
│  │  │     └─ route.ts ◄── NEW API Bridge
│  │  └─ (root)/meeting/[id]/
│  │     └─ page.tsx
│  │
│  └─ package.json
│     └─ Dependencies: react, next, stream-io, ...
│
├─ Backend (Python/Flask)
│  ├─ ai-assistant/
│  │  ├─ api_server.py ◄── NEW Flask Server
│  │  ├─ ai.py ◄── Core AI logic (uses ask_ai)
│  │  ├─ assistant.py (voice CLI)
│  │  ├─ transcribe.py (audio → text)
│  │  ├─ tts.py (text → audio)
│  │  ├─ voice_input.py (record audio)
│  │  ├─ requirements.txt ◄── UPDATED
│  │  ├─ .env (GEMINI_API_KEY)
│  │  └─ README.md
│  │
│  └─ External Dependencies
│     ├─ Google Gemini API
│     ├─ Flask & Flask-CORS
│     └─ requests, python-dotenv, ...
│
└─ Configuration
   ├─ start-all.sh ◄── NEW (Start both services)
   ├─ test-integration.sh ◄── NEW (Verify setup)
   ├─ QUICK_START.md ◄── NEW
   ├─ AI_ASSISTANT_INTEGRATION.md ◄── NEW
   └─ IMPLEMENTATION_SUMMARY.md ◄── NEW
```

---

## Request/Response Format

### Frontend → Next.js API

```typescript
// Request
POST /api/ai
Content-Type: application/json

{
  "prompt": "Explain what this problem is asking",
  "action": "explain" | "hint" | "review" | "analyze"
}

// Response
{
  "success": true,
  "message": "The problem asks you to...",
  "action": "explain"
}

// Error Response
{
  "error": "Failed to get AI response",
  "success": false
}
```

### Next.js API → Flask Backend

```python
# Request
POST http://localhost:5000/api/chat
Content-Type: application/json

{
  "prompt": "Explain what this problem is asking",
  "action": "explain"
}

# Response
{
  "success": True,
  "message": "The problem asks you to...",
  "action": "explain"
}

# Error Response
{
  "success": False,
  "error": "Error message here"
}
```

### Flask → Gemini API

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "You are an AI assistant...\n\nQuestion: ..."
        }
      ]
    }
  ]
}

// Response
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "The answer is..."
          }
        ]
      }
    }
  ]
}
```

---

## Environment Setup

```bash
# Port Mapping
Frontend:        localhost:3000   (Next.js)
Flask Backend:   localhost:5000   (Python)
Video Stream:    Stream.io CDN
AI Service:      Google Gemini API

# Environment Variables
GEMINI_API_KEY=xxx...xxx (in ai-assistant/.env)

# CORS Configuration
Flask: CORS(app) for localhost
Next.js: No CORS needed (same origin)
```

---

## Performance Metrics

```
Response Time Targets:
├─ AI Response: 1-3 seconds
├─ Message Display: < 100ms
├─ Sidebar Collapse: < 200ms (smooth animation)
└─ Auto-scroll: < 50ms

Optimizations:
├─ Chat context limited to 5 messages
├─ Message lazy loading
├─ Collapsible UI to free memory
└─ Async API calls (non-blocking UI)
```

---

## Security & Error Handling

```
Security Layers:
├─ API Key stored server-side only
├─ CORS restricted to localhost
├─ Input validation on all endpoints
└─ No sensitive data in logs

Error Handling:
├─ Frontend: Show "AI service offline"
├─ API Bridge: Return error response
├─ Flask: Catch exceptions, return 500
├─ Python: Fallback messages
└─ User: Can retry or continue without AI
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Easy to maintain and extend
✅ Scalable for production
✅ Secure API communication
✅ Responsive user experience
