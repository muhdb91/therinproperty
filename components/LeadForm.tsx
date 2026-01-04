
import React, { useState, useEffect } from 'react';
import { Property, Lead } from '../types';

interface LeadFormProps {
  property: Property;
  onSubmit: (lead: Omit<Lead, 'id' | 'timestamp' | 'status'>) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ property, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    agentReferral: '',
    countryState: ''
  });
  
  // Captcha State
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, userAnswer: '' });
  const [captchaError, setCaptchaError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const generateCaptcha = () => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
      userAnswer: ''
    });
    setCaptchaError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify Captcha
    if (parseInt(captcha.userAnswer) !== (captcha.num1 + captcha.num2)) {
      setCaptchaError(true);
      return;
    }

    onSubmit({
      ...formData,
      propertyId: property.id,
      propertyName: property.title
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-xl text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Thank You!</h3>
        <p className="text-green-700">Your inquiry for {property.title} has been sent. An agent will contact you shortly.</p>
        <button 
          onClick={() => { setSubmitted(false); generateCaptcha(); }}
          className="mt-6 text-green-700 font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Inquire About {property.title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name *</label>
          <input 
            required
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone *</label>
            <input 
              required
              type="tel"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="+60 123..."
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email *</label>
            <input 
              required
              type="email"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="email@address.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Country / State</label>
          <input 
            required
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Sabah, Malaysia"
            value={formData.countryState}
            onChange={(e) => setFormData({...formData, countryState: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Referral Number / Name</label>
          <input 
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Agent code (if any)"
            value={formData.agentReferral}
            onChange={(e) => setFormData({...formData, agentReferral: e.target.value})}
          />
        </div>

        {/* Math Captcha Section */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Verify Humanity</label>
            <button type="button" onClick={generateCaptcha} className="text-[10px] text-blue-600 hover:underline">Refresh</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-3 py-2 rounded-lg border font-bold text-gray-700 select-none">
              {captcha.num1} + {captcha.num2} = ?
            </div>
            <input 
              type="number" 
              required
              className={`flex-grow px-3 py-2 border rounded-lg outline-none focus:ring-2 ${captchaError ? 'border-red-500 ring-red-100' : 'border-gray-200 ring-blue-100'}`}
              placeholder="Answer"
              value={captcha.userAnswer}
              onChange={(e) => {setCaptcha({...captcha, userAnswer: e.target.value}); setCaptchaError(false);}}
            />
          </div>
          {captchaError && <p className="text-[10px] text-red-500 mt-2 font-bold">Incorrect answer. Please try again.</p>}
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-blue-100 uppercase tracking-widest text-xs"
        >
          Submit Inquiry
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
