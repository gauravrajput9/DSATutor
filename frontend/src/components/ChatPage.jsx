import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Bot,
  Clock3,
  MessageSquare,
  PanelLeft,
  Plus,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MessageBubble from "./messageBubble";

const SUGGESTED_PROMPTS = [
  "Explain binary search with intuition and a dry run.",
  "Compare BFS and DFS with use cases and complexity.",
  "Give me the optimal solution for Two Sum in JavaScript.",
  "How do I detect a cycle in a linked list?",
];

const createMessage = (role, text) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  text,
});

const formatSessionTime = (value) => {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export default function ChatPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);

  const activeSession = sessions.find((session) => session.id === activeSessionId);

  const getSessionPreview = (session) => {
    const userMessages = (session.messages || []).filter(
      (entry) => entry.role === "user"
    );

    return (
      userMessages[userMessages.length - 1]?.text ||
      session.messages?.[0]?.text ||
      "Open chat"
    );
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const syncActiveSession = (sessionId, nextMessages) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: nextMessages,
              title:
                session.title && session.title !== "New chat"
                  ? session.title
                  : nextMessages.find((entry) => entry.role === "user")?.text?.slice(0, 60) ||
                    "New chat",
              lastMessageAt: new Date().toISOString(),
            }
          : session
      )
    );
  };

  const loadSessions = async () => {
    setHistoryLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/sessions", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Could not load previous chats.");
      }

      const data = await res.json();
      const loadedSessions = (data.sessions || []).map((session) => ({
        ...session,
        id: String(session.id),
        messages: (session.messages || []).map((entry) => ({
          id: String(entry.id || `${entry.role}-${Math.random()}`),
          role: entry.role,
          text: entry.text,
        })),
      }));

      setSessions(loadedSessions);

      if (loadedSessions.length) {
        setActiveSessionId((current) => current || loadedSessions[0].id);
        setMessages((current) =>
          current.length ? current : loadedSessions[0].messages || []
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to load chat history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      220
    )}px`;
  }, [message]);

  const handleSelectSession = (session) => {
    setActiveSessionId(session.id);
    setMessages(session.messages || []);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setMessage("");
    toast.success("Started a fresh chat.");
  };

  const streamResponse = async (prompt) => {
    const userMessage = createMessage("user", prompt);
    const botMessage = createMessage("bot", "");
    const nextMessages = [...messages, userMessage, botMessage];

    setMessages(nextMessages);
    if (activeSessionId) {
      syncActiveSession(activeSessionId, nextMessages);
    }
    setMessage("");
    setLoading(true);

    const loadingToast = toast.loading("DSA Bot is working on your answer...");

    try {
      const res = await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          message: prompt,
          sessionId: activeSessionId,
          history: messages,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok || !res.body) {
        let errorMessage = "Could not generate a response.";

        try {
          const data = await res.json();
          errorMessage = data.message || errorMessage;
        } catch {
          // Ignore JSON parsing failures for streamed responses.
        }

        throw new Error(errorMessage);
      }

      const sessionId = res.headers.get("X-Chat-Session-Id");
      if (sessionId && !activeSessionId) {
        const newSession = {
          id: sessionId,
          title: prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt,
          messages: nextMessages,
          lastMessageAt: new Date().toISOString(),
        };

        setActiveSessionId(sessionId);
        setSessions((prev) => [newSession, ...prev.filter((item) => item.id !== sessionId)]);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let done = false;
      const resolvedSessionId = sessionId || activeSessionId;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        accumulated += decoder.decode(value || new Uint8Array(), {
          stream: !doneReading,
        });

        setMessages((prev) => {
          const updated = prev.map((entry) =>
            entry.id === botMessage.id ? { ...entry, text: accumulated } : entry
          );

          if (resolvedSessionId) {
            syncActiveSession(resolvedSessionId, updated);
          }

          return updated;
        });
      }

      if (!accumulated.trim()) {
        throw new Error("The response came back empty.");
      }

      toast.success("Answer ready.", { id: loadingToast });
      await loadSessions();
    } catch (error) {
      const fallback =
        error.message || "Something went wrong while generating the answer.";

      setMessages((prev) =>
        prev.map((entry) =>
          entry.id === botMessage.id
            ? {
                ...entry,
                text: `## Unable to answer right now\n\n${fallback}\n\nPlease try again in a moment.`,
              }
            : entry
        )
      );

      toast.error(fallback, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (promptOverride) => {
    const prompt = (promptOverride ?? message).trim();

    if (loading) {
      toast.info("Please wait for the current answer to finish.");
      return;
    }

    if (!prompt) {
      toast.warning("Enter a DSA question before sending.");
      return;
    }

    toast.info("Question sent.");
    await streamResponse(prompt);
  };

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(87,98,255,0.18),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#0a1220_46%,_#071019_100%)] text-slate-100">
      <div className="mx-auto flex h-screen max-w-[1700px] overflow-hidden">
        <aside
          className={`chat-shell hidden h-screen shrink-0 border-r border-white/8 bg-slate-950/55 backdrop-blur-xl lg:flex ${
            sidebarOpen ? "w-[300px]" : "w-[92px]"
          } flex-col transition-[width] duration-300`}
        >
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-4">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
              aria-label="Toggle sidebar"
            >
              <PanelLeft size={18} />
            </button>

            {sidebarOpen && (
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">
                  Focused Mode
                </p>
                <h1 className="text-lg font-semibold text-white">DSA Bot</h1>
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-5">
            <button
              type="button"
              onClick={handleNewChat}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-sky-400"
            >
              <Plus size={18} />
              {sidebarOpen && <span>New chat</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                toast.info("Returning to the home page.");
                navigate("/");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-slate-200 transition hover:bg-white/10"
            >
              <MessageSquare size={18} />
              {sidebarOpen && <span>Home</span>}
            </button>

            {sidebarOpen && (
              <>
                <section className="rounded-[28px] border border-white/8 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-sky-200">
                    <Sparkles size={16} />
                    Prompt ideas
                  </div>
                  <div className="space-y-2">
                    {SUGGESTED_PROMPTS.slice(0, 3).map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => {
                          setMessage(prompt);
                          toast.info("Prompt added to the composer.");
                        }}
                        className="w-full rounded-2xl border border-white/8 bg-slate-900/70 px-3 py-3 text-left text-sm text-slate-300 transition hover:border-sky-300/30 hover:bg-slate-900"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/8 bg-white/5 p-4 text-sm leading-6 text-slate-400">
                  The sidebar now stays fixed while you scroll the chat. Your older
                  conversations are available in the history panel beside the chat
                  window.
                </section>
              </>
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 overflow-hidden">
          <section className="hidden h-screen w-[280px] shrink-0 border-r border-white/8 bg-slate-950/30 lg:flex lg:flex-col">
            <div className="border-b border-white/8 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-200/60">
                Previous Chats
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Conversation history
              </h2>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {historyLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-[24px] border border-white/8 bg-white/5 p-4"
                    >
                      <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/8" />
                      <div className="mt-3 h-3 w-1/3 animate-pulse rounded-full bg-white/6" />
                    </div>
                  ))}
                </div>
              ) : sessions.length ? (
                <div className="space-y-3">
                  {sessions.map((session) => {
                    const preview = getSessionPreview(session);

                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => handleSelectSession(session)}
                        className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                          session.id === activeSessionId
                            ? "border-sky-300/40 bg-sky-300/10"
                            : "border-white/8 bg-white/5 hover:bg-white/8"
                        }`}
                      >
                        <p className="line-clamp-2 text-sm font-medium text-white">
                          {session.title}
                        </p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                          {preview}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                          <Clock3 size={12} />
                          {formatSessionTime(session.lastMessageAt || session.updatedAt)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/10 bg-white/4 p-5 text-sm leading-6 text-slate-400">
                  No previous chats yet. Start a conversation and it will appear here
                  automatically.
                </div>
              )}
            </div>
          </section>

          <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header className="shrink-0 border-b border-white/8 bg-slate-950/35 px-4 py-4 backdrop-blur-xl sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-200/65">
                    DSA Assistant
                  </p>
                  <h2 className="text-lg font-semibold text-white">
                    {activeSession?.title ||
                      "Clear, structured answers for coding interviews"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleNewChat}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 transition hover:bg-white/10"
                >
                  <Plus size={16} />
                  New chat
                </button>
              </div>
            </header>

            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto px-4 pb-36 pt-6 sm:px-6"
            >
              <div className="mx-auto flex max-w-5xl flex-col gap-6">
                {messages.length === 0 ? (
                  <section className="chat-shell overflow-hidden rounded-[32px] border border-white/8 bg-slate-950/35 p-8 shadow-2xl shadow-slate-950/30">
                    <div className="mb-8 max-w-3xl">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sm text-sky-100">
                        <Sparkles size={14} />
                        Modern DSA chat workspace
                      </div>
                      <h3 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        Ask one solid DSA question and get a cleaner, interview-ready
                        answer back.
                      </h3>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                        This bot stays focused on data structures and algorithms,
                        explains intuition, highlights complexity, and now keeps your
                        earlier chats available in a dedicated history panel.
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSend(prompt)}
                          className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 text-left transition hover:border-sky-300/30 hover:bg-white/[0.06]"
                        >
                          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/12 text-sky-200">
                            <MessageSquare size={18} />
                          </div>
                          <p className="text-base font-medium text-white">{prompt}</p>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : (
                  messages.map((msg, index) => (
                    <MessageBubble
                      key={msg.id ?? index}
                      role={msg.role}
                      text={msg.text}
                      loading={loading && msg.role === "bot" && !msg.text.trim()}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-white/8 bg-slate-950/45 px-4 py-4 backdrop-blur-2xl sm:px-6">
              <div className="mx-auto max-w-5xl">
                <div className="chat-shell rounded-[30px] border border-white/10 bg-slate-950/70 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                  <div className="flex items-end gap-3">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Ask about arrays, recursion, dynamic programming, graphs, trees..."
                      className="max-h-[220px] min-h-[56px] flex-1 resize-none bg-transparent px-3 py-3 text-[15px] leading-7 text-white outline-none placeholder:text-slate-500"
                      rows={1}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          handleSend();
                        }
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => handleSend()}
                      disabled={loading}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400 text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-55"
                      aria-label="Send message"
                    >
                      <ArrowUp size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-3 pt-3 text-xs text-slate-400">
                    <p>Enter to send, Shift + Enter for a new line.</p>
                    <p>Only the chat panel scrolls. Sidebar and history stay in place.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
