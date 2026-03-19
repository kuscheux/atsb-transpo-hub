"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare, Plug } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { sounds } from "@/lib/sounds"

type Message = {
  id: string
  created_at: string
  user_name: string
  message: string
  user_role: "coordinator" | "captain" | "dispatcher" | "driver"
}

const roleColors: Record<Message["user_role"], string> = {
  coordinator: "bg-purple-500",
  captain: "bg-blue-500",
  dispatcher: "bg-green-500",
  driver: "bg-orange-500",
}

const roleLabels: Record<Message["user_role"], string> = {
  coordinator: "Coordinator",
  captain: "Captain",
  dispatcher: "Dispatcher",
  driver: "Driver",
}

// Demo messages shown when Supabase isn't configured
const demoMessages: Message[] = [
  { id: "1", created_at: new Date(Date.now() - 3600000).toISOString(), user_name: "Jack Herrin", message: "All units check in — base camp is set.", user_role: "captain" },
  { id: "2", created_at: new Date(Date.now() - 1800000).toISOString(), user_name: "Taylor Evanoff", message: "Van #1 and Van #2 are at holding. Van #3 en route.", user_role: "dispatcher" },
  { id: "3", created_at: new Date(Date.now() - 900000).toISOString(), user_name: "Donny Thrift", message: "Copy that. Fuel truck topped off at 0600.", user_role: "coordinator" },
]

export function RealTimeChat() {
  const [messages, setMessages] = useState<Message[]>(isSupabaseConfigured ? [] : demoMessages)
  const [input, setInput] = useState("")
  const [userName] = useState("Donny Thrift")
  const [userRole] = useState<Message["user_role"]>("coordinator")
  const [error, setError] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    fetchMessages()

    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const msg = payload.new as Message
          setMessages((prev) => [...prev, msg])
          if (msg.user_name !== userName) sounds.receive()
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100)
      if (error) throw error
      setMessages((data as Message[]) ?? [])
    } catch {
      setError("Could not load messages.")
    }
  }

  async function sendMessage() {
    if (!input.trim()) return
    const text = input.trim()
    setInput("")

    sounds.send()

    if (!isSupabaseConfigured) {
      // Local demo mode
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        user_name: userName,
        message: text,
        user_role: userRole,
      }])
      return
    }

    try {
      const { error } = await supabase.from("chat_messages").insert({
        user_name: userName,
        message: text,
        user_role: userRole,
      })
      if (error) throw error
    } catch {
      setError("Failed to send.")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          Crew Chat
          <Badge
            variant="outline"
            className={`ml-auto text-xs font-normal ${isSupabaseConfigured ? "text-green-500 border-green-500/30" : "text-yellow-500 border-yellow-500/30"}`}
          >
            {isSupabaseConfigured ? "Live" : "Demo"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-3 overflow-hidden p-4 pt-0">
        {!isSupabaseConfigured && (
          <div className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-500">
            <Plug className="h-3 w-3 shrink-0" />
            Add Supabase credentials to enable live chat
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((msg) => {
              const initials = msg.user_name.split(" ").map((n) => n[0]).join("").slice(0, 2)
              const isMe = msg.user_name === userName
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className={`text-xs text-white ${roleColors[msg.user_role]}`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col gap-0.5 max-w-[75%] ${isMe ? "items-end" : ""}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">{msg.user_name}</span>
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                        {roleLabels[msg.user_role]}
                      </Badge>
                    </div>
                    <div className={`rounded-lg px-3 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Message the crew..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={sendMessage} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
