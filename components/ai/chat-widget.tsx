"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, User, Bot, Loader2, Sparkles } from "lucide-react"; // Hapus MessageSquareText, gunakan Bot
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya adalah asisten digital Dicky. Ada yang bisa saya bantu jelaskan mengenai pengalaman atau proyek Dicky?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah saat ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // --- FUNGSI FORMATTER CANGGIH (Markdown to JSX + Tables) ---
  const formatMessageContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let tableBuffer: string[] = [];
    let inTable = false;

    // Helper: Parse Bold & Italic
    const parseFormatting = (str: string) => {
      // Split by bold (**...**) and italic (*...*)
      const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
           return <em key={i} className="italic">{part.slice(1, -1)}</em>;
        }
        return part;
      });
    };

    // Helper: Render Table
    const renderTable = (rows: string[], key: string) => {
      if (rows.length < 3) return null; // Min: Header, Separator, 1 Data Row
      
      const headerRow = rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
      const dataRows = rows.slice(2).map(row => 
        row.split('|').filter(c => c.trim() !== '').map(c => c.trim())
      );

      return (
        <div key={key} className="my-3 w-full overflow-hidden rounded-lg border bg-background/50 text-xs sm:text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-primary/10">
                <tr>
                  {headerRow.map((h, i) => (
                    <th key={i} className="px-3 py-2 font-semibold text-foreground whitespace-nowrap">
                      {parseFormatting(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {dataRows.map((row, rI) => (
                  <tr key={rI} className="hover:bg-muted/30 transition-colors">
                    {row.map((cell, cI) => (
                      <td key={cI} className="px-3 py-2 text-muted-foreground align-top">
                        {parseFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    // Main Loop
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // 1. Deteksi Tabel
      if (trimmedLine.startsWith('|')) {
        inTable = true;
        tableBuffer.push(trimmedLine);
        return; // Skip processing lain, kumpulkan baris tabel
      } else if (inTable) {
        // Jika ketemu baris bukan tabel, render tabel yg terkumpul
        elements.push(renderTable(tableBuffer, `table-${index}`));
        tableBuffer = [];
        inTable = false;
      }

      // 2. Heading (###)
      if (trimmedLine.startsWith('### ')) {
        if (currentList.length > 0) {
          elements.push(<ul key={`list-prev-${index}`} className="list-disc pl-5 mb-3 space-y-1">{currentList}</ul>);
          currentList = [];
        }
        elements.push(<h3 key={`h3-${index}`} className="font-bold text-sm mt-4 mb-2 uppercase tracking-wide opacity-90">{parseFormatting(trimmedLine.replace('### ', ''))}</h3>);
        return;
      }

      // 3. List Items (* atau -)
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const content = trimmedLine.replace(/^[\*\-] /, '');
        currentList.push(<li key={`li-${index}`} className="leading-relaxed">{parseFormatting(content)}</li>);
        return;
      }

      // 4. Flush List jika baris normal
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${index}`} className="list-disc pl-5 mb-3 space-y-1">{currentList}</ul>);
        currentList = [];
      }

      // 5. Empty Line
      if (trimmedLine === '') {
        elements.push(<div key={`spacer-${index}`} className="h-2" />);
        return;
      }

      // 6. Paragraf Normal
      elements.push(<p key={`p-${index}`} className="mb-2 leading-relaxed">{parseFormatting(line)}</p>);
    });

    // Flush sisa tabel atau list di akhir
    if (inTable && tableBuffer.length > 0) {
      elements.push(renderTable(tableBuffer, `table-end`));
    }
    if (currentList.length > 0) {
      elements.push(<ul key="list-end" className="list-disc pl-5 mb-2 space-y-1">{currentList}</ul>);
    }

    return <div className="text-sm">{elements}</div>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages = [
      ...messages,
      { role: "user" as const, content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        let errorMessage = "Gagal mengirim pesan.";
        try {
          const errorData = await response.json();
          if (errorData.error) errorMessage = errorData.error;
        } catch { }
        throw new Error(errorMessage);
      }

      if (!response.body) return;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        accumulatedResponse += chunkValue;

        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessageIndex = updatedMessages.length - 1;
          updatedMessages[lastMessageIndex] = {
            role: "assistant",
            content: accumulatedResponse,
          };
          return updatedMessages;
        });
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Maaf, terjadi kesalahan: ${error.message || "Silakan coba lagi nanti."}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Jendela Chat */}
      <div
        className={cn(
          "fixed bottom-24 right-4 z-50 w-[90vw] max-w-[400px] rounded-xl border bg-background shadow-2xl transition-all duration-300 ease-in-out sm:right-8 sm:bottom-28",
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-10 opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 bg-muted/30 rounded-t-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {/* Logo AI: Diganti ke Bot Icon agar lebih jelas */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-purple-500 shadow-sm border border-white/20">
              <Bot className="h-5 w-5 text-white fill-white/20" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Dicky's AI Assistant</h3>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Powered by Gemini
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Area Pesan */}
        <div className="flex h-[400px] flex-col overflow-y-auto p-4 gap-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex w-max max-w-[90%] flex-col gap-1", // Diperlebar sedikit agar tabel muat
                msg.role === "user" ? "ml-auto items-end" : "items-start"
              )}
            >
              <div className="flex items-center gap-2 opacity-70 mb-1 px-1">
                {msg.role === "user" ? (
                  <>
                    <span className="text-[10px] font-medium uppercase tracking-wider">You</span>
                    <User className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    <Bot className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">AI Assistant</span>
                  </>
                )}
              </div>
              
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm shadow-sm overflow-hidden", // Overflow hidden penting untuk tabel
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted/50 border border-muted-foreground/10 text-foreground rounded-tl-sm w-full"
                )}
              >
                {msg.role === "assistant" 
                  ? formatMessageContent(msg.content) 
                  : <div className="whitespace-pre-wrap">{msg.content}</div>
                }
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1].role === "user" && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm p-2 ml-1">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
              </div>
              <span className="text-xs">Sedang mengetik...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t p-3 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-b-xl">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <textarea
              className="flex-1 min-h-[44px] max-h-[120px] bg-muted/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none scrollbar-hide"
              placeholder="Tanya tentang skill, project, atau pengalaman..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
              rows={1}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              className="h-11 w-11 rounded-xl shrink-0 transition-all active:scale-95"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Kirim</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Tombol Trigger Floating */}
      <Button
        size="lg"
        className={cn(
          "fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-xl transition-all duration-500 z-40 sm:right-8 hover:scale-105 hover:shadow-2xl hover:bg-primary/90",
          isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-8 w-8" />
        <span className="sr-only">Buka Chat AI</span>
      </Button>
    </>
  );
}