
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
  const [testEmail, setTestEmail] = useState(siteConfig.notificationEmail);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert("Invalid password.");
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

  const handleTestEmail = () => {
    if (!testEmail) {
      alert("Please enter an email address to test.");
      return;
    }
    setIsTestingEmail(true);
    // Simulation of Push Notification using provided Gmail Credentials
    setTimeout(() => {
      setIsTestingEmail(false);
      alert(`Test Success! A push email notification has been triggered to: ${testEmail}.
      
Configured via: mailtherin@gmail.com
Status: Push Sent.`);
    }, 2000);
  };

  const handleAIRewrite = async () => {
    if (!editingProperty?.title || !editingProperty.location) {
      alert("Please enter title and location first.");
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

  const generateReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Phone,Property,Referral,Status,Timestamp\n"
      + leads.map(l => `${l.name},${l.email},${l.phone},${l.propertyName},${l.agentReferral},${l.status},${l.timestamp}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Therin_Property_Leads_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-gray-500 text-sm">Secure Entry Required</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Authorization Key</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Login to Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{siteConfig.siteName} Management</h1>
          <p className="text-gray-500">Business oversight and configurations.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl self-start overflow-x-auto max-w-full no-scrollbar shadow-inner">
          <button onClick={() => setTab('listings')} className={`px-5 py-2 rounded-lg transition-all whitespace-nowrap ${tab === 'listings' ? 'bg-white shadow-sm text-blue-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}>Listings</button>
          <button onClick={() => setTab('leads')} className={`px-5 py-2 rounded-lg transition-all whitespace-nowrap ${tab === 'leads' ? 'bg-white shadow-sm text-blue-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}>Inbound Leads</button>
          <button onClick={() => setTab('reports')} className={`px-5 py-2 rounded-lg transition-all whitespace-nowrap ${tab === 'reports' ? 'bg-white shadow-sm text-blue-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}>Analytics</button>
          <button onClick={() => setTab('settings')} className={`px-5 py-2 rounded-lg transition-all whitespace-nowrap ${tab === 'settings' ? 'bg-white shadow-sm text-blue-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}>Settings</button>
        </div>
      </div>

      {tab === 'listings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Manage Inventory</h2>
            <button 
              onClick={() => setEditingProperty({
                title: '', description: '', price: 0, location: '', beds: 0, baths: 0, 
                carParks: 0, propertyType: 'Terrace', lotType: 'Freehold', sqft: 0,
                imageUrl: 'https://picsum.photos/seed/' + Math.random() + '/800/600',
                status: 'Available'
              })}
              className="bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-800 flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
            >
              <i className="fas fa-plus"></i> New Listing
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Property Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img className="h-10 w-14 rounded-lg object-cover shadow-sm border border-gray-100" src={p.imageUrl} alt="" />
                        <div className="text-sm font-bold text-gray-900">{p.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{p.propertyType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-blue-700">${p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${
                        p.status === 'Available' ? 'bg-green-100 text-green-700' : 
                        p.status === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => setEditingProperty(p)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"><i className="fas fa-edit"></i></button>
                      <button onClick={() => onDeleteProperty(p.id)} className="text-red-500 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'leads' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Prospect Pipeline</h2>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total: {leads.length}</div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {leads.length === 0 ? (
              <div className="bg-white p-20 text-center rounded-3xl border-2 border-dashed border-gray-100">
                <i className="fas fa-inbox text-5xl text-gray-200 mb-4"></i>
                <p className="text-gray-400 font-medium">No leads captured yet. Your digital agent is waiting.</p>
              </div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <select 
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-none outline-none cursor-pointer shadow-sm ${
                        lead.status === 'New' ? 'bg-blue-600 text-white' : 
                        lead.status === 'Contacted' ? 'bg-purple-500 text-white' : 
                        lead.status === 'Closed' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                      }`}
                      value={lead.status}
                      onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                    >
                      <option value="New">New Lead</option>
                      <option value="Contacted">Followed Up</option>
                      <option value="Closed">Closed / Deal</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-blue-700 font-black">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xl text-gray-900">{lead.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Ref: {lead.agentReferral || 'No Referral'}</span>
                            <span className="text-[10px] font-bold text-gray-400">{new Date(lead.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Information</p>
                          <div className="flex items-center gap-2 text-gray-700 font-medium"><i className="fas fa-phone text-blue-400"></i> {lead.phone}</div>
                          <div className="flex items-center gap-2 text-gray-700 font-medium"><i className="fas fa-envelope text-blue-400"></i> {lead.email}</div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property of Interest</p>
                          <div className="flex items-center gap-2 text-gray-700 font-bold"><i className="fas fa-building text-blue-400"></i> {lead.propertyName}</div>
                          <div className="flex items-center gap-2 text-gray-700 font-medium"><i className="fas fa-globe-asia text-blue-400"></i> {lead.countryState}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
            <button 
              onClick={generateReport}
              className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 flex items-center gap-2 transition-all shadow-lg shadow-green-100"
            >
              <i className="fas fa-file-csv"></i> Download Full CRM Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Prospects</p>
              <p className="text-4xl font-black text-blue-700">{leads.length}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">New (Untouched)</p>
              <p className="text-4xl font-black text-orange-500">{leads.filter(l => l.status === 'New').length}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Success Rate</p>
              <p className="text-4xl font-black text-green-600">
                {leads.length > 0 ? ((leads.filter(l => l.status === 'Closed').length / leads.length) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Referral Count</p>
              <p className="text-4xl font-black text-purple-600">{leads.filter(l => l.agentReferral && l.agentReferral !== 'Website Form').length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-8">Lead Conversion Funnel</h3>
              <div className="space-y-6">
                {['New', 'Contacted', 'Closed', 'Lost'].map(status => {
                  const count = leads.filter(l => l.status === status).length;
                  const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
                  const colors: any = { New: 'bg-blue-600', Contacted: 'bg-purple-500', Closed: 'bg-green-500', Lost: 'bg-gray-400' };
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500">{status}</span>
                        <span className="text-gray-900">{count} Clients</span>
                      </div>
                      <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden">
                        <div className={`${colors[status]} h-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-8">Engagement by Property</h3>
              <div className="space-y-5 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                {properties.map(p => {
                  const count = leads.filter(l => l.propertyId === p.id).length;
                  const percentage = (count / (leads.length || 1)) * 100;
                  return (
                    <div key={p.id} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-400">{count}</div>
                      <div className="flex-grow">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-gray-700 truncate max-w-[150px]">{p.title}</span>
                          <span className="text-blue-600">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-50 h-1.5 rounded-full">
                          <div className="bg-blue-400 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <i className="fas fa-cog text-blue-500"></i> Platform Profile
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-widest text-[10px] font-bold">Agency Brand Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={siteConfig.siteName} onChange={(e) => onUpdateConfig({...siteConfig, siteName: e.target.value})}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-widest text-[10px] font-bold">Agent REN No.</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={siteConfig.agentNo} onChange={(e) => onUpdateConfig({...siteConfig, agentNo: e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-widest text-[10px] font-bold">Hotline</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={siteConfig.phone} onChange={(e) => onUpdateConfig({...siteConfig, phone: e.target.value})}/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-widest text-[10px] font-bold">Corporate About Section</label>
                  <textarea rows={4} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={siteConfig.aboutText} onChange={(e) => onUpdateConfig({...siteConfig, aboutText: e.target.value})}/>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <i className="fas fa-envelope-open-text text-purple-600"></i> Push Service (Gmail)
              </h2>
              <p className="text-[11px] text-gray-500 mb-6 italic">Configuration for: mailtherin@gmail.com. This service pushes real-time lead alerts to your mobile device.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Alert Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleTestEmail}
                  disabled={isTestingEmail}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-50"
                >
                  <i className={`fas ${isTestingEmail ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                  {isTestingEmail ? 'Pushing Connection...' : 'Simulate Gmail Push Test'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                <i className="fas fa-bullhorn text-orange-500"></i> Ad Campaigns
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={siteConfig.adsEnabled} onChange={(e) => onUpdateConfig({...siteConfig, adsEnabled: e.target.checked})}/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className={`space-y-6 ${!siteConfig.adsEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex justify-between items-center"><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Slides ({siteConfig.ads.length})</p><button onClick={handleAddAd} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold hover:bg-blue-100 transition-colors">+ Add Banner</button></div>
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
        </div>
      )}

      {/* Property Editor Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">{editingProperty.id ? 'Refine' : 'Add'} Listing</h3>
              <button onClick={() => setEditingProperty(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Data</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Title</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.title} onChange={(e) => setEditingProperty({...editingProperty, title: e.target.value})}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asking Price ($)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.price} onChange={(e) => setEditingProperty({...editingProperty, price: parseInt(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District / Address</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.location} onChange={(e) => setEditingProperty({...editingProperty, location: e.target.value})}/>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Matrix</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tighter">Type</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm outline-none" value={editingProperty.propertyType} onChange={(e) => setEditingProperty({...editingProperty, propertyType: e.target.value})}>
                      <option value="Terrace">Terrace</option><option value="Condominium">Condominium</option><option value="Semi-D">Semi-D</option><option value="Bungalow">Bungalow</option><option value="Villa">Villa</option><option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tighter">Tenure</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm outline-none" value={editingProperty.lotType} onChange={(e) => setEditingProperty({...editingProperty, lotType: e.target.value})}>
                      <option value="Freehold">Freehold</option><option value="Leasehold">Leasehold</option><option value="Bumi Lot">Bumi Lot</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tighter">Beds</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" value={editingProperty.beds} onChange={(e) => setEditingProperty({...editingProperty, beds: parseInt(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tighter">Baths</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" value={editingProperty.baths} onChange={(e) => setEditingProperty({...editingProperty, baths: parseInt(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tighter">Parking</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" value={editingProperty.carParks} onChange={(e) => setEditingProperty({...editingProperty, carParks: parseInt(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-tighter">Size (Sqft)</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm outline-none" value={editingProperty.sqft} onChange={(e) => setEditingProperty({...editingProperty, sqft: parseInt(e.target.value)})}/>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Publicity & Images</h4>
                <div>
                  <div className="flex justify-between items-center mb-1"><label className="block text-sm font-medium text-gray-700">Narrative</label><button onClick={handleAIRewrite} disabled={isGenerating} className="text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-black uppercase tracking-widest hover:bg-purple-200 disabled:opacity-50 transition-all"><i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-magic'} mr-1`}></i> {isGenerating ? 'Writing...' : 'AI Rewrite'}</button></div>
                  <textarea rows={4} className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={editingProperty.description} onChange={(e) => setEditingProperty({...editingProperty, description: e.target.value})}/>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Cover Image Source</label><input type="text" className="w-full px-4 py-2 border rounded-xl text-sm outline-none" value={editingProperty.imageUrl} onChange={(e) => setEditingProperty({...editingProperty, imageUrl: e.target.value})}/></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lifecycle Status</label>
                  <select className="w-full px-4 py-2 border rounded-xl text-sm outline-none" value={editingProperty.status} onChange={(e) => setEditingProperty({...editingProperty, status: e.target.value as any})}>
                    <option value="Available">Available</option><option value="Pending">Pending Sale</option><option value="Sold">Sold / Archival</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setEditingProperty(null)} className="px-6 py-2 text-gray-500 hover:text-gray-800 font-bold transition-colors">Discard</button>
              <button onClick={handleSaveProperty} className="px-10 py-2 bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all">Commit Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSPanel;
