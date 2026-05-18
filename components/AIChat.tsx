'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Sparkles, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const quickReplies = [
  'أريد عطر شرقي',
  'عطر مناسب كهدية',
  'ما أفضل عروضكم؟',
];

let msgId = 0;
const genId = () => `msg-${++msgId}-${Date.now()}`;

export function AIChat() {
  const pathname = usePathname();

  const excludedPaths = ['/login', '/register', '/admin'];
  const isExcluded = excludedPaths.some((p) => pathname?.startsWith(p));

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: genId(),
      role: 'assistant',
      content: 'مرحباً بك في لوفلي سميل! كيف أساعدك في اختيار عطرك؟',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        scrollRef.current!.scrollTo({
          top: scrollRef.current!.scrollHeight,
          behavior: 'smooth',
        });
      });
    }
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (text?: string) => {
      const userMessage = (text || input).trim();
      if (!userMessage || isLoading) return;

      setInput('');
      setShowQuickReplies(false);

      const userMsg: Message = {
        id: genId(),
        role: 'user',
        content: userMessage,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: userMessage }].map(
              (m) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content,
              })
            ),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response');
        }

        const reader = response.body?.getReader();
        const textDecoder = new TextDecoder();

        let assistantMessage = '';
        const assistantId = genId();
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
          },
        ]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = textDecoder.decode(value);
            assistantMessage += chunk;

            setMessages((prev) => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (updated[lastIdx]?.role === 'assistant') {
                updated[lastIdx] = {
                  ...updated[lastIdx],
                  content: assistantMessage,
                };
              }
              return updated;
            });
          }
        }
      } catch (error) {
        console.error('Chat Error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: genId(),
            role: 'assistant',
            content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  if (isExcluded) return null;

  return (
    <>
      {/* ── Floating Action Button ─────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-[0_4px_24px_-4px_rgba(196,163,110,0.5)] flex items-center justify-center cursor-pointer group"
            style={{
              background: 'linear-gradient(145deg, #C4A36E, #A8864E)',
            }}
            aria-label="فتح المحادثة"
          >
            <Sparkles className="w-6 h-6 text-white transition-transform duration-200 group-hover:rotate-12" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 26,
            }}
            className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col overflow-hidden"
            style={{
              height: 'min(520px, calc(100dvh - 48px))',
              borderRadius: '20px',
              background: '#FDFAF5',
              boxShadow:
                '0 20px 60px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(196,163,110,0.12)',
            }}
          >
            {/* ─ Header ─ */}
            <div
              className="relative flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{
                background: 'linear-gradient(145deg, #2C2C2C 0%, #1a1a1a 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C4A36E]/20 flex items-center justify-center">
                  <Sparkles className="w-[18px] h-[18px] text-[#C4A36E]" />
                </div>
                <div>
                  <h3 className="font-sans text-[13px] font-semibold text-white tracking-wide">
                    مساعد لوفلي سميل
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-sans text-[10px] text-white/50 tracking-wider">
                      متصل الآن
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="إغلاق المحادثة"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* ─ Messages ─ */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              data-lenis-prevent="true"
              style={{
                scrollBehavior: 'smooth',
                overscrollBehavior: 'contain',
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                  dir="rtl"
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 text-[13px] leading-[1.7] font-sans ${
                      msg.role === 'user'
                        ? 'bg-[#C4A36E] text-white rounded-[16px] rounded-tr-[4px]'
                        : 'bg-white text-[#2C2C2C] rounded-[16px] rounded-tl-[4px] border border-black/[0.05] shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading &&
                messages[messages.length - 1]?.content === '' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                    dir="rtl"
                  >
                    <div className="bg-white px-4 py-3 rounded-[16px] rounded-tl-[4px] border border-black/[0.05] flex items-center gap-[5px]">
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: 'easeInOut',
                        }}
                        className="w-[5px] h-[5px] bg-[#C4A36E] rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: 'easeInOut',
                          delay: 0.2,
                        }}
                        className="w-[5px] h-[5px] bg-[#C4A36E] rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: 'easeInOut',
                          delay: 0.4,
                        }}
                        className="w-[5px] h-[5px] bg-[#C4A36E] rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
            </div>

            {/* ─ Quick Replies ─ */}
            <AnimatePresence>
              {showQuickReplies && messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-2 flex-shrink-0 overflow-hidden"
                  dir="rtl"
                >
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-[11px] font-sans text-[#755A2C] bg-[#C4A36E]/[0.08] border border-[#C4A36E]/20 rounded-full hover:bg-[#C4A36E]/[0.15] hover:border-[#C4A36E]/30 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─ Input Area ─ */}
            <div className="px-4 py-3 border-t border-black/[0.05] bg-white flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
                dir="rtl"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 bg-[#F5F1EA] rounded-full px-4 py-2.5 text-[13px] font-sans text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:ring-[1.5px] focus:ring-[#C4A36E]/40 transition-shadow duration-200 disabled:opacity-50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background:
                      input.trim() && !isLoading
                        ? 'linear-gradient(145deg, #C4A36E, #A8864E)'
                        : '#E8E2D9',
                  }}
                  aria-label="إرسال"
                >
                  {isLoading ? (
                    <Loader2 className="w-[18px] h-[18px] text-white animate-spin" />
                  ) : (
                    <Send className="w-[18px] h-[18px] text-white rtl:rotate-180" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
