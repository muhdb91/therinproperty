
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
}

const CMSPanel: React.FC<CMSPanelProps> = ({ 
  properties, 
  leads, 
  siteConfig,
  onUpdateProperty, 
  onAddProperty, 
  onDeleteProperty,
  onUpdateConfig
}) => {
  const [tab, setTab] = useState<'listings' | 'leads' | 'settings'>('listings');
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert("Invalid password. Please try 'admin123'");
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
      onAddProperty(editingProperty as Omit<Property, 'id'>);
    }
    setEditingProperty(null);
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

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <p className="text-gray-500 text-sm">Restricted access area</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-2 text-xs text-gray-400 italic text-center">Tip: password is admin123</p>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{siteConfig.siteName} Admin</h1>
          <p className="text-gray-500">Authorized management console.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          <button 
            onClick={() => setTab('listings')}
            className={`px-4 py-2 rounded-md transition-all ${tab === 'listings' ? 'bg-white shadow text-blue-700 font-bold' : 'text-gray-600'}`}
          >
            Listings
          </button>
          <button 
            onClick={() => setTab('leads')}
            className={`px-4 py-2 rounded-md transition-all ${tab === 'leads' ? 'bg-white shadow text-blue-700 font-bold' : 'text-gray-600'}`}
          >
            Leads <span className="ml-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{leads.length}</span>
          </button>
          <button 
            onClick={() => setTab('settings')}
            className={`px-4 py-2 rounded-md transition-all ${tab === 'settings' ? 'bg-white shadow text-blue-700 font-bold' : 'text-gray-600'}`}
          >
            Site Settings
          </button>
        </div>
      </div>

      {tab === 'listings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Property Listings</h2>
            <button 
              onClick={() => setEditingProperty({
                title: '', description: '', price: 0, location: '', beds: 0, baths: 0, 
                carParks: 0, propertyType: 'Terrace', lotType: 'Freehold', sqft: 0,
                imageUrl: 'https://picsum.photos/seed/' + Math.random() + '/800/600',
                status: 'Available'
              })}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 flex items-center gap-2 transition-colors"
            >
              <i className="fas fa-plus"></i> Add New Property
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-lg object-cover mr-3 shadow-sm" src={p.imageUrl} alt="" />
                        <div className="text-sm font-medium text-gray-900">{p.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.propertyType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">${p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        p.status === 'Available' ? 'bg-green-100 text-green-800' : 
                        p.status === 'Sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => setEditingProperty(p)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"><i className="fas fa-edit"></i></button>
                      <button onClick={() => onDeleteProperty(p.id)} className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"><i className="fas fa-trash"></i></button>
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
          <h2 className="text-xl font-bold">Inbound Leads</h2>
          <div className="grid grid-cols-1 gap-6">
            {leads.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">No leads captured yet.</div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-700 group-hover:w-2 transition-all"></div>
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{lead.name}</h4>
                      <p className="text-sm text-blue-700 font-medium mb-2">Interest: {lead.propertyName}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1 text-sm text-gray-600">
                        <div><i className="fas fa-phone mr-2 opacity-50"></i> {lead.phone}</div>
                        <div><i className="fas fa-envelope mr-2 opacity-50"></i> {lead.email}</div>
                        <div><i className="fas fa-map mr-2 opacity-50"></i> {lead.countryState}</div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      {new Date(lead.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <i className="fas fa-cog text-blue-500"></i> Basic Configuration
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-widest text-[10px] font-bold">Agency Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={siteConfig.siteName}
                  onChange={(e) => onUpdateConfig({...siteConfig, siteName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-widest text-[10px] font-bold">Agent No (REN)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={siteConfig.agentNo}
                    onChange={(e) => onUpdateConfig({...siteConfig, agentNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-widest text-[10px] font-bold">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={siteConfig.phone}
                    onChange={(e) => onUpdateConfig({...siteConfig, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-widest text-[10px] font-bold">Footer Text</label>
                <textarea 
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={siteConfig.footerText}
                  onChange={(e) => onUpdateConfig({...siteConfig, footerText: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-widest text-[10px] font-bold">About Section</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={siteConfig.aboutText}
                  onChange={(e) => onUpdateConfig({...siteConfig, aboutText: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                <i className="fas fa-bullhorn text-orange-500"></i> Ads Carousel
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={siteConfig.adsEnabled}
                  onChange={(e) => onUpdateConfig({...siteConfig, adsEnabled: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className={`space-y-6 ${!siteConfig.adsEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ad Slides ({siteConfig.ads.length})</p>
                <button 
                  onClick={handleAddAd}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold hover:bg-blue-100 transition-colors"
                >
                  + Add Slide
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {siteConfig.ads.map((ad, idx) => (
                  <div key={ad.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-gray-300">AD #{idx + 1}</span>
                      <button onClick={() => handleRemoveAd(ad.id)} className="text-red-400 hover:text-red-600"><i className="fas fa-trash-alt text-sm"></i></button>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Slide Title" 
                      className="w-full text-xs p-2 border rounded bg-white"
                      value={ad.title}
                      onChange={(e) => handleUpdateAd(ad.id, 'title', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Image URL" 
                      className="w-full text-xs p-2 border rounded bg-white"
                      value={ad.imageUrl}
                      onChange={(e) => handleUpdateAd(ad.id, 'imageUrl', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Link (e.g. # or external URL)" 
                      className="w-full text-xs p-2 border rounded bg-white"
                      value={ad.link}
                      onChange={(e) => handleUpdateAd(ad.id, 'link', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Editor Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">{editingProperty.id ? 'Edit' : 'New'} Listing</h3>
              <button onClick={() => setEditingProperty(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Basic Information</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.title} onChange={(e) => setEditingProperty({...editingProperty, title: e.target.value})}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.price} onChange={(e) => setEditingProperty({...editingProperty, price: parseInt(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.location} onChange={(e) => setEditingProperty({...editingProperty, location: e.target.value})}/>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specifications</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.propertyType} onChange={(e) => setEditingProperty({...editingProperty, propertyType: e.target.value})}>
                      <option value="Terrace">Terrace</option>
                      <option value="Condominium">Condominium</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Semi-D">Semi-D</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Villa">Villa</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lot Type</label>
                    <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.lotType} onChange={(e) => setEditingProperty({...editingProperty, lotType: e.target.value})}>
                      <option value="Freehold">Freehold</option>
                      <option value="Leasehold">Leasehold</option>
                      <option value="Bumi Lot">Bumi Lot</option>
                      <option value="Malay Reserve">Malay Reserve</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Parks</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.carParks} onChange={(e) => setEditingProperty({...editingProperty, carParks: parseInt(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedroom(s)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.beds} onChange={(e) => setEditingProperty({...editingProperty, beds: parseInt(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathroom(s)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.baths} onChange={(e) => setEditingProperty({...editingProperty, baths: parseInt(e.target.value)})}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.sqft} onChange={(e) => setEditingProperty({...editingProperty, sqft: parseInt(e.target.value)})}/>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content</h4>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <button onClick={handleAIRewrite} disabled={isGenerating} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 disabled:opacity-50 transition-colors">
                      <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'} mr-1`}></i> AI Generate
                    </button>
                  </div>
                  <textarea rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.description} onChange={(e) => setEditingProperty({...editingProperty, description: e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.imageUrl} onChange={(e) => setEditingProperty({...editingProperty, imageUrl: e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={editingProperty.status} onChange={(e) => setEditingProperty({...editingProperty, status: e.target.value as any})}>
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setEditingProperty(null)} className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors">Cancel</button>
              <button onClick={handleSaveProperty} className="px-8 py-2 bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all">Save Listing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSPanel;
