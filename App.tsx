
import React, { useState, useEffect, useMemo } from 'react';
import { Property, Lead, ViewState, SiteConfig, AdItem } from './types';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import LeadForm from './components/LeadForm';
import CMSPanel from './components/CMS/CMSPanel';
import SearchBar from './components/SearchBar';
import AdCarousel from './components/AdCarousel';
import WhatsAppFloat from './components/WhatsAppFloat';

const INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Glass Villa',
    description: 'Breathtaking architecture meets natural light in this stunning minimalist masterpiece.',
    price: 1250000,
    location: 'Beverly Hills, CA',
    beds: 4,
    baths: 3,
    carParks: 4,
    propertyType: 'Bungalow',
    lotType: 'Freehold',
    sqft: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
    extraImages: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800'
    ],
    status: 'Available'
  },
  {
    id: '2',
    title: 'Rustic Pine Chalet',
    description: 'Escape to the serenity of the mountains. This cozy timber home offers a massive stone fireplace.',
    price: 845000,
    location: 'Aspen, CO',
    beds: 3,
    baths: 2,
    carParks: 2,
    propertyType: 'Chalet',
    lotType: 'Leasehold',
    sqft: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop',
    status: 'Pending'
  },
  {
    id: '3',
    title: 'Azure Waterfront Estate',
    description: 'Luxurious coastal living at its finest. Private dock and infinity pool.',
    price: 3750000,
    location: 'Miami, FL',
    beds: 6,
    baths: 5,
    carParks: 6,
    propertyType: 'Mansion',
    lotType: 'Freehold',
    sqft: 6800,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    status: 'Available'
  }
];

