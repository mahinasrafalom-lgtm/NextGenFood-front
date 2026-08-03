import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder, disabled = false, error = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border rounded text-sm px-4 py-3 focus:outline-none focus:border-brand-mid bg-[#fdfdfd] cursor-pointer transition-colors text-left disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
      >
        <span className={`truncate ${selected ? 'text-gray-700' : disabled ? 'text-gray-400' : 'text-gray-500'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full bg-gray-50 border border-gray-200 rounded text-sm pl-8 pr-3 py-2 focus:outline-none focus:border-brand-mid"
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">No results found</li>
            ) : (
              filtered.map(o => (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(o.value)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${o.value === value ? 'bg-orange-50 text-brand-mid font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className="truncate">{o.label}</span>
                    {o.value === value && <Check size={14} className="text-brand-mid shrink-0 ml-2" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
