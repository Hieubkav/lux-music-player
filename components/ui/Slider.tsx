import React from 'react';

interface SliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ value, max, onChange, className = '' }) => {
  const percentage = (value / max) * 100;

  return (
    <div className={`relative flex items-center select-none touch-none w-full h-5 group ${className}`}>
      {/* Track Background */}
      <div className="relative w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
        {/* Fill */}
        <div 
          className="absolute h-full bg-indigo-500 rounded-full transition-all duration-100 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Invisible native input for accessibility and interaction */}
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />

      {/* Thumb (Visual Only - follows percentage) */}
      <div 
        className="absolute h-4 w-4 bg-white border-2 border-indigo-500 rounded-full shadow-lg pointer-events-none transition-all duration-100 ease-out group-hover:scale-125"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
};