const DEFAULT_CONFIG: SiteConfig = {
  siteName: 'Therin Property',
  agentNo: 'REN73686',
  phone: '0195984836',
  footerText: 'Your premier partner in high-end real estate solutions.',
  aboutText: 'Therin Property is a boutique real estate agency specializing in luxury residential properties. With decades of experience, we provide tailored services to buyers and sellers worldwide.',
  adsEnabled: true,
  ads: [
    { id: 'ad1', imageUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1200', title: 'Luxury Condos Launching Q3', link: '#' },
    { id: 'ad2', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200', title: 'Summer Sale: Zero Entry Fees', link: '#' }
  ],
  notificationEmail: 'mailtherin@gmail.com'
};

const PropertyDetailView: React.FC<{ 
  property: Property; 
  onBack: () => void; 
  onAddLead: (lead: Omit<Lead, 'id' | 'timestamp' | 'status'>) => void;
}> = ({ property, onBack, onAddLead }) => {
  const images = [property.imageUrl, ...(property.extraImages || [])].filter(Boolean);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="mb-6 text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest"><i className="fas fa-arrow-left"></i> Back to Listings</button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-xl">
            {images.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === currentImgIndex ? 'opacity-100' : 'opacity-0'}`}
                alt={property.title} 
              />
            ))}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === currentImgIndex ? 'bg-white w-8' : 'bg-white/40 w-2'}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">{property.propertyType} • {property.lotType}</span>
                <h2 className="text-4xl font-bold text-gray-900">{property.title}</h2>
                <p className="text-gray-500 text-lg mt-1"><i className="fas fa-map-marker-alt mr-2 text-red-400"></i>{property.location}</p>
              </div>
              <div className="text-right"><p className="text-3xl font-black text-blue-700">${property.price.toLocaleString()}</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-8 border-y border-gray-100 my-8">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl"><i className="fas fa-bed text-blue-500 text-xl mb-2"></i><span className="text-lg font-bold">{property.beds}</span><span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Bedrooms</span></div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl"><i className="fas fa-bath text-blue-500 text-xl mb-2"></i><span className="text-lg font-bold">{property.baths}</span><span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Bathrooms</span></div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl"><i className="fas fa-car text-blue-500 text-xl mb-2"></i><span className="text-lg font-bold">{property.carParks}</span><span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Car Parks</span></div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl"><i className="fas fa-expand-arrows-alt text-blue-500 text-xl mb-2"></i><span className="text-lg font-bold">{property.sqft}</span><span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Sq. Ft.</span></div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl"><i className="fas fa-file-contract text-blue-500 text-xl mb-2"></i><span className="text-sm font-bold truncate max-w-full">{property.lotType}</span><span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Lot Type</span></div>
            </div>
            <div><h4 className="text-xl font-bold mb-4">Property Description</h4><p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">{property.description}</p></div>
          </div>
        </div>
        <div className="lg:col-span-1"><div className="sticky top-24"><LeadForm property={property} onSubmit={onAddLead} /></div></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('public');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState('none');
  
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('therin_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('therin_leads');
    return saved ? JSON.parse(saved) : [];
  });
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('therin_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', phone: '', location: '', referral: '' });

  useEffect(() => {
    localStorage.setItem('therin_properties', JSON.stringify(properties));
    localStorage.setItem('therin_leads', JSON.stringify(leads));
    localStorage.setItem('therin_config', JSON.stringify(config));
    
    // Listen for lead updates from other tabs (simulated real-time)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'therin_leads' && e.newValue) {
        const newLeads = JSON.parse(e.newValue);
        if (newLeads.length > leads.length) {
          triggerBrowserNotification(newLeads[0]);
        }
        setLeads(newLeads);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [properties, leads, config]);

  const triggerBrowserNotification = (lead: Lead) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification("New Lead Captured! 🚀", {
        body: `${lead.name} is interested in ${lead.propertyName}`,
        icon: 'https://cdn-icons-png.flaticon.com/512/1067/1067566.png'
      });
    }
  };

  const filteredAndSortedProperties = useMemo(() => {
    let result = properties.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (priceSort === 'low-high') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-low') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [properties, searchQuery, priceSort]);

  const handleAddProperty = (p: Omit<Property, 'id'>) => {
    const newProperty = { ...p, id: Date.now().toString() };
    setProperties([...properties, newProperty]);
  };

  const handleUpdateProperty = (p: Property) => {
    setProperties(properties.map(item => item.id === p.id ? p : item));
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm("Delete this listing?")) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleUpdateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleAddLead = (leadData: Omit<Lead, 'id' | 'timestamp' | 'status'>) => {
    const newLead: Lead = { 
      ...leadData, 
      id: Date.now().toString(), 
      timestamp: new Date().toISOString(),
      status: 'New'
    };
    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);
    localStorage.setItem('therin_leads', JSON.stringify(updatedLeads));
    
    // Notify if permission is already granted
    triggerBrowserNotification(newLead);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddLead({
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone || 'N/A',
      countryState: contactForm.location || 'N/A',
      propertyId: 'GENERAL',
      propertyName: 'General Inquiry',
      agentReferral: contactForm.referral || 'Website Form'
    });
    alert(`Thank you ${contactForm.name}! Your inquiry has been received. Our team will contact you soon.`);
    setContactForm({ name: '', email: '', message: '', phone: '', location: '', referral: '' });
  };

  const renderContent = () => {
    switch (view) {
      case 'public':
        return (
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {config.adsEnabled && <AdCarousel ads={config.ads} />}
            <header className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Featured <span className="text-blue-700">Listings</span></h1>
                <p className="text-gray-500">Luxury living curated by {config.siteName}.</p>
              </div>
            </header>
            <SearchBar searchValue={searchQuery} onSearchChange={setSearchQuery} sortValue={priceSort} onSortChange={setPriceSort} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProperties.length > 0 ? (
                filteredAndSortedProperties.map(p => (
                  <PropertyCard key={p.id} property={p} onSelect={(prop) => { setSelectedProperty(prop); setView('property-detail'); window.scrollTo(0,0); }} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                  <i className="fas fa-search text-4xl text-gray-200 mb-4"></i>
                  <p className="text-gray-400">No properties found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="max-w-7xl mx-auto p-8 text-center">
            <h2 className="text-3xl font-bold mb-8 uppercase tracking-widest text-blue-900">Portfolio Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {properties.map(p => (
                <div key={p.id} className="h-64 rounded-xl overflow-hidden shadow-md group relative">
                   <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.title} />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-bold text-sm text-center px-4">{p.title}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="max-w-3xl mx-auto p-8 py-20 text-center">
            <h2 className="text-4xl font-bold mb-8">About {config.siteName}</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12 whitespace-pre-line">{config.aboutText}</p>
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 shadow-sm">
              <p className="font-bold text-blue-800 uppercase tracking-widest text-xs mb-2">Registered Agency Profile</p>
              <p className="text-2xl font-black text-blue-900">License: {config.agentNo}</p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-7xl mx-auto p-8 py-20">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-blue-700 p-12 text-white">
                <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
                <p className="mb-12 opacity-80 text-lg">Our elite real estate specialists are ready to assist you.</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4"><i className="fas fa-phone-alt text-xl"></i> {config.phone}</div>
                  <div className="flex items-center gap-4"><i className="fas fa-id-badge text-xl"></i> {config.agentNo}</div>
                  <div className="flex items-center gap-4"><i className="fas fa-map-marker-alt text-xl"></i> Global HQ, Prime District</div>
                </div>
              </div>
              <div className="p-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Send an Inquiry</h3>
                <form className="space-y-4" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-lg" required value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                    <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                  </div>
                  <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-lg" required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                  <input type="text" placeholder="Your Location (State/Country)" className="w-full p-3 border rounded-lg" value={contactForm.location} onChange={e => setContactForm({...contactForm, location: e.target.value})} />
                  <input type="text" placeholder="Referral Code / Number (Optional)" className="w-full p-3 border rounded-lg" value={contactForm.referral} onChange={e => setContactForm({...contactForm, referral: e.target.value})} />
                  <textarea placeholder="How can we help?" rows={3} className="w-full p-3 border rounded-lg" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})}></textarea>
                  <button type="submit" className="bg-blue-700 text-white w-full py-3 rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all">Submit Inquiry</button>
                </form>
              </div>
            </div>
          </div>
        );
      case 'property-detail':
        return selectedProperty ? (
          <PropertyDetailView 
            property={selectedProperty} 
            onBack={() => setView('public')} 
            onAddLead={handleAddLead}
          />
        ) : null;
      case 'admin':
        return (
          <CMSPanel 
            properties={properties} 
            leads={leads} 
            siteConfig={config} 
            onUpdateProperty={handleUpdateProperty} 
            onAddProperty={handleAddProperty} 
            onDeleteProperty={handleDeleteProperty} 
            onUpdateConfig={setConfig}
            onUpdateLeadStatus={handleUpdateLeadStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentView={view} setView={setView} config={config} />
      <main className="flex-grow">{renderContent()}</main>
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div><h4 className="font-bold text-xl mb-4 text-blue-900 flex items-center gap-2"><i className="fas fa-building"></i> {config.siteName}</h4><p className="text-gray-500 text-sm leading-relaxed">{config.footerText}</p></div>
          <div><h4 className="font-bold mb-4 text-gray-900 uppercase tracking-widest text-xs">Quick Navigation</h4><div className="flex flex-col gap-3 text-sm text-gray-400"><button onClick={() => setView('public')} className="text-left hover:text-blue-600 transition-colors">Browse Properties</button><button onClick={() => setView('gallery')} className="text-left hover:text-blue-600 transition-colors">Property Gallery</button><button onClick={() => setView('about')} className="text-left hover:text-blue-600 transition-colors">About the Agency</button><button onClick={() => setView('contact')} className="text-left hover:text-blue-600 transition-colors">Contact Agent</button></div></div>
          <div className="text-left"><h4 className="font-bold mb-4 text-gray-900 uppercase tracking-widest text-xs">Direct Contact</h4><div className="space-y-2"><p className="text-gray-900 font-bold">{config.siteName}</p><p className="text-gray-500 text-sm flex items-center gap-2"><i className="fas fa-id-badge text-gray-400"></i> No. Agent {config.agentNo}</p><p className="text-gray-500 text-sm flex items-center gap-2"><i className="fas fa-phone-alt text-gray-400"></i> Phone: {config.phone}</p></div></div>
        </div>
      </footer>
      <WhatsAppFloat phone={config.phone} agentName={config.siteName} />
    </div>
  );
};

export default App;
