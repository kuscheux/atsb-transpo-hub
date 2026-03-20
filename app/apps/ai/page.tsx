"use client"

import { useEffect, useRef, useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Send, Bot, RotateCcw, ChevronDown, ChevronRight } from "lucide-react"

type Role = "user" | "assistant"

type ToolUse = {
  name: string
  result: string
}

type Message = {
  role: Role
  content: string
  tools?: ToolUse[]
}

const SUGGESTED = [
  "What's on the call sheet today?",
  "Any pending driver applications?",
  "Search the knowledge base for overtime policy",
  "What calendar events are scheduled today?",
]

export default function AIPage() {
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState("")
  const [loading, setLoading]     = useState(false)
  const messagesEndRef            = useRef<HTMLDivElement>(null)
  const textareaRef               = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading) return
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, loading])

  async function send(text?: string) {
    const userText = (text ?? input).trim()
    if (!userText || loading) return
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    const newMessages: Message[] = [...messages, { role: "user", content: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error("Request failed")
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content ?? "Sorry, I couldn't generate a response.",
          tools: data.tools_used ?? [],
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ])
    }
    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden" style={{ height: "100dvh" }}>
        <header className="flex h-12 items-center gap-2 border-b border-border px-4 shrink-0">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <Bot className="h-4 w-4" />
          <span className="text-sm font-medium">AI Assistant</span>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
              onClick={() => setMessages([])}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New chat
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <Bot className="h-7 w-7 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold">ATSB AI Assistant</h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Ask about the call sheet, driver applications, calendar events, or anything in the knowledge base.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
              {messages.map((msg, i) => (
                <MessageRow key={i} msg={msg} />
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-1 pt-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-border shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
              <textarea
                ref={textareaRef}
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[24px] max-h-[160px]"
                placeholder="Ask anything about ATSB operations…"
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <Button
                size="icon"
                className="h-7 w-7 shrink-0 mb-0.5"
                onClick={() => send()}
                disabled={!input.trim() || loading}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 px-1 text-center">
              Powered by Hugging Face · Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

// ── Message row component ─────────────────────────────────────────────────────
function MessageRow({ msg }: { msg: Message }) {
  const [toolsOpen, setToolsOpen] = useState(false)
  const isUser = msg.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {isUser ? "You" : <Bot className="h-4 w-4" />}
      </div>
      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : ""}`}>
        {/* Tool uses */}
        {!isUser && msg.tools && msg.tools.length > 0 && (
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {toolsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Used {msg.tools.length} tool{msg.tools.length > 1 ? "s" : ""}: {msg.tools.map((t) => t.name).join(", ")}
          </button>
        )}
        {toolsOpen && msg.tools && (
          <div className="space-y-1.5 w-full">
            {msg.tools.map((t, i) => (
              <div key={i} className="rounded-lg border border-border bg-muted/50 px-3 py-2">
                <p className="text-[10px] font-mono font-semibold text-muted-foreground mb-1">{t.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-3">{t.result}</p>
              </div>
            ))}
          </div>
        )}
        {/* Message content */}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        }`}>
          {msg.content}
        </div>
      </div>
    </div>
  )
}
