import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'icon' | 'primary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full transition-all duration-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md shadow-sm border border-white/10",
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30",
    ghost: "hover:bg-black/5 text-gray-600 dark:text-gray-300 dark:hover:bg-white/10",
    icon: "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    xl: "h-16 w-16 text-2xl p-0", // For big play button
  };

  const sizeClasses = variant === 'icon' ? 'p-2 aspect-square' : sizes[size];

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};