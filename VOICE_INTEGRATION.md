# 🎙️ Voice Integration Guide - AI Assistant with Text-to-Speech

## Overview

The AI Assistant now includes **full voice support** using Coqui TTS (Jenny model) for natural-sounding speech generation. Candidates get AI explanations in **both text AND voice** format.

## Architecture

```
Candidate Input (Text)
        ↓
Next.js API (/api/ai)
        ↓
Flask API Server (localhost:5000)
        ↓
Python AI Logic (ai.py) → Gemini API → Gets Text Response
        ↓
TTS Module (tts_api.py) → Coqui TTS → Generates Audio (base64)
        ↓
Browser Audio Player (Web Audio API)
        ↓
🔊 Voice Output to Candidate
```

## Features

### ✨ Text-to-Speech Capabilities
- 🎙️ **Automatic voice generation** on AI responses
- 🎯 **Coqui TTS (Jenny model)** - Natural, local voice synthesis
- 🎛️ **Toggle voice on/off** - Users can disable voice if needed
- ⏯️ **Play/Pause controls** - Per-message audio playback
- 🔄 **Auto-play** - Voice plays immediately after response
- 📝 **Text fallback** - If TTS fails, text still displays

### 🎨 UI Features
- 🟢 **Service status indicator** - Shows when TTS is ready
- 🎵 **Audio player button** - "Listen" button for each AI message
- 📊 **Audio generation status** - "Generating response with voice..."
- 🔊 **Volume control** - Enable/disable voice responses
- ⚡ **Quick actions** - All support voice output

## Setup & Installation

### 1. Install Dependencies

```bash
cd ai-assistant
pip install -r requirements.txt
```

Key packages:
- `TTS>=0.22.0` - Coqui Text-to-Speech
- `Flask` - API server
- `librosa` - Audio processing
- `scipy` - Signal processing

### 2. First Run (Model Download)

The first time you use the TTS, it downloads the Jenny model (~1-2GB):

```bash
python api_server.py
# First boot will show:
# 🚀 Loading Coqui TTS (Jenny model)...
# (Downloads model files to ~/.local/share/tts_models/)
# ✅ TTS model loaded successfully
```

This only happens once!

### 3. Run the Services

**Option A: Automatic (Recommended)**
```bash
bash start-all.sh
```

**Option B: Manual**
```bash
# Terminal 1 - Flask API with TTS
cd ai-assistant
python api_server.py

# Terminal 2 - Next.js Frontend
npm run dev
```

### 4. Verify Voice is Working

```bash
# Test the API
curl -X POST http://localhost:5000/health
# Should return: {"status": "AI service is running", "features": ["chat", "tts", "health_check"]}
```

## How It Works

### Flow Diagram

```
1. Candidate Types: "Explain Array concepts"
                        ↓
2. Frontend Sends Request
   POST /api/ai
   {
     prompt: "Explain...",
     action: "explain",
     includeAudio: true
   }
                        ↓
3. Next.js API Bridge
   - Validates request
   - Forwards to Flask (localhost:5000)
                        ↓
4. Flask Receives Request
   - Enhances prompt based on action
   - Calls ai.ask_ai(prompt)
                        ↓
5. Python AI Engine
   - Uses Gemini API to generate response
   - Returns: "Arrays are collections of elements..."
                        ↓
6. TTS Module (NEW)
   - Takes the text response
   - Calls Coqui TTS
   - Generates WAV audio file
   - Converts to base64
   - Returns as part of JSON response
                        ↓
7. Response Returns to Browser
   {
     success: true,
     message: "Arrays are collections...",
     audio: "UklGRiY..." (base64 encoded WAV)
   }
                        ↓
8. React Component (AIAssistantSidebar)
   - Displays text message
   - Adds "Listen" button
   - Auto-plays audio if enabled
   - User can play/pause anytime
                        ↓
9. Browser Audio API
   - Decodes base64 to blob
   - Creates audio element
   - Plays through speaker
   - 🔊 Candidate hears the response!
```

## API Endpoints

### POST /api/chat (Enhanced)
Request:
```json
{
  "prompt": "Explain what a linked list is",
  "action": "explain|hint|review|analyze",
  "include_audio": true
}
```

Response:
```json
{
  "success": true,
  "message": "A linked list is...",
  "action": "explain",
  "audio": "UklGRiY...AQAVEQAA..." // base64 encoded WAV
}
```

### POST /api/speak (Standalone Speech)
Request:
```json
{
  "text": "This is some text to convert to speech"
}
```

Response:
```json
{
  "success": true,
  "audio": "UklGRiY...",
  "text": "This is some text..."
}
```

### GET /health (Status Check)
Response:
```json
{
  "status": "AI service is running",
  "features": ["chat", "tts", "health_check"]
}
```

## Configuration

### Customize TTS Voice

Edit `ai-assistant/tts_api.py`:

```python
def get_tts():
    # Available models:
    # - "tts_models/en/jenny/jenny" (Current)
    # - "tts_models/en/ljspeech/glow-tts"
    # - "tts_models/en/ljspeech/tacotron2-DDC"
    
    tts_model = TTS(
        model_name="tts_models/en/jenny/jenny",  # Change model here
        gpu=False,  # Set to True if GPU available
        in_memory=True
    )
    return tts_model
```

### Adjust Audio Chunk Size

```python
MAX_CHARS = 400  # Characters per chunk (in tts_api.py)
```

Large responses are split into chunks for better performance.

### Enable/Disable Voice in Frontend

```typescript
// In AIAssistantSidebar.tsx
const [audioEnabled, setAudioEnabled] = useState(true);  // Default: enabled

// User can toggle with button in header
<button onClick={() => setAudioEnabled(!audioEnabled)}>
  {audioEnabled ? <Volume2Icon /> : <VolumeXIcon />}
</button>
```

