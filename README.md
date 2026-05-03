# Remote AI Interview Platform

An AI-powered remote technical interview platform built using Next.js, TypeScript, Python Flask, Gemini AI, Whisper, and Coqui TTS.

The platform simulates a real coding interview environment by combining:

* Real-time video interview experience
* Integrated coding editor
* AI-powered interview assistant
* Voice-to-voice AI interaction
* Problem explanations and hints
* Speech transcription and text-to-speech

---

# Features

## Core Features

* Real-time interview room interface
* Integrated coding environment
* AI interview assistant
* Problem explanations
* Interview-style hints
* Code review assistance
* Responsive modern UI
* Collapsible AI assistant sidebar
* Health check and backend connectivity

## AI Features

* Gemini AI integration
* Voice-to-text using Whisper
* Text-to-speech using Coqui TTS
* Voice-to-voice interaction
* Interview-focused prompt engineering

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Shadcn UI
* Stream Video SDK
* Clerk Authentication

## Backend

* Python Flask
* Gemini API
* Whisper
* Coqui TTS

---

# Project Structure

```bash
remote-interview-platform/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── lib/
│
├── public/
├── package.json
├── next.config.ts
├── tsconfig.json
│
├── ai-assistant/
│   ├── api_server.py
│   ├── ai.py
│   ├── stt.py
│   ├── tts_api.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# Installation Guide

# 1. Clone Repository

```bash
git clone https://github.com/Neeleshxd/Remote-Ai-Interview-Platform.git
```

```bash
cd Remote-Ai-Interview-Platform
```

---

# 2. Frontend Setup (Next.js)

## Install Dependencies

```bash
npm install
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs at:

```bash
http://localhost:3000
```

---

# 3. Backend Setup (Python AI Server)

## Navigate to AI Folder

```bash
cd ai-assistant
```

---

## Create Virtual Environment

### macOS / Linux

```bash
python3 -m venv ai-env
```

---

## Activate Environment

### macOS / Linux

```bash
source ai-env/bin/activate
```

---

## Install Requirements

```bash
pip install -r requirements.txt
```

If requirements.txt is missing, install manually:

```bash
pip install flask
pip install flask-cors
pip install python-dotenv
pip install requests
pip install openai-whisper
pip install TTS
```

---

# 4. Environment Variables

Create a `.env` file inside:

```bash
ai-assistant/.env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

# 5. Run AI Backend

```bash
python api_server.py
```

Backend runs at:

```bash
http://127.0.0.1:5000
```

---

# 6. Verify Backend

Open:

```bash
http://127.0.0.1:5000/health
```

Expected response:

```json
{
  "status": "AI service running"
}
```

---

# Voice Features Setup

## Whisper (Speech-to-Text)

Install:

```bash
pip install openai-whisper
```

---

## Coqui TTS (Text-to-Speech)

Install:

```bash
pip install TTS
```

---

# Running Complete Project

## Terminal 1 → Frontend

```bash
npm run dev
```

---

## Terminal 2 → Backend

```bash
cd ai-assistant
source ai-env/bin/activate
python api_server.py
```

---

# Using The Platform

## Start Application

Open:

```bash
http://localhost:3000
```

---

## Features Available

### AI Assistant

* Explain problems
* Give hints
* Review code
* Analyze questions

---

### Voice Interaction

* Click "Speak"
* Record voice
* Whisper transcribes audio
* Gemini generates response
* Coqui TTS returns voice response

---

# Common Issues & Fixes

## 1. TTS Not Available

Install:

```bash
pip install TTS
```

---

## 2. Whisper Module Missing

Install:

```bash
pip install openai-whisper
```

---

## 3. Flask Not Found

Install:

```bash
pip install flask flask-cors python-dotenv
```

---

## 4. Backend Offline

Verify:

```bash
http://127.0.0.1:5000/health
```

---

## 5. Virtual Environment Activation

### macOS / Linux

```bash
source ai-env/bin/activate
```

---

# API Endpoints

## Health Check

```bash
GET /health
```

---

## AI Chat

```bash
POST /api/chat
```

---

## Voice Chat

```bash
POST /api/voice-chat
```

---

## Text To Speech

```bash
POST /api/speak
```

---

# Future Improvements

* Real-time collaborative coding
* AI-generated interview questions
* Cloud deployment
* Interview analytics
* Multi-user support
* Real-time voice streaming

---

# Author

## Neelesh Adhikari
## Misbah Subhani

GitHub:

```bash
https://github.com/Neeleshxd
```

---

# License

This project is developed for educational and portfolio purposes.
