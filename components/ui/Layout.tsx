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
  const baseStyle = "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13733D]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-[#13733D] text-white shadow-md hover:bg-[#0F5C31] hover:shadow-lg",
    brand: "bg-[#E7F5EC] text-[#13733D] hover:bg-[#D3EEDC]",
    outline: "border border-[#B8DCC5] bg-white  hover:border-[#13733D] hover:bg-[#EEF8F1]",
    ghost: "text-[#13733D] hover:bg-[#EEF8F1]",
    destructive: "hover:bg-[#0F5C31] text-white hover:bg-[#0F5C31]",
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
    success: "bg-[#E7F5EC] text-[#13733D]",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-[#13733D] text-red-800",
    brand: "border border-[#13733D]/20 bg-[#EEF8F1] text-[#13733D]",
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
