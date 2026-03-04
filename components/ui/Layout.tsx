import React from 'react';

export const Card = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-slate-100 bg-white text-slate-900 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  disabled,
  type = 'button'
}: { 
  children?: React.ReactNode; 
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive' | 'brand'; 
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  // Walmart buttons are usually strictly rounded-full
  const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-5 py-2";
  
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-brand-dark shadow-md hover:shadow-lg", // Walmart Blue
    brand: "bg-brand-yellow text-slate-900 hover:bg-yellow-400", // Walmart Yellow
    outline: "border border-slate-300 bg-white hover:bg-brand-light hover:border-brand-blue text-slate-900",
    ghost: "hover:bg-slate-100 text-slate-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button 
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'default', className = '' }: { children?: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'destructive' | 'brand', className?: string }) => {
  const styles = {
    default: "bg-slate-100 text-slate-900",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800",
    brand: "bg-brand-light text-brand-dark border border-brand-blue/20", // Blue Theme
  };
  
  return (
    <div className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-bold transition-colors ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const Tooltip = ({ content, children }: { content: string, children?: React.ReactNode }) => (
  <div className="relative flex items-center justify-center group">
    {children}
    <div className="absolute z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-[11px] font-medium rounded px-2 py-1 top-full mt-2 whitespace-nowrap shadow-md">
      {content}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800"></div>
    </div>
  </div>
);