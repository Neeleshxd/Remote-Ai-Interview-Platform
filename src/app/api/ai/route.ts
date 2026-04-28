import { NextRequest, NextResponse } from 'next/server';

const AI_BACKEND_URL = 'http://127.0.0.1:5000';

// ==============================
// GET → HEALTH CHECK
// ==============================
export async function GET() {
  try {
    const res = await fetch(`${AI_BACKEND_URL}/health`);
    const data = await res.json();

    return NextResponse.json({
      online: true,
      ...data
    });

  } catch {
    return NextResponse.json({ online: false }, { status: 500 });
  }
}

// ==============================
// POST → TEXT + VOICE
// ==============================
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // 🎤 VOICE REQUEST
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();

      const res = await fetch(`${AI_BACKEND_URL}/api/voice-chat`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      return NextResponse.json({
        success: true,
        text: data.text,
        message: data.response,
        audio: data.audio || null
      });
    }

    // 💬 TEXT REQUEST
    const { prompt, action } = await req.json();

    const res = await fetch(`${AI_BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        action,
        include_audio: true
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      success: true,
      message: data.message,
      audio: data.audio || null
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}