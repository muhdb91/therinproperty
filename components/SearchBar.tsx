
import React from 'react';

interface SearchBarProps {
  onSearchChange: (val: string) => void;
  onSortChange: (val: string) => void;
  searchValue: string;
  sortValue: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange, onSortChange, searchValue, sortValue }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-grow relative">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input 
          type="text" 
          placeholder="Search properties by name..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <div className="relative min-w-[180px]">
          <i className="fas fa-sort-amount-down absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          <select 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="none">Sort by Price</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
          <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
