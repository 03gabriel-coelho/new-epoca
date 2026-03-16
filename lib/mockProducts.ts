import { Product } from '../types';
import rawMockProducts from './mockProducts.json';

type RawMockProduct = {
  CODPROD: number;
  NOME: string;
  CODBARRAS: number | string;
  FORNECEDOR: string;
  PVENDA: number;
  OFERTA: number;
  QTUNIT: number;
  DADOSTECNICOS?: string | null;
  LARGURA?: number | null;
  COMPRIMENTO?: number | null;
  ALTURA?: number | null;
  PESO?: number | null;
  FOTO_CAPA?: string | null;
  IMAGE2?: string | null;
  IMAGE3?: string | null;
  IMAGE4?: string | null;
  IMAGE5?: string | null;
  DEPARTAMENTO?: string | null;
  ESTOQUE?: number | null;
};

const toDimension = (value?: number | null) => `${value ?? 0} cm`;
const toWeight = (value?: number | null) => `${value ?? 0} kg`;
const toImageUrl = (imageName?: string | null) => {
  if (!imageName) {
    return 'https://placehold.co/500x500/f1f5f9/94a3b8?text=Sem+Imagem';
  }

  return `https://storage.epocaonline.com.br/produtos/${imageName}`;
};

export const mockProductsFromERP: Product[] = (rawMockProducts as RawMockProduct[]).map((item) => {
  const price = item.OFERTA && item.OFERTA > 0 ? item.OFERTA : item.PVENDA;
  const galleryImages = [
    item.FOTO_CAPA,
    item.IMAGE2,
    item.IMAGE3,
    item.IMAGE4,
    item.IMAGE5,
  ]
    .filter((imageName): imageName is string => Boolean(imageName))
    .map((imageName) => toImageUrl(imageName))
    .filter((imageUrl, index, array) => array.indexOf(imageUrl) === index);

  return {
    id: String(item.CODPROD),
    winthor_codprod: item.CODPROD,
    description: item.NOME,
    department: (item.DEPARTAMENTO || 'GERAL').trim(),
    price,
    image_path: toImageUrl(item.FOTO_CAPA),
    gallery_images: galleryImages,
    long_description: item.DADOSTECNICOS || item.NOME,
    details: {
      weight: toWeight(item.PESO),
      height: toDimension(item.ALTURA),
      width: toDimension(item.LARGURA),
      length: toDimension(item.COMPRIMENTO),
      unit: item.QTUNIT && item.QTUNIT > 1 ? 'CX' : 'UN',
      ean: String(item.CODBARRAS ?? ''),
      brand: item.FORNECEDOR,
      manufacturer: item.FORNECEDOR,
      stock_quantity: item.ESTOQUE ?? 0,
    },
  };
});
