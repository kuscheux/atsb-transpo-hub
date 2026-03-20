"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare, ImagePlus, X, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { sounds } from "@/lib/sounds"

type Message = {
  id: string
  created_at: string
  user_name: string
  message: string
  user_role: "coordinator" | "captain" | "dispatcher" | "driver"
  image_url?: string | null
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

export function RealTimeChat() {
  const [messages, setMessages]       = useState<Message[]>([])
  const [input, setInput]             = useState("")
  const [userName, setUserName]       = useState("")
  const [userRole, setUserRole]       = useState<Message["user_role"]>("coordinator")
  const [error, setError]             = useState("")
  const [pendingImage, setPendingImage] = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)
  const [uploading, setUploading]     = useState(false)
  const userNameRef                   = useRef("")
  const messagesContainerRef          = useRef<HTMLDivElement>(null)
  const fileInputRef                  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_name, user_role")
        .eq("id", user.id)
        .single()

      if (profile) {
        setUserName(profile.user_name)
        setUserRole(profile.user_role as Message["user_role"])
        userNameRef.current = profile.user_name
      }

      fetchMessages()
    }

    init()

    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const msg = payload.new as Message
          setMessages((prev) => [...prev, msg])
          if (msg.user_name !== userNameRef.current) sounds.receive()
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    // Only auto-scroll for incoming messages from others, never on own send
    if (!lastMsg || lastMsg.user_name === userNameRef.current) return
    const el = messagesContainerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
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

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingImage(file)
    setPendingPreview(URL.createObjectURL(file))
    e.target.value = ""
  }

  function clearPendingImage() {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingImage(null)
    setPendingPreview(null)
  }

  async function sendMessage() {
    if (!input.trim() && !pendingImage) return
    const text = input.trim()
    setInput("")
    setUploading(true)
    sounds.send()

    let imageUrl: string | null = null

    if (pendingImage) {
      const ext  = pendingImage.name.split(".").pop() ?? "jpg"
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from("chat-photos")
        .upload(path, pendingImage, { contentType: pendingImage.type, upsert: false })

      if (!uploadErr) {
        const { data } = supabase.storage.from("chat-photos").getPublicUrl(path)
        imageUrl = data.publicUrl
      }
      clearPendingImage()
    }

    try {
      const { error } = await supabase.from("chat_messages").insert({
        user_name: userName,
        message:   text || "",
        user_role: userRole,
        image_url: imageUrl,
      })
      if (error) throw error
    } catch {
      setError("Failed to send.")
    }
    setUploading(false)
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
          <Badge variant="outline" className="ml-auto text-xs font-normal text-green-500 border-green-500/30">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-3 overflow-hidden p-4 pt-0">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
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
                    {msg.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={msg.image_url}
                        alt="attachment"
                        className="rounded-lg max-w-[200px] max-h-[200px] object-cover cursor-pointer"
                        onClick={() => window.open(msg.image_url!, "_blank")}
                      />
                    )}
                    {msg.message && (
                      <div className={`rounded-lg px-3 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        {msg.message}
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
        {/* Pending image preview */}
        {pendingPreview && (
          <div className="relative w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pendingPreview} alt="pending" className="rounded-lg h-16 w-16 object-cover" />
            <button
              onClick={clearPendingImage}
              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Message the crew..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={uploading}
          />
          <Button size="icon" onClick={sendMessage} disabled={(!input.trim() && !pendingImage) || uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
