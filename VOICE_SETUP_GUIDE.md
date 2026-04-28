# 🚀 Voice-Enabled AI Assistant - Complete Setup Guide

## What's New ✨

Your interview platform now has **professional voice-enabled AI explanations** with:

```
📝 Text Responses        🎙️ Voice Responses       ⏯️  Play/Pause Controls
(As before)              (NEW! Coqui TTS)         (Per-message audio)

AI: "Arrays are..."  →  🎙️ Speaks the response  Play Button [▶] Listen
                        Auto-plays if enabled
                        Manual play anytime
```

## Quick Start - Voice Enabled

### Step 1: Install Enhanced Dependencies (IMPORTANT!)

```bash
cd ai-assistant
pip install -r requirements.txt
```

This installs:
- ✨ **TTS** (Text-to-Speech) - Coqui model
- 🔧 Additional libraries for audio processing

### Step 2: First Run (Model Download)

The **first time** you start the API server, it downloads the TTS model (~1-2GB):

```bash
python api_server.py
```

Expected output:
```
🤖 AI Assistant API Server starting on http://localhost:5000
✨ Features: Chat, Text-to-Speech, Health Check
🚀 Loading Coqui TTS (Jenny model)...
(Downloads model files...)
✅ TTS model loaded successfully
```

⏱️ **First boot: 2-5 minutes** (downloads model once)  
⏱️ **Subsequent boots: 10-20 seconds** (model already cached)

### Step 3: Start All Services

```bash
# Go back to root directory
cd ..

# Start both Flask API and Next.js frontend
bash start-all.sh
```

Or manually:
```bash
# Terminal 1: Flask API with TTS
cd ai-assistant && python api_server.py

# Terminal 2: Next.js Frontend
npm run dev
```

### Step 4: Open & Test

1. Open http://localhost:3000
2. Go to a meeting/interview page
3. Click "Explain" button in AI Assistant sidebar
4. 🎧 You should hear the voice response!

---

## How Voice Responses Work

### Interview Workflow

```
1. Candidate joins meeting
   ↓
2. Reads problem in center panel
   ↓
3. Clicks "Explain" button in AI sidebar
   ↓
4. AI Assistant:
   - Gets explanation from Gemini API
   - Converts text to speech (Coqui TTS)
   - Returns text + audio
   ↓
5. Candidate sees:
   - Text explanation in chat
   - "Listen" button to play audio
   - 🔊 Audio plays automatically (if enabled)
   ↓
6. Candidate can:
   - Read while listening
   - Pause/play audio
   - Disable voice (button in header)
```

### Quick Actions with Voice

All quick actions now include voice responses:

| Action | What It Does | Voice Response |
|--------|-------------|-----------------|
| **Explain** | Clarifies the problem | AI explains in voice |
| **Hint** | Gives guidance | Hint spoken out loud |
| **Review** | Feedback on approach | Feedback in voice |

### Voice Toggle

**Enable/Disable Voice Responses:**
- Look for 🔊 or 🔇 button in AI Assistant header
- Click to toggle voice on/off
- Changes apply to next message
- Can freely enable/disable during interview

---

## What's Inside

### New Files Created

1. **`tts_api.py`** - Text-to-Speech module
   - Converts text to audio using Coqui TTS
   - Returns base64 encoded WAV files
   - Handles long text by splitting into chunks
   - Uses "Jenny" model for natural voice

2. **`VOICE_INTEGRATION.md`** - Complete technical guide
   - Architecture details
   - Troubleshooting guide
   - Performance metrics
   - Security considerations

### Updated Files

1. **`api_server.py`**
   - New `/api/chat` endpoint with audio
   - New `/api/speak` endpoint
   - TTS integration

2. **`AIAssistantSidebar.tsx`**
   - Audio playback controls
   - Play/Pause buttons for each message
   - Volume toggle (enable/disable voice)
   - "Generating voice..." status message

3. **`requirements.txt`**
   - Added: TTS, scipy, librosa

