# 🎧 AI Assistant Voice Feature - Quick Reference

## For Candidates 👨‍💻

### Using Voice Features During Interview

#### When stuck on a problem:
```
1. Click "Explain" button in AI sidebar → 
   Get text explanation + hear it spoken

2. Still confused → 
   Click "Hint" → Get guidance

3. Finished coding → 
   Click "Review" → Get feedback on approach
```

#### Controlling Voice:
```
🔊 Enable Voice     - Shows in header
🔇 Disable Voice    - Click to toggle off
▶  Listen           - Play audio for any message
⏸  Pause            - Click again to pause audio
```

#### Tips:
- 💡 Voice is optional - click 🔇 to disable if distracting
- ⏱️ Audio plays automatically after Explain/Hint/Review
- 📱 Works on laptop, tablet, and phone
- 🎧 Use headphones for clarity

---

## For Interviewers 👩‍🏫

### What Candidates See:
```
Interview Page Layout:
┌─────────────────────────────────────┐
│ Video   │ Code   │ AI Helper    │
│ ┌────┐  │ Editor │ ┌──────────┐ │
│ │Cam │  │        │ │Question? │ │
│ └────┘  │        │ │ Explain  │ │
│ Toolbar │        │ │ Hint     │ │
│         │        │ │ Review   │ │
│         │        │ └──────────┘ │
└─────────────────────────────────────┘
```

### AI Features Available:
| Button | What It Does |
|--------|-------------|
| **Explain** | Clear problem explanation (no code solutions) |
| **Hint** | Guidance for approaching the problem |
| **Review** | Feedback on their coding approach |

### Voice Settings:
- All responses have voice (if enabled)
- Candidates can enable/disable anytime
- Professional Jenny voice model
- Natural pacing and clarity

### What to Expect:
- First response: 3-8 seconds (includes voice generation)
- Subsequent: 1-3 seconds
- Audio auto-plays unless disabled
- Candidate can pause/replay anytime

---

## For Developers/Admins 🛠️

### Starting Services

**One Command:**
```bash
bash start-all.sh
```

**Manual Start:**
```bash
# Terminal 1
cd ai-assistant && python api_server.py

# Terminal 2
npm run dev
```

### Monitoring

**Health Check:**
```bash
curl http://localhost:5000/health
# Response: {"status": "AI service is running", "features": ["chat", "tts", "health_check"]}
```

**Test Audio Generation:**
```bash
curl -X POST http://localhost:5000/api/speak \
  -H "Content-Type: application/json" \
  -d '{"text": "Test message"}'
```

### Configuration

**API Keys (`.env`):**
```
GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Voice Settings (`tts_api.py`):**
```python
MAX_CHARS = 400        # Text chunk size
model_name = "tts_models/en/jenny/jenny"  # Voice model
```

### Performance Tuning

```python
# In tts_api.py
def get_tts():
    tts = TTS(
        model_name="...",
        gpu=False,        # Set True if GPU available
        in_memory=True    # Faster, more RAM
    )
    return tts
```

---

## Voice Quality & Performance

### Audio Quality
- **Format**: 16-bit WAV @ 22kHz
- **Voice**: Coqui TTS Jenny (natural, clear)
- **Speed**: Optimized for listening while reading

### Generation Times
| Text Length | Audio Time | Quality |
|------------|-----------|---------|
| < 100 chars | 1-2s | Excellent |
| 100-300 chars | 2-4s | Excellent |
| 300-600 chars | 5-8s | Excellent |
| > 600 chars | 10-15s | Still good |

### System Requirements
- **Disk**: 2GB for TTS model (one-time)
- **RAM**: 500MB model + 100MB per request
- **CPU**: Modern processor sufficient
- **Network**: Gemini API calls only

---

## Troubleshooting Quick Guide

### Audio Not Playing?
```
Check List:
☐ Is 🔊 showing (not 🔇)?
☐ Is system volume up?
☐ Is browser tab not muted?
☐ Is audio generating? (see "Generating voice..." message)
☐ Try: Open DevTools (F12) → Console tab
```

### API Not Starting?
```
Check List:
☐ Is port 5000 free? (lsof -i :5000)
☐ Is TTS installed? (pip list | grep TTS)
☐ Is GEMINI_API_KEY set? (echo $GEMINI_API_KEY)
☐ Try: pip install --upgrade TTS
☐ Try: rm -rf ~/.local/share/tts_models/
```

### Audio Takes Too Long?
```
Solutions:
✓ Close other apps (CPU intensive)
✓ Use "Hint" instead of "Explain" (shorter)
✓ Check CPU usage (top or Activity Monitor)
✓ Restart API server
✓ Disable voice if in hurry (can re-enable later)
```

### Poor Audio Quality?
```
This is normal for interview assistant.
Voice is optimized for clarity, not accent perfection.

To change voice:
1. Edit ai-assistant/tts_api.py
2. Change model name
3. Restart API server
4. First run: re-downloads new voice model
```

---

## Common Scenarios

### Scenario 1: Candidate Stuck on Algorithm
```
Candidate: "I don't understand the problem"
          ↓
          Clicks "Explain"
          ↓
AI: "Provides text explanation + speaks it"
          ↓
Candidate: Reads while listening
          ↓
