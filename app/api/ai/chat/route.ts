import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// ── Tool definitions ──────────────────────────────────────────────────────────
type ToolName = "get_today_events" | "get_driver_applications" | "get_call_sheet" | "search_knowledge_base" | "read_gmail_emails" | "read_imessages"

const tools = [
  {
    type: "function",
    function: {
      name: "get_today_events",
      description: "Get today's production calendar events (shoots, meetings, travel, fittings)",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_driver_applications",
      description: "Get pending driver job applications",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_call_sheet",
      description: "Get the current ATSB call sheet showing drivers, vehicles, and rates",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "search_knowledge_base",
      description: "Search the local knowledge base for policy, procedure, or reference information",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search term" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_gmail_emails",
      description: "Read recent transpo-relevant Gmail emails (only works if Gmail is connected in Settings)",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "read_imessages",
      description: "Read recent iMessage texts related to transportation (only works locally with ENABLE_IMESSAGES=true)",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
]

// ── Tool executors ────────────────────────────────────────────────────────────
async function executeTool(name: ToolName, args: Record<string, string>) {
  const supabase = await createClient()

  if (name === "get_today_events") {
    const today = new Date().toISOString().split("T")[0]
    const { data } = await supabase
      .from("calendar_events")
      .select("title, event_date, event_type, notes")
      .eq("event_date", today)
      .order("event_date", { ascending: true })
    return data?.length ? JSON.stringify(data) : "No events scheduled for today."
  }

  if (name === "get_driver_applications") {
    const { data } = await supabase
      .from("driver_applications")
      .select("driver_name, phone_number, status, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10)
    return data?.length ? JSON.stringify(data) : "No pending applications."
  }

  if (name === "get_call_sheet") {
    // Import static call sheet data
    const mod = await import("@/lib/call-sheet-data")
    return JSON.stringify(mod.callSheetData?.slice(0, 10) ?? "Call sheet data unavailable.")
  }

  if (name === "search_knowledge_base") {
    const { data } = await supabase
      .from("knowledge_items")
      .select("title, content, category")
      .ilike("content", `%${args.query ?? ""}%`)
      .limit(5)
    return data?.length ? JSON.stringify(data) : "No matching knowledge base entries."
  }

  if (name === "read_gmail_emails") {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
      const res = await fetch(`${baseUrl}/api/integrations/gmail/messages`)
      if (!res.ok) return "Gmail not connected. Ask the user to connect Gmail in Settings → Integrations."
      const data = await res.json()
      return JSON.stringify(data.emails ?? [])
    } catch {
      return "Could not fetch Gmail emails."
    }
  }

  if (name === "read_imessages") {
    if (process.env.ENABLE_IMESSAGES !== "true") {
      return "iMessage is not enabled. Set ENABLE_IMESSAGES=true in .env.local and restart the dev server."
    }
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
      const res = await fetch(`${baseUrl}/api/tools/imessages`)
      if (!res.ok) {
        const err = await res.json()
        return `iMessage error: ${err.detail ?? err.error}`
      }
      const data = await res.json()
      return JSON.stringify(data.messages ?? [])
    } catch {
      return "Could not read iMessages."
    }
  }

  return "Unknown tool."
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

    const systemPrompt = `You are an intelligent assistant for ATSB Transportation and Teamsters Local 728.
Today is ${today}. You help coordinators, captains, dispatchers, and drivers with production transportation tasks.
You have access to tools to look up live data: calendar events, driver applications, the call sheet, and a knowledge base.
Be concise and professional. Use the available tools when the user asks about real data.`

    // Build message history for HuggingFace
    const hfMessages = [
      { role: "system" as const, content: systemPrompt },
      ...(messages as { role: "user" | "assistant"; content: string }[]),
    ]

    // First call — may include tool calls
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: hfMessages,
      tools: tools as Parameters<typeof hf.chatCompletion>[0]["tools"],
      max_tokens: 1024,
    })

    const choice = response.choices[0]
    const msg = choice.message

    // If tool calls requested, execute them and get final response
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      const toolResults = await Promise.all(
        msg.tool_calls.map(async (tc) => {
          const args = typeof tc.function.arguments === "string"
            ? JSON.parse(tc.function.arguments)
            : tc.function.arguments
          const result = await executeTool(tc.function.name as ToolName, args)
          return {
            toolName: tc.function.name,
            result,
            toolCallId: tc.id,
          }
        })
      )

      // Second call with tool results
      const messagesWithTools = [
        ...hfMessages,
        { role: "assistant" as const, content: msg.content ?? "", tool_calls: msg.tool_calls },
        ...toolResults.map((tr) => ({
          role: "tool" as const,
          content: tr.result,
          tool_call_id: tr.toolCallId,
        })),
      ]

      const finalResponse = await hf.chatCompletion({
        model: "Qwen/Qwen2.5-72B-Instruct",
        messages: messagesWithTools,
        max_tokens: 1024,
      })

      return NextResponse.json({
        content: finalResponse.choices[0].message.content,
        tools_used: toolResults.map((t) => ({ name: t.toolName, result: t.result })),
      })
    }

    return NextResponse.json({
      content: msg.content,
      tools_used: [],
    })
  } catch (err) {
    console.error("AI chat error:", err)
    return NextResponse.json({ error: "AI request failed" }, { status: 500 })
  }
}
