
import React, { useState, useEffect } from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (p: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const images = [property.imageUrl, ...(property.extraImages || [])].filter(Boolean);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
      onClick={() => onSelect(property)}
    >
      <div className="relative h-64 overflow-hidden">
        {images.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`${property.title} - ${idx}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === currentImgIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
            property.status === 'Available' ? 'bg-green-500 text-white' : 
            property.status === 'Sold' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
          }`}>
            {property.status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm bg-blue-700 text-white">
            {property.propertyType}
          </span>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-1 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all ${idx === currentImgIndex ? 'bg-white w-4' : 'bg-white/50 w-1'}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-blue-700 font-black text-lg shadow-lg z-10">
          ${property.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors line-clamp-1">{property.title}</h3>
        <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
          <i className="fas fa-map-marker-alt text-red-400"></i> {property.location}
        </p>
        
        <div className="mt-auto grid grid-cols-4 gap-2 pt-4 border-t border-gray-100 text-gray-600 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Beds</span>
            <div className="flex items-center gap-1">
              <i className="fas fa-bed text-blue-400 text-xs"></i>
              <span className="font-bold text-sm">{property.beds}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Baths</span>
            <div className="flex items-center gap-1">
              <i className="fas fa-bath text-blue-400 text-xs"></i>
              <span className="font-bold text-sm">{property.baths}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Cars</span>
            <div className="flex items-center gap-1">
              <i className="fas fa-car text-blue-400 text-xs"></i>
              <span className="font-bold text-sm">{property.carParks}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Sqft</span>
            <div className="flex items-center gap-1">
              <i className="fas fa-expand text-blue-400 text-xs"></i>
              <span className="font-bold text-sm truncate max-w-full">{property.sqft}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
