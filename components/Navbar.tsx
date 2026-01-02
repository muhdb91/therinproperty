
import React from 'react';
import { SiteConfig, ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  config: SiteConfig;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, config }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setView('public')}
        >
          <div className="bg-blue-700 text-white p-2 rounded-lg">
            <i className="fas fa-building"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">{config.siteName}</span>
        </div>
        
        <div className="hidden lg:flex gap-8 items-center text-sm font-medium text-gray-600">
          <button onClick={() => setView('public')} className={`hover:text-blue-600 transition-colors ${currentView === 'public' ? 'text-blue-600' : ''}`}>Properties</button>
          <button onClick={() => setView('gallery')} className={`hover:text-blue-600 transition-colors ${currentView === 'gallery' ? 'text-blue-600' : ''}`}>Gallery</button>
          <button onClick={() => setView('about')} className={`hover:text-blue-600 transition-colors ${currentView === 'about' ? 'text-blue-600' : ''}`}>About</button>
          <button onClick={() => setView('contact')} className={`hover:text-blue-600 transition-colors ${currentView === 'contact' ? 'text-blue-600' : ''}`}>Contact Us</button>
        </div>

        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setView('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all text-sm ${
              currentView === 'admin' 
                ? 'bg-blue-700 text-white border-blue-700 shadow-md' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-lock"></i>
            Admin Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
