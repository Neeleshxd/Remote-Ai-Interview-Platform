# 🚀 AI Assistant Integration Guide

## Architecture

The AI Assistant is now integrated into the InterviewPage with a three-panel layout:

```
InterviewPage (Full Height)
├── VideoPanel (Left, 25%)      → Video stream + controls
├── CodeEditor (Center, 50%)    → Problem + Code Editor
└── AIAssistantSidebar (Right, 25%) → Collapsible AI Chat ✨
```

## Features

### ✅ AI Assistant Capabilities
- **Explain**: Clarifies problem statements without giving solutions
- **Hint**: Provides guidance without revealing the answer
- **Review**: Provides feedback on code approaches
- **Analyze**: Breaks down complex problems

### ✨ UI Features
- Collapsible/Expandable sidebar to maximize code editor space
- Real-time chat with timestamps
- Service status indicator (Online/Offline)
- Copy last message & clear chat actions
- Auto-scrolling to latest messages
- Keyboard shortcut (Shift+Enter for multiline, Enter to send)

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd ai-assistant
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create/Update `.env` file in `ai-assistant/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from: https://ai.google.dev/

### 3. Start the AI API Server

```bash
cd ai-assistant
python api_server.py
```

You should see:
```
🤖 AI Assistant API Server starting on http://localhost:5000
```

### 4. Start the Next.js Frontend (in another terminal)

```bash
npm run dev
```

### 5. Test the Integration

1. Navigate to a meeting/interview page
2. Click on the AI Assistant panel on the right
3. Click one of the quick actions or type a message
4. You should see the AI response appear in the chat

## API Endpoints

### Next.js API Route
- **POST** `/api/ai`
- **Body**: `{ "prompt": "your question", "action": "explain|hint|review|analyze" }`
- **Response**: `{ "success": true, "message": "AI response", "action": "action_type" }`

### Python Flask API
- **GET** `http://localhost:5000/health` - Service status check
- **POST** `http://localhost:5000/api/chat` - Process chat messages

## Troubleshooting

### "AI service offline" message
- Make sure Flask server is running on port 5000
- Check: `curl http://localhost:5000/health`
- If port 5000 is in use, modify the port in `api_server.py`

### CORS errors
- Flask CORS is already configured in `api_server.py`
- Make sure you're accessing from `localhost:3000` (Next.js dev server)

### "No module named 'ai'" error
- Ensure you're running `api_server.py` from the `ai-assistant/` directory
- The script adds the current directory to Python path automatically

## Advanced Usage

### Customize AI Behavior

Edit `ai.py` - the `system_prompt` variable controls how the AI responds:

```python
system_prompt = f"""
You are an AI assistant helping a student during a software engineering interview.
Your job is ONLY to explain the interview question clearly...
"""
```

### Add New Quick Actions

In `AIAssistantSidebar.tsx`, add new buttons in the Quick Actions section:

```tsx
<Button
  variant="outline"
  size="sm"
  onClick={() => handleQuickAction("Your prompt here", "action_name")}
>
  Your Label
</Button>
```

Then handle the action in `api_server.py`:

```python
elif action == 'your_action':
    enhanced_prompt = f"Your custom prompt: {prompt}"
```

## File Structure

```
ai-assistant/
├── ai.py                 # Core AI logic (ask_ai function)
├── api_server.py         # Flask API server (NEW)
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
└── ...other files

src/
├── app/
│   └── api/
│       └── ai/
│           └── route.ts  # Next.js API bridge (NEW)
└── components/
    ├── AIAssistantSidebar.tsx  # AI Chat UI (UPDATED)
    ├── VideoPanel.tsx
    └── ...
```

## Performance Tips

1. **Keep chat history clean**: Use "Clear chat" button periodically
2. **Collapsing the sidebar**: Expands code editor for more screen space
3. **Response times**: First response may take 1-2 seconds (API latency)

## Security Notes

- ⚠️ Never commit `.env` file with API keys
- API key is only used server-side
- CORS is restricted to localhost in development

---

For more details on individual components:
- [AI Core Logic](./ai.py)
- [Flask API Server](./api_server.py)
- [React Sidebar Component](../src/components/AIAssistantSidebar.tsx)
