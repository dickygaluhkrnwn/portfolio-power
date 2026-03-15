"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, User, Bot, Sparkles, Link2 } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link"; // Gunakan next/link untuk navigasi internal yang cepat

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya adalah **AI Assistant** representatif dari Iky. Ada yang bisa saya bantu jelaskan mengenai *skill*, pengalaman, atau [proyek terbaru](/projects) Iky?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- STATE & REF UNTUK FITUR DRAGGABLE ---
  const isDragging = useRef(false);
  const [bounds, setBounds] = useState({ top: -1000, left: -1000, right: 0, bottom: 0 });

  // Update batasan layar agar tombol tidak bisa digeser ke luar window
  useEffect(() => {
    const updateBounds = () => {
      setBounds({
        top: -(window.innerHeight - 100),
        left: -(window.innerWidth - 150),
        right: 0,
        bottom: 0,
      });
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  // Auto-scroll ke bawah saat ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // --- FUNGSI FORMATTER CANGGIH (Markdown Links + JSX + Tables) ---
  const formatMessageContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let tableBuffer: string[] = [];
    let inTable = false;

    // Helper: Parse Bold, Italic & Link
    const parseFormatting = (str: string) => {
      // Split by Link [teks](url) atau Bold **teks** atau Italic *teks*
      const parts = str.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*)/g);
      return parts.map((part, i) => {
        
        // Deteksi Markdown Link
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const label = linkMatch[1];
          const url = linkMatch[2];
          const isExternal = url.startsWith('http');
          
          return (
            <Link 
              key={i} 
              href={url}
              target={isExternal ? '_blank' : '_self'}
              className="text-primary font-bold hover:underline bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 transition-colors inline-flex items-center gap-1 mx-0.5 shadow-sm"
              onClick={() => setIsOpen(false)} // Tutup chat saat link diklik (opsional, bisa dihapus jika ingin chat tetap terbuka)
            >
              {label}
            </Link>
          );
        }

        // Deteksi Bold
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
        }

        // Deteksi Italic
        if (part.startsWith('*') && part.endsWith('*')) {
           return <em key={i} className="italic text-gray-300">{part.slice(1, -1)}</em>;
        }

        // Teks biasa
        return part;
      });
    };

    // Helper: Render Table
    const renderTable = (rows: string[], key: string) => {
      if (rows.length < 3) return null; 
      
      const headerRow = rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
      const dataRows = rows.slice(2).map(row => 
        row.split('|').filter(c => c.trim() !== '').map(c => c.trim())
      );

      return (
        <div key={key} className="my-3 w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] text-xs sm:text-sm">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5">
                <tr>
                  {headerRow.map((h, i) => (
                    <th key={i} className="px-4 py-2.5 font-semibold text-white whitespace-nowrap border-b border-white/10">
                      {parseFormatting(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dataRows.map((row, rI) => (
                  <tr key={rI} className="hover:bg-white/[0.02] transition-colors">
                    {row.map((cell, cI) => (
                      <td key={cI} className="px-4 py-2.5 text-gray-300 align-top">
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
        return; 
      } else if (inTable) {
        elements.push(renderTable(tableBuffer, `table-${index}`));
        tableBuffer = [];
        inTable = false;
      }

      // 2. Heading (###)
      if (trimmedLine.startsWith('### ')) {
        if (currentList.length > 0) {
          elements.push(<ul key={`list-prev-${index}`} className="list-disc pl-5 mb-3 space-y-1.5 text-gray-300">{currentList}</ul>);
          currentList = [];
        }
        elements.push(<h3 key={`h3-${index}`} className="font-bold text-sm text-white mt-5 mb-2 uppercase tracking-widest">{parseFormatting(trimmedLine.replace('### ', ''))}</h3>);
        return;
      }

      // 3. List Items (* atau -)
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const content = trimmedLine.replace(/^[\*\-] /, '');
        currentList.push(<li key={`li-${index}`} className="leading-relaxed pl-1">{parseFormatting(content)}</li>);
        return;
      }

      // 4. Flush List jika baris normal
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${index}`} className="list-disc pl-5 mb-3 space-y-1.5 text-gray-300">{currentList}</ul>);
        currentList = [];
      }

      // 5. Empty Line
      if (trimmedLine === '') {
        elements.push(<div key={`spacer-${index}`} className="h-2.5" />);
        return;
      }

      // 6. Paragraf Normal
      elements.push(<p key={`p-${index}`} className="mb-2.5 leading-relaxed text-gray-300">{parseFormatting(line)}</p>);
    });

    if (inTable && tableBuffer.length > 0) {
      elements.push(renderTable(tableBuffer, `table-end`));
    }
    if (currentList.length > 0) {
      elements.push(<ul key="list-end" className="list-disc pl-5 mb-2 space-y-1.5 text-gray-300">{currentList}</ul>);
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

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.result },
      ]);

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
          "fixed bottom-4 right-4 z-[60] w-[calc(100vw-2rem)] max-w-[400px] h-[550px] max-h-[85vh] flex flex-col rounded-[2rem] border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-3xl shadow-[0_0_50px_-15px_rgba(0,0,0,0.8)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:right-6 sm:bottom-6 overflow-hidden",
          isOpen
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-10 opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Glow effect di belakang header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex-none flex items-center justify-between border-b border-white/5 p-4 md:p-5 bg-white/[0.02] relative z-10">
          <div className="flex items-center gap-3">
            {/* Logo AI: Bot Icon dengan Gradient */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-lg shadow-primary/20 border border-white/10 p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-sm tracking-wide">Iky's Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                  Online
                </p>
              </div>
            </div>
          </div>
          <button
            className="h-8 w-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Area Pesan */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-5 gap-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent min-h-0 relative z-10">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex w-max max-w-[85%] flex-col gap-1.5", 
                msg.role === "user" ? "ml-auto items-end" : "items-start"
              )}
            >
              <div className="flex items-center gap-1.5 opacity-70 px-1">
                {msg.role === "user" ? (
                  <>
                    <span className="text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest">You</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-mono font-medium text-primary uppercase tracking-widest">AI</span>
                  </>
                )}
              </div>
              
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm shadow-md", 
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm shadow-primary/20 border border-primary/50"
                    : "bg-white/5 border border-white/10 text-gray-300 rounded-tl-sm w-full backdrop-blur-sm"
                )}
              >
                {msg.role === "assistant" 
                  ? formatMessageContent(msg.content) 
                  : <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                }
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex w-max max-w-[85%] flex-col gap-1.5 items-start">
              <div className="flex items-center gap-1.5 opacity-70 px-1">
                <Bot className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-mono font-medium text-primary uppercase tracking-widest">AI</span>
              </div>
              <div className="rounded-2xl rounded-tl-sm px-5 py-4 text-sm shadow-md bg-white/5 border border-white/10 backdrop-blur-sm w-fit flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Form */}
        <div className="flex-none border-t border-white/10 p-3 md:p-4 bg-[#050505] relative z-10">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <textarea
              className="flex-1 min-h-[44px] max-h-[120px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none scrollbar-thin scrollbar-thumb-white/10 transition-all placeholder:text-gray-600"
              placeholder="Tanya soal skill, project, layanan..."
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
              className="h-11 w-11 rounded-xl shrink-0 transition-all active:scale-95 bg-primary text-white hover:bg-primary/90 border border-primary/50 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="h-5 w-5 ml-1" />
              <span className="sr-only">Kirim</span>
            </Button>
          </form>
        </div>
      </div>

      {/* --- TOMBOL TRIGGER FLOATING (DRAGGABLE) --- */}
      <motion.button
        drag
        dragConstraints={bounds}
        dragElastic={0.1}
        dragMomentum={false}
        whileHover={!isOpen ? { scale: 1.05 } : {}}
        whileTap={!isOpen ? { scale: 0.95 } : {}}
        onDragStart={() => {
          // Tandai bahwa user sedang melakukan proses drag (menggeser), bukan klik
          isDragging.current = true;
        }}
        onDragEnd={() => {
          // Berikan jeda kecil agar event onClick tidak langsung terpicu setelah dilepas
          setTimeout(() => {
            isDragging.current = false;
          }, 150);
        }}
        onClick={(e) => {
          // Jika user habis nge-drag, batalkan aksi buka chat
          if (isDragging.current) {
            e.preventDefault();
            return;
          }
          setIsOpen(true);
        }}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center gap-3 px-1.5 py-1.5 pr-5 h-14 rounded-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] hover:border-primary/50 hover:bg-[#111]/90 transition-colors duration-500 group outline-none cursor-grab active:cursor-grabbing",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        style={{ touchAction: "none" }} // Mencegah layar ikut ter-scroll saat di-drag di Mobile
      >
        {/* Glow Element */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md -z-10 group-hover:bg-primary/30 transition-colors duration-500 pointer-events-none" />
        
        {/* Icon Container */}
        <div className="relative flex items-center justify-center h-11 w-11 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-inner pointer-events-none">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        
        <span className="font-heading font-bold text-white text-sm tracking-wide pr-1 pointer-events-none select-none">
          Ask AI
        </span>
      </motion.button>
    </>
  );
}