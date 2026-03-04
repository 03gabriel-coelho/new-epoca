import React, { useState } from 'react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackText?: string;
  loading?: 'eager' | 'lazy';
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackText = 'PRODUTO SEM FOTO',
  loading = 'lazy',
}) => {
  const fallbackThumb =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<rect width="120" height="120" rx="12" fill="#e2e8f0"/>' +
        '<rect x="20" y="26" width="80" height="68" rx="8" fill="#cbd5e1"/>' +
        '<circle cx="42" cy="47" r="7" fill="#94a3b8"/>' +
        '<path d="M28 84l22-23 12 13 16-18 14 28H28z" fill="#64748b"/>' +
      '</svg>'
    );

  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const showFallback = !src || failed;

  return (
    <div className={`relative overflow-hidden bg-slate-50 ${className}`}>
      {!showFallback && !loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      )}

      {showFallback ? (
        <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
          <div className="flex flex-col items-center gap-2">
            <img src={fallbackThumb} alt="" className="w-12 h-12 opacity-80" />
            <span className="text-[10px] font-bold tracking-wide text-slate-500">
              {fallbackText}
            </span>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className={`${imgClassName} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};

export default ProductImage;
