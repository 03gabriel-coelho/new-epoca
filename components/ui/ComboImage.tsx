import React from 'react';
import ProductImage from './ProductImage';
import { Product } from '../../types';

interface ComboImageProps {
  products: Product[];
  alt: string;
  className?: string;
}

const ComboImage: React.FC<ComboImageProps> = ({ products, alt, className = '' }) => {
  const visibleProducts = products.slice(0, 4);
  const gridClassName =
    visibleProducts.length === 1
      ? 'grid-cols-1'
      : visibleProducts.length === 2
        ? 'grid-cols-2'
        : 'grid-cols-2';

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-50 ${className}`}>
      <div className={`grid h-full w-full gap-2 p-3 ${gridClassName}`}>
        {visibleProducts.map((product) => (
          <div key={product.id} className="h-full w-full rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
            <ProductImage
              src={product.image_path}
              alt={`${alt} - ${product.description}`}
              className="absolute h-full w-full rounded-lg"
              imgClassName="absolute h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
      {products.length > 4 && (
        <div className="absolute bottom-3 right-3 rounded-full bg-[#be342e] px-2 py-1 text-[10px] font-bold text-white">
          +{products.length - 4}
        </div>
      )}
    </div>
  );
};

export default ComboImage;