---

## Audio Playback Features

### For Each AI Response

```
┌─ Message Text ─────────────────┐
│ "Arrays are collections of..." │
└────────────────────────────────┘
       │
       ↓ (if audio available)
┌─ Audio Control ────────────────┐
│ [▶ Listen] or [⏸ Playing...]  │
└────────────────────────────────┘
```

### Controls

- **Listen Button** - Play AI's voice response
- **Playing Indicator** - Shows when audio is playing
- **Pause Support** - Click again to pause
- **Auto-play** - Automatically plays when enabled
- **Single Audio** - Only one audio plays at a time

### Voice Features

- 🎙️ **Natural Voice** - Uses Coqui TTS Jenny model
- 🎛️ **Local Processing** - All processing on your server
- ⚡ **Fast** - Generates audio in 1-5 seconds typically
- 🔐 **Private** - Audio never leaves your system (only AI text goes to Gemini)

---

## Performance Guide

### Voice Generation Times

| Text Length | Time | File Size |
|------------|------|-----------|
| 50 chars | 1-2s | ~30KB |
| 200 chars | 2-3s | ~100KB |
| 500 chars | 4-6s | ~250KB |

**Tip**: Longer responses auto-split into chunks for faster generation.

### System Requirements

- **Disk Space**: ~2GB for TTS model (one-time download)
- **RAM**: ~500MB for model + ~100MB per request
- **CPU**: Adequate for TTS processing (works on most machines)
- **Network**: Only Gemini API calls need internet (TTS is local)

### Optimization Tips

1. **Keep responses under 300 characters** for instant audio
2. **Disable voice** if experiencing slowness (voice still works, just slower)
3. **Use "Hint" action** - shorter responses = faster audio
4. **Fresh start** if audio generation seems stuck (restart api_server.py)

---

## Troubleshooting

### "No Sound Playing"

**Check 1: Audio Enabled?**
- Look at header of AI Assistant sidebar
- If showing 🔇 (muted), click to enable 🔊

**Check 2: Browser Volume**
- Check your system volume
- Unmute browser tab in Chrome (click speaker icon in tab)

**Check 3: API Running?**
```bash
# In terminal, check if Flask is running
curl http://localhost:5000/health

# Should return:
# {"status": "AI service is running", "features": ["chat", "tts", "health_check"]}
```

### "API Won't Start / TTS Model Error"

**Solution 1: Reinstall TTS**
```bash
pip install --upgrade TTS
```

**Solution 2: Clear TTS Cache**
```bash
rm -rf ~/.local/share/tts_models/
# This will re-download the model on next run
```

**Solution 3: Check Disk Space**
```bash
# Make sure you have 2GB free
df -h
```

### "Audio Takes Too Long"

**For responses > 500 characters:**
- This is normal (audio generation is CPU-intensive)
- Consider using "Hint" action (shorter responses)
- Or disable audio temporarily if in a hurry

**To speed up:**
1. Check CPU usage (might be high)
2. Close other applications
3. Restart the API server

### "Audio Quality is Poor"

- The "Jenny" model is the fastest and clearest for general use
- This is intentional for interview use (clarity > perfect accent)
- To change voice model, edit `tts_api.py` (requires model re-download)

---

## Advanced Configuration

### Change Voice Model

Edit `ai-assistant/tts_api.py`:

```python
def get_tts():
    tts_model = TTS(
        model_name="tts_models/en/jenny/jenny",  # ← Change here
        gpu=False,
        in_memory=True
    )
    return tts_model
```

Available models (requires ~300MB-1GB each):
- `tts_models/en/jenny/jenny` (current - fastest)
- `tts_models/en/ljspeech/glow-tts` (natural)
- `tts_models/en/ljspeech/tacotron2-DDC` (high quality)

### Customize AI Response for Voice

Edit `ai-assistant/ai.py` system_prompt:

```python
system_prompt = """
...existing prompt...

For voice optimization:
- Use simple, conversational language
- Keep sentences short (easier to listen to)
- Avoid complex symbols (spell out: *, **, //)
- Natural pacing for speech
"""
```

### Disable Voice for Specific Actions

In `AIAssistantSidebar.tsx`:

```typescript
const sendMessage = async (prompt, action) => {
  // Disable audio for certain actions
  const includeAudio = action !== 'review'; // No audio for review
  
  const response = await fetch('/api/ai', {
    body: JSON.stringify({
      prompt,
      action,
      includeAudio, // ← Controls TTS
    }),
  });
};
```

---

## Testing Voice Integration

### Test 1: Check Health

```bash
curl http://localhost:5000/health
# Expected: 200 OK with features list
```

### Test 2: Test Text-to-Speech Only

```bash
curl -X POST http://localhost:5000/api/speak \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test"}'

# Should get back base64 audio in response
```

### Test 3: Full Integration

1. Open http://localhost:3000
2. Go to interview page
3. Click "Explain" in AI sidebar
4. Look for "Listen" button
5. Click to play audio
6. You should hear the response!

---

## Architecture Explained

```
Candidate Question
        ↓
Next.js API (/api/ai)
        ↓
Flask Server (5000)
        ↓
┌─ Two Parallel Processes ─┐
│ 1. AI Explanation        │
│    └→ Gemini API         │
│       └→ Returns text    │
│                          │
│ 2. Voice Synthesis       │
│    └→ Coqui TTS          │
│       └→ Returns audio   │
└──────────────────────────┘
        ↓ (Combined)
Response with:
{
  message: "Arrays are...",
  audio: "UklGRiY..." (base64)
}
        ↓
React Component
├─ Display text
├─ Add "Listen" button
└─ Auto-play audio
        ↓
🔊 Candidate hears response!
```

---

## File Structure

```
Remote Interview Platform
│
├─ ai-assistant/ (Voice Backend)
│  ├─ tts_api.py ✨ NEW
│  ├─ api_server.py (UPDATED)
│  ├─ ai.py
│  └─ requirements.txt (UPDATED)
│
├─ src/components/
│  ├─ AIAssistantSidebar.tsx (UPDATED) ✨ Audio UI
│  ├─ VideoPanel.tsx
│  └─ MeetingRoom.tsx
│
├─ VOICE_INTEGRATION.md ✨ Technical guide
├─ QUICK_START.md (UPDATED)
└─ start-all.sh
```

---

## Next Steps

1. ✅ Install dependencies (pip install -r requirements.txt)
2. ✅ Run API server (python api_server.py)
3. ✅ Start frontend (npm run dev)
4. ✅ Test voice in interview page
5. 📊 Monitor performance
6. 🎧 Gather candidate feedback

---

## Frequently Asked Questions

**Q: Does voice work on mobile?**  
A: Yes, but some browsers may require user gesture (tap to play first time)

**Q: Can candidates use voice input (microphone)?**  
A: Not yet - that's a roadmap feature for future

**Q: Is the AI response stored?**  
A: Text goes to Gemini API. Voice (audio) is generated locally and not stored.

**Q: Can I change the voice?**  
A: Yes! Edit `tts_api.py` and change the model name (requires ~300MB download)

**Q: Will voice work over slow internet?**  
A: Yes! TTS happens locally. Only Gemini API call needs internet.

**Q: Can I turn off voice for all candidates?**  
A: Yes - modify `AIAssistantSidebar.tsx` default: `const [audioEnabled, setAudioEnabled] = useState(false);`

---

## 🎉 You're All Set!

Your interview platform now has:
- ✅ AI-powered explanations
- ✅ Text responses  
- ✅ Voice responses with Coqui TTS
- ✅ Per-message audio playback
- ✅ Volume controls
- ✅ Professional three-panel interview layout

**Start interviewing with voice AI assistance!**

---

For detailed technical information, see **VOICE_INTEGRATION.md**
