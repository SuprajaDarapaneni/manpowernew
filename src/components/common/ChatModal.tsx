import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Paperclip,
  Clock,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ orderId, isOpen, onClose }) => {
  const { orders, chats, sendChatMessage, currentRole, customerAuth, workers, activeWorkerId } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const order = orders.find((o) => o.id === orderId);
  const messageList = chats[orderId] || [];

  const currentUserName =
    currentRole === 'customer'
      ? customerAuth?.businessName || customerAuth?.name || 'Customer'
      : workers.find((w) => w.id === activeWorkerId)?.name || 'Worker';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  if (!isOpen || !order) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(orderId, inputText.trim(), false);
    setInputText('');
  };

  const handleSendLocation = () => {
    sendChatMessage(orderId, `📍 Shared Location: ${order.location}`, true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-bold">
              💬
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs text-white">Order Chat &bull; {order.orderNumber}</h3>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {order.category} &bull; {order.location}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Work Point Banner & Quick Info */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Destination: <strong className="text-slate-800">{order.location}</strong></span>
          </div>
          <button
            onClick={handleSendLocation}
            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 ml-2"
          >
            Share Work Point
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-100/50">
          {messageList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No messages yet. Say hello or share landmark instructions!
            </div>
          ) : (
            messageList.map((msg) => {
              const isMine =
                (currentRole === 'customer' && msg.senderRole === 'customer') ||
                (currentRole === 'employee' && msg.senderRole === 'employee');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] text-slate-400 px-1 mb-0.5 font-medium">
                    {msg.senderName} ({msg.senderRole}) &bull; {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-xs leading-relaxed ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : msg.senderId === 'system'
                        ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-none font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Canned Chips */}
        <div className="bg-white border-t border-slate-100 px-3 py-1.5 flex gap-1.5 overflow-x-auto text-[10px]">
          <button
            type="button"
            onClick={() => sendChatMessage(orderId, 'I have arrived at the gate.', false)}
            className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
          >
            Arrived at Gate
          </button>
          <button
            type="button"
            onClick={() => sendChatMessage(orderId, 'What is the exact entry landmark?', false)}
            className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
          >
            What is Landmark?
          </button>
          <button
            type="button"
            onClick={() => sendChatMessage(orderId, `Start OTP for this job is: ${order.startOtp}`, false)}
            className="px-2 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold whitespace-nowrap"
          >
            Send Start OTP
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message as ${currentUserName}...`}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