Candidate: "Got it, let me try"
```

### Scenario 2: Wrong Approach Detected
```
Candidate: "I think I should use a loop"
          ↓
Interviewer: Notices suboptimal approach
          ↓
Candidate: Clicks "Hint"
          ↓
AI: "Think about whether linear or binary approach fits"
          ↓
AI: Speaks the hint
          ↓
Candidate: Reconsiders approach
```

### Scenario 3: Code Review After Completion
```
Candidate: "Done with the problem"
          ↓
          Clicks "Review"
          ↓
AI: "Good solution! Consider: Time complexity is O(n²),
     Could optimize using hash map for O(n)"
          ↓
AI: Speaks feedback with voice
          ↓
Candidate: Learns from feedback
```

---

## Feature Limits & Notes

### What Voice Does ✅
- Explain problem concepts
- Provide hints without solutions
- Give code feedback
- Speak any length response
- Save time vs. typing answers

### What Voice Doesn't Do ❌
- Provide full code solutions
- Hear candidate's voice input (text only)
- Remember between sessions
- Personalize based on history
- Rate interview performance

### Privacy Notes
- Gemini API sees text (review privacy policy)
- Voice generation is local (no external service)
- Audio not stored after session
- Use HTTPS in production

---

## Keyboard Shortcuts

```
In AI Chat Area:
Enter       → Send message
Shift+Enter → New line in textarea
Ctrl+A      → Select all text
Cmd+C       → Copy message text
```

---

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Works great |
| Safari | ✅ Full | iOS may need gesture |
| Edge | ✅ Full | Chromium-based |
| Mobile | ✅ Good | Some autoplay limits |

---

## Performance Tips

### For Developers
- Shorter prompts = faster responses
- Cache AI responses if repeated
- Monitor TTS generation time
- Use lighter models if CPU-bound

### For Candidates
- Use voice for complex concepts
- Disable voice if network slow
- Try hints before full explanations
- Read while listening (better retention)

---

## Data Flow (Simplified)

```
Candidate Input
    ↓
🌐 Internet (Gemini API for AI text)
    ↓
💻 Local TTS Processing (audio generation)
    ↓
🔊 Browser Audio Playback
    ↓
Candidate Hears Response
```

**Key Point**: Only AI text goes to Gemini. Voice generation happens locally.

---

## Getting Help

### Quick Checks
1. `curl http://localhost:5000/health` - API alive?
2. DevTools Console (F12) - Any errors?
3. Check `.env` - API key set?
4. `bash test-integration.sh` - Everything working?

### Documentation Links
- Quick Start: **VOICE_SETUP_GUIDE.md**
- Full Docs: **VOICE_INTEGRATION.md**
- Architecture: **ARCHITECTURE.md**
- Summary: **VOICE_COMPLETE_SUMMARY.md**

---

## Voice Quality Comparison

### Coqui TTS (Jenny) - Current
```
✅ Fast (1-5 seconds)
✅ Clear and natural
✅ Local processing
✅ No external API calls
✅ Best for interviews
```

### Alternative Models (Optional)
```
GloW-TTS
├ More expressive
├ Slightly slower
└ Different voice tone

Tacotron2
├ Highest quality
├ Slowest generation
└ Most natural accent
```

---

## Frequently Asked Questions

**Q: Why does it take time to generate voice?**  
A: TTS is CPU-intensive. Your computer creates natural-sounding speech from scratch.

**Q: Can candidates hear each other through voice?**  
A: No - voice is one-way AI to candidate. Interview audio is separate.

**Q: What if API fails?**  
A: Text still works, just no voice. Candidate can continue without audio.

**Q: Can I change the speaking pace?**  
A: Currently no, but could be added. Voice optimized for natural listening.

**Q: Does voice remember context?**  
A: No, but AI does (keeps last 5 messages). Voice just speaks current response.

**Q: Is there privacy concern with voice?**  
A: Voice generation is local. Only Gemini API sees text (review their privacy policy).

---

## Checklist - First Time Setup

```
Before First Use:
☐ Python 3.8+ installed
☐ Node.js 18+ installed
☐ pip install -r requirements.txt (in ai-assistant/)
☐ GEMINI_API_KEY in .env
☐ Ports 3000 & 5000 available

First Run:
☐ bash start-all.sh
☐ Wait for TTS model to download (~1-2GB)
☐ Open http://localhost:3000
☐ Go to interview page
☐ Try "Explain" button
☐ Listen for voice response

After Setup:
☐ Test different actions (Hint, Review)
☐ Toggle voice on/off
☐ Check audio quality
☐ Monitor performance
```

---

## Pro Tips 💡

1. **For Best Experience**: Use headphones for clarity
2. **For Teaching**: Disable voice first, enable only when needed
3. **For Shy Candidates**: Voice makes explanations less intimidating
4. **For Accessibility**: Voice helps candidates with reading difficulties
5. **For Time Management**: Voice speeds up explanations vs. typing

---

## Version Info

- **Version**: 2.0
- **Release**: Voice Integration Complete
- **Status**: Production Ready
- **Python Version**: 3.8+
- **Node Version**: 18+
- **Browser Support**: All modern browsers

---

**🎉 Ready to use voice-enabled interviews!** 

Questions? Check documentation files or test with `test-integration.sh`