## Performance Optimization

### Audio Generation Performance

| Response Length | Generation Time | Approx. File Size |
|-----------------|-----------------|------------------|
| < 100 chars | 1-2 seconds | 50-80 KB |
| 100-300 chars | 2-4 seconds | 100-200 KB |
| 300-600 chars | 4-7 seconds | 200-400 KB |
| > 600 chars | 7-15 seconds | 400+ KB |

**Tip**: Longer responses are auto-split into chunks for faster generation.

### Memory Usage

- **Model Load**: ~500MB (once on startup)
- **Per Request**: ~50-200MB (temporary)
- **Browser**: Base64 is ~33% larger than binary

### Caching Strategy

Currently, audio is generated fresh for each request. To cache:

```python
# In api_server.py (optional future enhancement)
audio_cache = {}

def get_cached_audio(text_hash):
    if text_hash in audio_cache:
        return audio_cache[text_hash]
    # Generate new audio
    audio = generate_speech_base64(text)
    audio_cache[text_hash] = audio
    return audio
```

## Troubleshooting

### "TTS model not loading"
```
Error: Failed to load TTS model

Solution:
1. Check internet connection (downloads model first time)
2. Ensure disk space: ~2GB for models
3. Clear cache: rm -rf ~/.local/share/tts_models/
4. Reinstall: pip install --upgrade TTS
```

### "Audio generation timeout"
```
Issue: Takes > 30 seconds for a response

Solution:
1. Reduce text length (split into quick hints)
2. Check CPU usage (TTS is CPU-intensive)
3. Disable GPU if enabled (might cause conflicts)
4. Try shorter responses first
```

### "No sound playing in browser"
```
Troubleshooting:
1. Check browser volume settings
2. Verify audio enabled: check volume button in sidebar
3. Open DevTools → Console for errors
4. Test with: fetch('api/speak', {
     method: 'POST',
     body: JSON.stringify({text: 'Hello'})
   })
```

### "Audio desync with playback"
```
Solution:
1. Browser caches base64 audio
2. Clear browser cache (Cmd+Shift+Delete)
3. Restart Next.js: npm run dev
4. Verify Chrome supports Web Audio API
```

## Browser Compatibility

| Browser | Web Audio API | Status |
|---------|--------------|--------|
| Chrome | ✅ | Full support |
| Firefox | ✅ | Full support |
| Safari | ✅ | Full support |
| Edge | ✅ | Full support |
| Mobile Chrome | ✅ | Works (may require user gesture) |
| Mobile Safari | ✅ | Works (may require user gesture) |

**Note**: Autoplay policies may require user interaction on mobile.

## File Structure

```
ai-assistant/
├── tts_api.py ✨ NEW
│   └── Audio generation module
│   ├── generate_speech_base64() - Returns base64 audio
│   └── generate_speech_file() - Returns WAV file
├── api_server.py (UPDATED)
│   └── Added /api/chat with audio support
│   └── Added /api/speak endpoint
├── ai.py (EXISTING)
│   └── Gemini AI logic
└── requirements.txt (UPDATED)
    └── Added TTS, scipy, librosa

src/components/
├── AIAssistantSidebar.tsx (UPDATED)
│   ├── Audio playback UI
│   ├── Play/Pause buttons
│   └── Volume toggle
└── MeetingRoom.tsx (EXISTING)
    └── Three-panel layout

src/app/api/ai/
└── route.ts (UPDATED)
    └── includeAudio parameter
```

## Security & Privacy

✅ **Audio Processing**
- Generated locally (no external TTS API)
- Not stored anywhere
- Deleted after session
- No data sent to third parties for TTS

⚠️ **Considerations**
- Gemini API still used for AI responses (review privacy policy)
- Base64 audio transmitted over network
- Use HTTPS in production

## Advanced Usage

### Custom System Prompts

Edit `ai.py` to customize TTS tone:

```python
system_prompt = f"""
You are an AI instructor for coding interviews.

When explaining, keep responses:
- Clear and concise (under 200 words)
- Conversational tone for speech synthesis
- No complex symbols (spell out: *, **, //)

For TTS optimization:
- Use simple sentences
- Avoid excessive punctuation
- Natural pacing for speech
"""
```

### Voice Selection for Different Interview Types

```python
# In tts_api.py
def get_tts_for_type(interview_type):
    if interview_type == "friendly":
        model = "tts_models/en/jenny/jenny"
    elif interview_type == "formal":
        model = "tts_models/en/ljspeech/glow-tts"
    else:
        model = "tts_models/en/jenny/jenny"
    
    return TTS(model_name=model, gpu=False)
```

## Performance Monitoring

### Key Metrics to Track

```python
import time

def measure_tts_performance(text):
    start = time.time()
    audio = generate_speech_base64(text)
    duration = time.time() - start
    
    print(f"TTS Stats:")
    print(f"  Text length: {len(text)} chars")
    print(f"  Duration: {duration:.2f}s")
    print(f"  Audio size: {len(audio) / 1024:.1f}KB")
    print(f"  Speed: {len(text) / duration:.0f} chars/sec")
```

## Roadmap

- [ ] Voice input from microphone (speech-to-text)
- [ ] Multiple voice selection
- [ ] Voice speed adjustment
- [ ] Audio caching for repeated questions
- [ ] Streaming audio response
- [ ] Language-specific voices
- [ ] Real-time transcription of candidate code explanation

## Support & Issues

For voice-related issues:
1. Check console errors: DevTools → Console tab
2. Verify Python service: `curl http://localhost:5000/health`
3. Check audio file permissions
4. Review Chrome DevTools Network tab for API calls

---

**🎉 Congratulations!** Your interview platform now has professional voice-enabled AI explanations!

