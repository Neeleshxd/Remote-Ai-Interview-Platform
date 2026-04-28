# 🚀 Quick Start - AI Assistant on InterviewPage

## ⚡ TL;DR - Get Started in 3 Steps

### Step 1: Install Python Dependencies
```bash
cd ai-assistant
pip install -r requirements.txt
```

### Step 2: Start Both Services
```bash
# Option A: Use the automatic startup script (recommended)
cd ..
bash start-all.sh

# Option B: Manual startup (two terminal windows)
# Terminal 1:
cd ai-assistant
python api_server.py

# Terminal 2:
npm run dev
```

### Step 3: Open in Browser
Navigate to: **http://localhost:3000**

Then go to a meeting/interview page to see the three-panel layout with the AI Assistant!

---

## 🎯 What You Get

### New Three-Panel Interview Layout
```
┌─────────────────────────────────────────────────────────┐
│ VideoPanel (25%)   │  CodeEditor (50%)   │  AI Chat (25%)│
│ • Video stream     │  • Problem statement│  • Explain    │
│ • Controls         │  • Code editor      │  • Hint       │
│ • Participants     │  • Language select  │  • Review     │
│                    │                     │  • Collapsible│
└─────────────────────────────────────────────────────────┘
```

### AI Assistant Features
- ✅ **Explain** - Clarifies what the problem is asking
- 💡 **Hint** - Gives guidance without spoiling the solution  
- 👁️ **Review** - Provides feedback on code approach
- 🔍 **Analyze** - Breaks down complex problems
- 💬 **Chat** - Full conversation history with timestamps
- 🔄 **Collapsible** - Expand/collapse to maximize editor space

---

## 📁 Files Created/Modified

### New Files
- ✨ `src/components/AIAssistantSidebar.tsx` - AI chat UI component
- ✨ `src/components/VideoPanel.tsx` - Extracted video component
- ✨ `src/app/api/ai/route.ts` - Next.js API bridge
- ✨ `ai-assistant/api_server.py` - Flask backend server
- 📋 `AI_ASSISTANT_INTEGRATION.md` - Full documentation
- 🚀 `start-all.sh` - Automatic startup script
- 🧪 `test-integration.sh` - Integration test script

### Updated Files
- 🔄 `src/components/MeetingRoom.tsx` - Three-panel layout
- 🔄 `ai-assistant/requirements.txt` - Added Flask dependencies

---

## 🔧 How It Works

```
User Types Message
        ↓
React Component (AIAssistantSidebar)
        ↓
Next.js API Route (/api/ai)
        ↓
Flask Backend (api_server.py)
        ↓
Python AI Logic (ai.py)
        ↓
Gemini API Call
        ↓
Response flows back through the chain
```

---

## 🧪 Verify Installation

Run the test script anytime:
```bash
bash test-integration.sh
```

It checks:
- ✅ Python & Node.js installed
- ✅ Required packages installed
- ✅ Environment variables set
- ✅ File structure correct
- ✅ Ports available

---

## 🐛 Troubleshooting

### "AI service offline"
```bash
# Make sure Flask is running
curl http://localhost:5000/health
# Should return: {"status": "AI service is running"}
```

### "ModuleNotFoundError: No module named 'flask'"
```bash
cd ai-assistant
pip install -r requirements.txt
```

### Port already in use?
```bash
# Kill existing process on port 5000
lsof -ti :5000 | xargs kill -9
# Or use a different port - modify api_server.py
```

### No response from AI?
1. Check GEMINI_API_KEY in `ai-assistant/.env`
2. Verify API key is valid at https://ai.google.dev/
3. Check internet connection

---

## 📚 Full Documentation

For detailed information, see: [AI_ASSISTANT_INTEGRATION.md](./AI_ASSISTANT_INTEGRATION.md)

---

## 💡 Pro Tips

1. **Auto-clear chat**: Use the trash icon to clean up old messages
2. **Copy responses**: Click the copy icon to copy AI responses
3. **Keyboard shortcuts**: 
   - `Enter` = Send message
   - `Shift + Enter` = New line in message
4. **Collapse sidebar**: Click the `<` button to give more space to the code editor

---

## 🎓 Example Interview Workflow

1. **Candidate joins meeting** - sees the three-panel layout
2. **Reads problem** - displayed in center panel
3. **Feels confused** - clicks "Explain" in AI Assistant
4. **Gets clarification** - AI explains what the problem is asking
5. **Starts coding** - can see video on left, code in center
6. **Stuck on approach** - clicks "Hint" for guidance
7. **Done coding** - clicks "Review" to get feedback
8. **Needs space** - collapses AI sidebar to focus on code

---

Happy coding! 🚀
