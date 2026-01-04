
import React, { useState } from 'react';
import { Property, Lead, SiteConfig, AdItem } from '../../types';
import { generatePropertyDescription } from '../../services/geminiService';

interface CMSPanelProps {
  properties: Property[];
  leads: Lead[];
  siteConfig: SiteConfig;
  onUpdateProperty: (p: Property) => void;
  onAddProperty: (p: Omit<Property, 'id'>) => void;
  onDeleteProperty: (id: string) => void;
  onUpdateConfig: (config: SiteConfig) => void;
  onUpdateLeadStatus: (id: string, status: Lead['status']) => void;
}

const CMSPanel: React.FC<CMSPanelProps> = ({ 
  properties, 
  leads, 
  siteConfig,
  onUpdateProperty, 
  onAddProperty, 
  onDeleteProperty,
  onUpdateConfig,
  onUpdateLeadStatus
}) => {
  const [tab, setTab] = useState<'listings' | 'leads' | 'settings' | 'reports'>('listings');
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert("Unauthorized Access Attempted.");
    }
  };

  const handleAddAd = () => {
    const newAd: AdItem = {
      id: Date.now().toString(),
      imageUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1200',
      title: 'New Promotional Ad',
      link: '#'
    };
    onUpdateConfig({ ...siteConfig, ads: [...siteConfig.ads, newAd] });
  };

  const handleRemoveAd = (id: string) => {
    onUpdateConfig({ ...siteConfig, ads: siteConfig.ads.filter(a => a.id !== id) });
  };

  const handleUpdateAd = (id: string, field: keyof AdItem, val: string) => {
    onUpdateConfig({
      ...siteConfig,
      ads: siteConfig.ads.map(ad => ad.id === id ? { ...ad, [field]: val } : ad)
    });
  };

  const handleSaveProperty = () => {
    if (!editingProperty) return;
    if (editingProperty.id) {
      onUpdateProperty(editingProperty as Property);
    } else {
      onAddProperty(editingProperty as Omit<Property, 'id'>)
    }
    setEditingProperty(null);
  };

  const handleAIRewrite = async () => {
    if (!editingProperty?.title || !editingProperty.location) {
      alert("Title and Location are required for AI generation.");
      return;
    }
    setIsGenerating(true);
    const desc = await generatePropertyDescription({
      title: editingProperty.title,
      beds: editingProperty.beds || 0,
      baths: editingProperty.baths || 0,
      location: editingProperty.location
    });
    setEditingProperty({ ...editingProperty, description: desc });
    setIsGenerating(false);
  };

  const handleAddExtraImage = () => {
    const currentExtras = editingProperty?.extraImages || [];
    setEditingProperty({ ...editingProperty, extraImages: [...currentExtras, ''] });
  };

  const handleUpdateExtraImage = (index: number, val: string) => {
    const currentExtras = [...(editingProperty?.extraImages || [])];
    currentExtras[index] = val;
    setEditingProperty({ ...editingProperty, extraImages: currentExtras });
  };

  const handleRemoveExtraImage = (index: number) => {
    const currentExtras = [...(editingProperty?.extraImages || [])];
    currentExtras.splice(index, 1);
    setEditingProperty({ ...editingProperty, extraImages: currentExtras });
  };

  const generateCSVReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Client Name,Email,Phone,Target Property,Agent Referral,Current Status,Date Submitted\n"
      + leads.map(l => `${l.name},${l.email},${l.phone},${l.propertyName},${l.agentReferral},${l.status},${new Date(l.timestamp).toLocaleString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leads_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-sm w-full">
          <div className="text-center mb-8">
            <div className="bg-blue-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
              <i className="fas fa-shield-halved text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Admin Control</h2>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">Encrypted Session Only</p>
          </div>
          <div className="mb-6">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Access Key</label>
            <input 
              type="password" 
              className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-center tracking-widest"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-700 text-white font-black py-4 rounded-xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs"
          >
            Authorize Entry
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="bg-blue-700 text-white p-2 rounded-xl text-lg rotate-6 shadow-md"><i className="fas fa-microchip"></i></span>
            CMS Console
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-1">Managing {siteConfig.siteName} assets & pipelines.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl self-start overflow-x-auto max-w-full no-scrollbar shadow-sm border border-gray-100">
          <button onClick={() => setTab('listings')} className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap text-xs font-black uppercase tracking-widest ${tab === 'listings' ? 'bg-blue-700 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}>Inventory</button>
          <button onClick={() => setTab('leads')} className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap text-xs font-black uppercase tracking-widest ${tab === 'leads' ? 'bg-blue-700 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}>Pipeline</button>
          <button onClick={() => setTab('reports')} className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap text-xs font-black uppercase tracking-widest ${tab === 'reports' ? 'bg-blue-700 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}>Analytics</button>
          <button onClick={() => setTab('settings')} className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap text-xs font-black uppercase tracking-widest ${tab === 'settings' ? 'bg-blue-700 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}>Settings</button>
        </div>
      </div>

      {tab === 'listings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Inventory Status</h2>
            <button 
              onClick={() => setEditingProperty({
                title: '', description: '', price: 0, location: '', beds: 0, baths: 0, 
                carParks: 0, propertyType: 'Condo', lotType: 'Freehold', sqft: 0,
                imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=800',
                status: 'Available',
                extraImages: []
              })}
              className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
            >
              + Create Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm p-4 relative group">
                <div className="h-40 rounded-2xl overflow-hidden relative mb-4">
                  <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.title} />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full shadow-sm text-white ${p.status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}>{p.status}</span>
                  </div>
                </div>
                <h3 className="font-black text-gray-900 mb-1">{p.title}</h3>
                <p className="text-xs text-blue-700 font-bold mb-4">${p.price.toLocaleString()}</p>
                <div className="flex gap-2">
                  <button onClick={() => setEditingProperty(p)} className="flex-grow bg-gray-50 text-gray-700 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-gray-100 transition-all">Edit Details</button>
                  <button onClick={() => onDeleteProperty(p.id)} className="w-10 bg-red-50 text-red-500 py-2 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"><i className="fas fa-trash-alt text-xs"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'leads' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Live Prospects</h2>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full">{leads.length} Total</span>
          </div>
          
          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="bg-white p-20 text-center rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No activity captured</p>
              </div>
            ) : (
              leads.map(lead => (
                <div key={lead.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-700"></div>
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-black text-gray-900">{lead.name}</h4>
                        <span className="text-[9px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded tracking-tighter">REF: {lead.agentReferral || 'None'}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 mb-4">{lead.propertyName}</p>
                      <div className="flex flex-wrap gap-4 text-[11px] font-medium text-gray-400">
                        <span className="flex items-center gap-1.5"><i className="fas fa-phone text-blue-400"></i> {lead.phone}</span>
                        <span className="flex items-center gap-1.5"><i className="fas fa-envelope text-blue-400"></i> {lead.email}</span>
                        <span className="flex items-center gap-1.5"><i className="fas fa-map-marker-alt text-blue-400"></i> {lead.countryState}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-[150px]">
                      <select 
                        className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border-none outline-none cursor-pointer shadow-sm w-full text-center ${
                          lead.status === 'New' ? 'bg-blue-600 text-white' : 
                          lead.status === 'Contacted' ? 'bg-amber-500 text-white' : 
                          lead.status === 'Closed' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'
                        }`}
                        value={lead.status}
                        onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                      >
                        <option value="New">Unread</option>
                        <option value="Contacted">Followed Up</option>
                        <option value="Closed">Closed Deal</option>
                        <option value="Lost">Lost</option>
                      </select>
                      <span className="text-[9px] font-bold text-gray-300">{new Date(lead.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-gray-900">Pipeline Intelligence</h2>
              <p className="text-xs text-gray-400 mt-1">Breakdown of leads vs converted clients.</p>
            </div>
            <button 
              onClick={generateCSVReport}
              className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-50"
            >
              <i className="fas fa-cloud-download"></i> Generate CSV Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Leads</p>
              <p className="text-4xl font-black text-blue-700">{leads.length}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unprocessed</p>
              <p className="text-4xl font-black text-amber-500">{leads.filter(l => l.status === 'New').length}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Closed Deals</p>
              <p className="text-4xl font-black text-green-600">{leads.filter(l => l.status === 'Closed').length}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ads Active</p>
              <p className="text-4xl font-black text-purple-600">{siteConfig.ads.length}</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black flex items-center gap-2 text-gray-900">
                <i className="fas fa-bullhorn text-orange-500"></i> Ad Campaigns
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={siteConfig.adsEnabled} onChange={(e) => onUpdateConfig({...siteConfig, adsEnabled: e.target.checked})}/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className={`space-y-6 ${!siteConfig.adsEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex justify-between items-center"><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Slides ({siteConfig.ads.length})</p><button onClick={handleAddAd} className="text-[10px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">+ Add Banner</button></div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {siteConfig.ads.map((ad, idx) => (
                  <div key={ad.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 relative group">
                    <button onClick={() => handleRemoveAd(ad.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"><i className="fas fa-times-circle"></i></button>
                    <span className="text-[10px] font-black text-gray-300 uppercase">Slide {idx + 1}</span>
                    <input type="text" placeholder="Title" className="w-full text-xs p-2 border rounded-lg bg-white outline-none focus:border-blue-500" value={ad.title} onChange={(e) => handleUpdateAd(ad.id, 'title', e.target.value)}/>
                    <input type="text" placeholder="Image URL" className="w-full text-xs p-2 border rounded-lg bg-white outline-none focus:border-blue-500" value={ad.imageUrl} onChange={(e) => handleUpdateAd(ad.id, 'imageUrl', e.target.value)}/>
                    <input type="text" placeholder="Destination URL (# for home)" className="w-full text-xs p-2 border rounded-lg bg-white outline-none focus:border-blue-500" value={ad.link} onChange={(e) => handleUpdateAd(ad.id, 'link', e.target.value)}/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
             <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-gray-900">
                <i className="fas fa-globe text-blue-600"></i> Identity Config
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Brand Name</label>
                    <input type="text" className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none text-xs font-bold" value={siteConfig.siteName} onChange={(e) => onUpdateConfig({...siteConfig, siteName: e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Agent No</label>
                    <input type="text" className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none text-xs font-bold" value={siteConfig.agentNo} onChange={(e) => onUpdateConfig({...siteConfig, agentNo: e.target.value})}/>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hotline</label>
                  <input type="text" className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none text-xs font-bold" value={siteConfig.phone} onChange={(e) => onUpdateConfig({...siteConfig, phone: e.target.value})}/>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Listing Data</h3>
              <button onClick={() => setEditingProperty(null)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fas fa-times-circle text-2xl"></i></button>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                    <input type="text" className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl outline-none focus:border-blue-600 transition-all font-bold" value={editingProperty.title} onChange={(e) => setEditingProperty({...editingProperty, title: e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Price ($)</label>
                    <input type="number" className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl outline-none focus:border-blue-600 transition-all font-bold" value={editingProperty.price} onChange={(e) => setEditingProperty({...editingProperty, price: parseInt(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                    <input type="text" className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl outline-none focus:border-blue-600 transition-all font-bold" value={editingProperty.location} onChange={(e) => setEditingProperty({...editingProperty, location: e.target.value})}/>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Images</h4>
                  <button onClick={handleAddExtraImage} className="text-[10px] font-black text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-all">
                    + Add Extra Image
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Primary Image URL</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-50 rounded-xl outline-none text-xs font-bold" value={editingProperty.imageUrl} onChange={(e) => setEditingProperty({...editingProperty, imageUrl: e.target.value})}/>
                  </div>
                  {editingProperty.extraImages?.map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                      <div className="flex-grow">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Extra Image #{idx + 1}</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 border-2 border-gray-50 rounded-xl outline-none text-xs"
                          value={url}
                          onChange={(e) => handleUpdateExtraImage(idx, e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <button onClick={() => handleRemoveExtraImage(idx)} className="mt-5 text-red-400 hover:text-red-600"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</h4>
                  <button onClick={handleAIRewrite} disabled={isGenerating} className="text-[10px] font-black text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full hover:bg-purple-100 disabled:opacity-50 transition-all flex items-center gap-2">
                    {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>} AI Rewrite
                  </button>
                </div>
                <textarea rows={4} className="w-full px-4 py-3 border-2 border-gray-50 rounded-xl outline-none focus:border-blue-600 transition-all text-sm font-medium leading-relaxed" value={editingProperty.description} onChange={(e) => setEditingProperty({...editingProperty, description: e.target.value})}/>
              </div>
            </div>
            <div className="p-8 border-t bg-gray-50/50 flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setEditingProperty(null)} className="px-6 py-2.5 text-gray-400 hover:text-gray-900 font-black uppercase text-[10px] tracking-widest transition-colors">Cancel</button>
              <button onClick={handleSaveProperty} className="px-10 py-2.5 bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all">Commit Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSPanel;
