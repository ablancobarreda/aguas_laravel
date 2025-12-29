import { useState, useEffect, useRef } from 'react';

export default function CustomSelect({
  options = [],
  value = null,
  onChange,
  placeholder = 'Seleccionar...',
  isDisabled = false,
  isLoading = false,
  isClearable = false,
  isSearchable = false,
  isMulti = false,
  error = false,
  helperText,
  size = 'md',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const controlRef = useRef(null);

  const sizeClasses = {
    sm: 'h-9 text-sm px-3 py-2',
    md: 'h-12 text-sm px-3 py-3',
    lg: 'h-14 text-base px-4 py-3'
  };

  const filteredOptions = searchTerm && isSearchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isDisabled && !isLoading) {
      setIsOpen(!isOpen);
      if (!isOpen && isSearchable) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  const handleOptionClick = (option) => {
    if (option.isDisabled) return;
    
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.some(v => v.value === option.value);
      
      if (isSelected) {
        const newValues = currentValues.filter(v => v.value !== option.value);
        onChange?.(newValues);
      } else {
        onChange?.([...currentValues, option]);
      }
    } else {
      onChange?.(option);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (isMulti) {
      onChange?.([]);
    } else {
      onChange?.(null);
    }
  };

  const getDisplayValue = () => {
    if (isMulti) {
      const values = Array.isArray(value) ? value : [];
      if (values.length === 0) return placeholder;
      if (values.length === 1) return values[0].label;
      return `${values.length} seleccionados`;
    }
    return value ? value.label : placeholder;
  };

  const displayValue = getDisplayValue();
  const hasValue = isMulti ? (Array.isArray(value) && value.length > 0) : !!value;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative" ref={dropdownRef}>
        <div
          className={`
            ${sizeClasses[size]}
            relative w-full bg-white border rounded-lg cursor-pointer
            flex items-center justify-between
            focus-within:ring-2 focus-within:ring-[#05249E] focus-within:border-transparent
            transition-all duration-200
            ${error
              ? 'border-red-300 ring-1 ring-red-300'
              : isOpen
                ? 'border-[#05249E] ring-2 ring-[#05249E]/10'
                : 'border-gray-300 hover:border-gray-400'
            }
            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          `}
          onClick={handleToggle}
          ref={controlRef}
        >
          <div className="flex-1 flex items-center min-w-0">
            {isOpen && isSearchable ? (
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500 font-medium"
                placeholder="Buscar..."
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className={`truncate font-medium ${hasValue ? 'text-gray-900' : 'text-gray-500'}`}>
                {displayValue}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 ml-2">
            {isClearable && hasValue && !isDisabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto mt-1"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No hay opciones disponibles
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = isMulti
                  ? (Array.isArray(value) && value.some(v => v.value === option.value))
                  : value?.value === option.value;

                return (
                  <div
                    key={option.value}
                    className={`
                      px-3 py-2 cursor-pointer text-sm font-medium transition-colors
                      flex items-center justify-between
                      ${option.isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : isSelected
                          ? 'bg-[#05249E] text-white hover:bg-[#041d7a]'
                          : 'text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleOptionClick(option)}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

