import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Phone } from 'lucide-react';
import type { DriverChatMessage } from '../types';

interface DriverChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
}

export const DriverChatModal: React.FC<DriverChatModalProps> = ({
  isOpen,
  onClose,
  driverName = 'Rahul Kumar',
  driverPhone = '+91 98123 45678',
  driverPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
}) => {
  const [messages, setMessages] = useState<DriverChatMessage[]>([
    { id: '1', sender: 'driver', text: `Hello! I have picked up your order from darkstore. Arriving in ~4 mins.`, time: 'Just now' }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: DriverChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate Rider Auto-Reply
    setTimeout(() => {
      let replyText = `Understood! I will follow your instruction.`;
      if (text.toLowerCase().includes('where')) {
        replyText = `I am at 17th Main Road junction, just 200m away from your gate!`;
      } else if (text.toLowerCase().includes('door') || text.toLowerCase().includes('bell')) {
        replyText = `Noted! Will leave bag at door without ringing bell.`;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'driver',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white max-w-sm w-full rounded-3xl p-4 shadow-2xl space-y-3 border border-gray-100 relative flex flex-col h-[520px]">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={driverPhoto}
              alt={driverName}
              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
            />
            <div>
              <h3 className="text-xs font-black text-gray-900">{driverName}</h3>
              <p className="text-[10px] text-emerald-600 font-semibold">● Live Delivery Executive</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={`tel:${driverPhone}`}
              className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition"
              title="Call Rider"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset Quick Suggestions */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 py-1">
          {['Where are you right now?', 'Please leave at door', 'Call upon arrival', 'Don\'t ring bell'].map((preset) => (
            <button
              key={preset}
              onClick={() => handleSendMessage(preset)}
              className="px-2.5 py-1 bg-gray-100 hover:bg-yellow-100 text-gray-800 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 p-2 bg-gray-50 rounded-2xl border border-gray-100">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-2.5 rounded-2xl text-xs font-semibold ${
                  msg.sender === 'user'
                    ? 'bg-[#fdee24] text-black rounded-tr-none shadow-2xs'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 pt-1 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message rider..."
            className="flex-1 bg-gray-100 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-400 focus:bg-white transition"
          />
          <button
            type="submit"
            className="p-2.5 bg-gray-900 hover:bg-black text-yellow-300 rounded-2xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
