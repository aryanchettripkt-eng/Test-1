import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Memory, Album, getAI } from '../lib/gemini';

interface SmartChatProps {
  memories: Memory[];
  onSuggestAlbum: (album: Album) => void;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  isAction?: boolean;
}

export default function SmartChat({ memories, onSuggestAlbum }: SmartChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm your Reminiq companion. I can help you find specific memories or sort them into new albums. What's on your mind?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = getAI();
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{
              text: `You are a helpful AI assistant for a personal memory journal app called Reminiq. 
              The user wants to interact with their memories.
              
              Current Memories: ${JSON.stringify(memories.map(m => ({ id: m.id, title: m.title, desc: m.desc, mood: m.mood, date: m.date })))}
              
              User Request: "${userMsg}"
              
              If the user wants to "sort", "group", or "create an album" based on some criteria (e.g., "group my travel photos" or "sort by happy moments"), you should return a JSON object representing a new album.
              
              Response Format:
              If creating an album, return ONLY a JSON object with this structure:
              {
                "action": "create_album",
                "album": {
                  "title": "Album Title",
                  "memoryIds": ["id1", "id2"],
                  "journalText": "A short poetic summary of these memories."
                },
                "message": "A friendly message explaining what you did."
              }
              
              If just chatting, return:
              {
                "action": "chat",
                "message": "Your response message here."
              }
              
              Keep your tone poetic, nostalgic, and warm.`
            }]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text);

      if (data.action === 'create_album') {
        const newAlbum: Album = {
          id: Math.random().toString(36).substr(2, 9),
          ...data.album
        };
        onSuggestAlbum(newAlbum);
        setMessages(prev => [...prev, { role: 'bot', content: data.message, isAction: true }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: data.message }]);
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage = error.message?.includes("API Key") 
        ? "I need a valid Gemini API key to help you. Please check your settings (gear icon)."
        : "I'm sorry, I had a bit of trouble recalling that. Could you try again?";
      setMessages(prev => [...prev, { role: 'bot', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-[10001] w-14 h-14 bg-dark-brown text-cream rounded-full shadow-2xl flex items-center justify-center border border-light-brown/20"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-6 z-[10001] w-[350px] h-[500px] bg-warm-white border border-light-brown/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-dark-brown text-cream flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-moss flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <div className="font-serif italic text-lg leading-none">Reminiq Companion</div>
                <div className="font-hand text-[10px] opacity-60 tracking-widest uppercase">Always listening</div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl font-hand text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-moss text-cream rounded-tr-none' 
                      : 'bg-parchment text-dark-brown border border-light-brown/10 rounded-tl-none'
                  } ${msg.isAction ? 'border-2 border-sage' : ''}`}>
                    {msg.isAction && <Sparkles size={12} className="inline mr-1 text-sage" />}
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-parchment p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-moss" />
                    <span className="font-hand text-xs text-brown/60 italic">Recalling...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-cream border-t border-light-brown/10 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Sort my happy memories..."
                className="flex-1 bg-parchment/50 border border-light-brown/20 rounded-full px-4 py-2 font-hand text-sm outline-none focus:border-moss/40 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="w-10 h-10 bg-moss text-cream rounded-full flex items-center justify-center hover:bg-dark-brown transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
