/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "ai"; text: string };

const backendBase =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";

function renderTextWithLinks(text: string) {
  // split by whitespace and convert urls to anchors
  return text.split(/(\s+)/).map((part, i) => {
    const urlMatch = part.match(/https?:\/\/[^\s"]+/);
    if (urlMatch) {
      return (
        <a
          key={i}
          href={urlMatch[0]}
          target="_blank"
          rel="noreferrer"
          className="underline text-primary"
        >
          {urlMatch[0]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export const AIChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Msg[]>([]); // send last N to backend
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll chat body to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const highlightFoods = (ids: string[]) => {
    ids.forEach((id, i) => {
      const el = document.getElementById(`food-${id}`);
      if (!el) return;
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ai-highlight");
        setTimeout(() => el.classList.remove("ai-highlight"), 4000);
      }, i * 350);
    });
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Msg = { role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setHistory((h) => [...h, userMsg].slice(-8)); // keep last 8
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${backendBase}/ai/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json();
      const aiText: string = data?.reply ?? "No suggestions.";
      const ids: string[] = Array.isArray(data?.ids) ? data.ids : [];

      const aiMsg: Msg = { role: "ai", text: aiText };
      setMessages((m) => [...m, aiMsg]);
      setHistory((h) => [...h, aiMsg].slice(-8));

      // highlight results
      if (ids.length) highlightFoods(ids);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "AI unavailable. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.key === "Enter" && sendMessage();

  return (
    <>
      {/* Floating circle button */}
      <button
        aria-label={open ? "Close assistant" : "Open assistant"}
        onClick={() => setOpen((s) => !s)}
        className="fixed z-50 right-5 bottom-5 w-12 h-12 rounded-full bg-primary text-white grid place-items-center shadow-lg hover:scale-105 transition-transform"
      >
        {!open ? "AI" : "✕"}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={containerRef}
          className="fixed right-5 bottom-20 w-[320px] max-w-[92vw] bg-background border border-border rounded-xl shadow-xl flex flex-col z-50"
        >
          <div className="px-4 py-2 font-semibold border-b flex justify-between items-center">
            <span>Food Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground"
            >
              Close
            </button>
          </div>

          <div
            ref={scrollRef}
            className="p-3 flex-1 overflow-y-auto min-h-[120px] max-h-[320px] text-sm space-y-2"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`inline-block p-2 rounded-md max-w-[85%] break-words ${
                  m.role === "user"
                    ? "bg-primary text-white ml-auto"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "ai" ? renderTextWithLinks(m.text) : m.text}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-muted-foreground">AI typing…</div>
            )}
          </div>

          <div className="flex items-center gap-2 px-2 py-2 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onEnter}
              placeholder="Ask about food (e.g. no spicy, high protein)"
              className="flex-1 text-sm outline-none bg-transparent"
            />
            <button
              onClick={sendMessage}
              className="px-3 py-1 text-sm rounded-md font-medium text-white bg-primary disabled:opacity-50"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};
