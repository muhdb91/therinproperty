
import React, { useState, useEffect } from 'react';
import { AdItem } from '../types';

interface AdCarouselProps {
  ads: AdItem[];
}

const AdCarousel: React.FC<AdCarouselProps> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) return null;

  return (
    <div className="relative w-full h-[200px] md:h-[350px] overflow-hidden rounded-3xl mb-12 group">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {ads.map((ad) => (
          <div key={ad.id} className="min-w-full h-full relative">
            <img 
              src={ad.imageUrl} 
              alt={ad.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Sponsored Content</span>
              <h3 className="text-white text-2xl md:text-4xl font-black">{ad.title}</h3>
              {ad.link && (
                <a 
                  href={ad.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 bg-white text-blue-700 w-fit px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors"
                >
                  Learn More
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {ads.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-white w-6' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdCarousel;
