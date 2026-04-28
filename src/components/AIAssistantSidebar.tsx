"use client";

import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  AlertCircleIcon,
  BotIcon,
  SendIcon,
  ZapIcon,
  CodeIcon,
  Loader2Icon,
  MicIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "./ui/textarea";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
}

export default function AIAssistantSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "👋 I'm your AI Assistant. Ask or speak!",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiServiceConnected, setAiServiceConnected] = useState(false);
  const [recording, setRecording] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 🔊 PLAY AUDIO
  const playAudio = (base64: string) => {
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64}`);
      audio.play();
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  // AUTO SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // HEALTH CHECK
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/ai");
        const data = await res.json();
        setAiServiceConnected(data.online);
      } catch {
        setAiServiceConnected(false);
      }
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // 💬 TEXT CHAT
  // =========================
  const sendMessage = async (prompt: string, action: string = "hint") => {
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, action }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: data.message,
          timestamp: new Date(),
        },
      ]);

      if (data.audio) playAudio(data.audio);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // 🎤 VOICE CHAT (FIXED)
  // =========================
  const handleVoice = async () => {
    try {
      console.log("🎤 Starting recording...");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        console.log("🛑 Recording stopped");

        const blob = new Blob(chunks, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("audio", blob);

        setIsLoading(true);

        try {
          const res = await fetch("/api/ai", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          console.log("VOICE RESPONSE:", data);

          if (!data.success) throw new Error(data.error);

          // 👤 USER TEXT
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: "user",
              content: data.text || "🎤 Voice",
              timestamp: new Date(),
            },
          ]);

          // 🤖 AI
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              type: "ai",
              content: data.message,
              timestamp: new Date(),
            },
          ]);

          // 🔊 AUDIO
          if (data.audio) playAudio(data.audio);

        } catch (err) {
          console.error("Voice error:", err);
        } finally {
          setIsLoading(false);
        }
      };

      recorder.start();
      setRecording(true);

      // ⏱ 4 sec recording
      setTimeout(() => {
        recorder.stop();
        setRecording(false);
      }, 4000);

    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background border-l">

      {/* HEADER */}
      <div className="border-b p-3 flex items-center gap-2">
        <BotIcon className="size-4 text-green-500" />
        <div>
          <h3 className="text-sm font-semibold">AI Assistant</h3>
          <p className="text-xs">
            {aiServiceConnected ? "Online 🟢" : "Offline 🔴"}
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="p-3 space-y-2">
        <Button size="sm" onClick={() => sendMessage("Explain problem", "explain")}>
          <ZapIcon className="size-3 mr-1" /> Explain
        </Button>

        <Button size="sm" onClick={() => sendMessage("Give hint", "hint")}>
          <AlertCircleIcon className="size-3 mr-1" /> Hint
        </Button>

        <Button size="sm" onClick={() => sendMessage("Review code", "review")}>
          <CodeIcon className="size-3 mr-1" /> Review
        </Button>
      </div>

      {/* CHAT */}
      <ScrollArea className="flex-1 p-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.type === "user" ? "text-right" : ""}`}>
            <div className="text-xs p-2 rounded bg-muted inline-block">
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && <Loader2Icon className="animate-spin size-4" />}

        <div ref={scrollRef} />
      </ScrollArea>

      {/* INPUT */}
      <div className="p-3 border-t">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />

        <Button className="w-full mt-2" onClick={() => sendMessage(input)}>
          <SendIcon className="size-3 mr-1" />
          Send
        </Button>

        {/* 🎤 VOICE BUTTON */}
        <Button
          onClick={handleVoice}
          className="w-full mt-2 bg-green-600 text-white"
        >
          {recording ? "🎤 Recording..." : "🎤 Speak"}
        </Button>
      </div>
    </div>
  );
}