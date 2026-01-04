
import React, { useState } from 'react';

interface WhatsAppFloatProps {
  phone: string;
  agentName: string;
}

const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ phone, agentName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent(`Hello ${agentName}, I am interested in your property listings.`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-green-600 p-4 text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fab fa-whatsapp text-2xl"></i>
            </div>
            <div>
              <p className="text-xs opacity-80">Typically replies in minutes</p>
              <p className="font-bold">Chat with {agentName}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-auto opacity-60 hover:opacity-100">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-4 bg-gray-50">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-gray-100 mb-4">
              <p className="text-sm text-gray-700">Hi there! 👋<br/>How can I help you with your property search today?</p>
            </div>
            <button 
              onClick={handleWhatsAppRedirect}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <i className="fab fa-whatsapp text-xl"></i>
              Start WhatsApp Chat
            </button>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-200 transition-all hover:scale-110 active:scale-95 group relative"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600"></span>
        </span>
        <i className={`fab fa-whatsapp text-3xl transition-transform duration-500 ${isOpen ? 'rotate-[360deg]' : ''}`}></i>
      </button>
    </div>
  );
};

export default WhatsAppFloat;
