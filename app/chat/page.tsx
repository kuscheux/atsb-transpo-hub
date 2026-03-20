"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Send, Users, Plus, MessageSquare, ImagePlus, X, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { sounds } from "@/lib/sounds"

type Role = "coordinator" | "captain" | "dispatcher" | "driver"

type Profile = {
  id: string
  user_name: string
  user_role: Role
  avatar_url?: string
}

type Message = {
  id: string
  created_at: string
  user_name: string
  message: string
  user_role: Role
  user_id?: string
  recipient_id?: string | null
  image_url?: string | null
}

type Conversation =
  | { type: "group" }
  | { type: "dm"; profile: Profile }

const roleColors: Record<Role, string> = {
  coordinator: "bg-purple-500",
  captain:     "bg-blue-500",
  dispatcher:  "bg-green-500",
  driver:      "bg-orange-500",
}

const roleLabels: Record<Role, string> = {
  coordinator: "Coordinator",
  captain:     "Captain",
  dispatcher:  "Dispatcher",
  driver:      "Driver",
}

export default function ChatPage() {
  const supabase = createClient()

  const [me, setMe]             = useState<Profile | null>(null)
  const [meAuthId, setMeAuthId] = useState("")
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState("")
  const [activeConv, setActiveConv] = useState<Conversation>({ type: "group" })
  const [showCompose, setShowCompose] = useState(false)

  const [pendingImage, setPendingImage]   = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)
  const [uploading, setUploading]         = useState(false)

  const meRef           = useRef<Profile | null>(null)
  const activeConvRef   = useRef<Conversation>({ type: "group" })
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef     = useRef<HTMLTextAreaElement>(null)
  const fileInputRef    = useRef<HTMLInputElement>(null)

  // ── Load user + team profiles ─────────────────────────────────────────────
  useEffect(() => {
    const supabaseLocal = createClient()
    async function init() {
      const { data: { user } } = await supabaseLocal.auth.getUser()
      if (!user) return

      setMeAuthId(user.id)

      const meta = user.user_metadata ?? {}
      const googleName   = meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? ""
      const googleAvatar = meta.avatar_url ?? meta.picture ?? ""

      const { data: profile } = await supabaseLocal
        .from("profiles")
        .select("user_name, user_role")
        .eq("id", user.id)
        .single()

      const myProfile: Profile = {
        id: user.id,
        user_name: profile?.user_name || googleName,
        user_role: (profile?.user_role as Role) || "coordinator",
        avatar_url: googleAvatar,
      }
      setMe(myProfile)
      meRef.current = myProfile

      const { data: allProfiles } = await supabaseLocal
        .from("profiles")
        .select("user_name, user_role")

      if (allProfiles) {
        const others = allProfiles
          .filter((p) => p.user_name !== myProfile.user_name)
          .map((p, i) => ({
            id: `profile-${i}`,
            user_name: p.user_name,
            user_role: p.user_role as Role,
          }))
        setProfiles(others)
      }
    }
    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Load messages for active conversation ─────────────────────────────────
  const loadMessages = useCallback(async () => {
    const conv = activeConvRef.current
    let query = supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(150)

    if (conv.type === "group") {
      query = query.is("recipient_id", null)
    }

    const { data } = await query
    setMessages((data as Message[]) ?? [])
  }, [supabase])

  useEffect(() => {
    if (!me) return
    activeConvRef.current = activeConv
    loadMessages()
  }, [activeConv, me, loadMessages])

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("chat_page_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const msg = payload.new as Message
          const conv = activeConvRef.current
          const isGroup = conv.type === "group" && !msg.recipient_id
          if (isGroup) {
            setMessages((prev) => [...prev, msg])
            if (msg.user_name !== meRef.current?.user_name) sounds.receive()
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Auto-scroll only for others' messages ─────────────────────────────────
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (!lastMsg || lastMsg.user_name === meRef.current?.user_name) return
    const el = messagesContainerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages])

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

  // ── Send ──────────────────────────────────────────────────────────────────
  async function sendMessage() {
    if (!input.trim() && !pendingImage) return
    if (!me) return
    const text = input.trim()
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
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

    await supabase.from("chat_messages").insert({
      user_name: me.user_name,
      message:   text || "",
      user_role: me.user_role,
      user_id:   meAuthId || null,
      image_url: imageUrl,
    })
    setUploading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  function selectConv(conv: Conversation) {
    setActiveConv(conv)
    setShowCompose(false)
  }

  const convLabel = activeConv.type === "group" ? "Crew Chat" : activeConv.profile.user_name
  const convSub   = activeConv.type === "group"
    ? `${profiles.length + 1} members`
    : roleLabels[activeConv.profile.user_role]

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 min-w-0 overflow-hidden flex-col" style={{ height: "100dvh" }}>
        <header className="flex h-12 items-center gap-2 border-b border-border px-4 shrink-0">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Crew Chat</span>
        </header>

        <div className="flex flex-1 min-h-0">
          {/* ── Left: conversation list ────────────────────────────────── */}
          <div className="hidden md:flex w-60 flex-col border-r border-border shrink-0">
            <div className="flex items-center justify-between px-3 py-3 border-b border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Messages</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowCompose(!showCompose)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {showCompose && profiles.length > 0 && (
              <div className="border-b border-border">
                <p className="text-xs text-muted-foreground px-3 pt-2 pb-1">New message to:</p>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectConv({ type: "dm", profile: p })}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent text-left"
                  >
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarFallback className={`text-[10px] text-white ${roleColors[p.user_role]}`}>
                        {p.user_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{p.user_name}</p>
                      <p className="text-[10px] text-muted-foreground">{roleLabels[p.user_role]}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-1">
              <button
                onClick={() => selectConv({ type: "group" })}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${activeConv.type === "group" ? "bg-accent" : "hover:bg-accent/50"}`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Crew Chat</p>
                  <p className="text-xs text-muted-foreground">{profiles.length + 1} members</p>
                </div>
              </button>

              {profiles.map((p) => {
                const isActive = activeConv.type === "dm" && activeConv.profile.id === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => selectConv({ type: "dm", profile: p })}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/50"}`}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={p.avatar_url} referrerPolicy="no-referrer" />
                      <AvatarFallback className={`text-xs text-white ${roleColors[p.user_role]}`}>
                        {p.user_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.user_name}</p>
                      <p className="text-[10px] text-muted-foreground">{roleLabels[p.user_role]}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Right: message thread ──────────────────────────────────── */}
          <div className="flex flex-1 flex-col min-w-0 min-h-0">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
              {activeConv.type === "group" ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <MessageSquare className="h-4 w-4" />
                </div>
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activeConv.profile.avatar_url} referrerPolicy="no-referrer" />
                  <AvatarFallback className={`text-xs text-white ${roleColors[activeConv.profile.user_role]}`}>
                    {activeConv.profile.user_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="text-sm font-semibold leading-none">{convLabel}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{convSub}</p>
              </div>
              <Badge variant="outline" className="ml-auto text-[10px] text-green-500 border-green-500/30">Live</Badge>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
            >
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No messages yet. Start the conversation.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.user_name === me?.user_name
                  const initials = msg.user_name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                  return (
                    <div key={msg.id} className={`group flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                        <AvatarFallback className={`text-xs text-white ${roleColors[msg.user_role]}`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? "items-end" : ""}`}>
                        <div className={`flex items-baseline gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                          <span className="text-xs font-semibold">{msg.user_name}</span>
                          <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        {msg.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={msg.image_url}
                            alt="attachment"
                            className="rounded-2xl max-w-[260px] max-h-[260px] object-cover cursor-pointer"
                            onClick={() => window.open(msg.image_url!, "_blank")}
                          />
                        )}
                        {msg.message && (
                          <div
                            className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                              isMe
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-muted text-foreground rounded-tl-sm"
                            }`}
                          >
                            {msg.message}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="px-4 py-3 border-t border-border shrink-0">
              {/* Pending image preview */}
              {pendingPreview && (
                <div className="relative w-fit mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pendingPreview} alt="pending" className="rounded-xl h-20 w-20 object-cover" />
                  <button
                    onClick={clearPendingImage}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 mb-0.5"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                </Button>
                <textarea
                  ref={textareaRef}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[24px] max-h-[160px]"
                  placeholder={`Message ${activeConv.type === "group" ? "the crew" : activeConv.profile.user_name}…`}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  disabled={uploading}
                />
                <Button
                  size="icon"
                  className="h-7 w-7 shrink-0 mb-0.5"
                  onClick={sendMessage}
                  disabled={(!input.trim() && !pendingImage) || uploading}
                >
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
