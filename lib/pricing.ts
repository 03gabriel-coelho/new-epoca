import { Product } from '../types';

export const DELIVERY_ORIGIN_ADDRESS = 'Via vereador Joaquim Costa, 1405, Galpao 2, Contagem - MG';
const DELIVERY_ORIGIN_ZIP_CODE = '32150-240';

const getZipDigits = (value?: string | null) => (value || '').replace(/\D/g, '').slice(0, 8);

const roundCurrency = (value: number) => Number(value.toFixed(2));

export const getRegionalPriceMultiplier = (zipCode?: string | null) => {
  const targetDigits = getZipDigits(zipCode);
  const originDigits = getZipDigits(DELIVERY_ORIGIN_ZIP_CODE);

  if (targetDigits.length !== 8 || originDigits.length !== 8) {
    return 1;
  }

  const targetPrefix2 = Number(targetDigits.slice(0, 2));
  const originPrefix2 = Number(originDigits.slice(0, 2));
  const targetPrefix3 = Number(targetDigits.slice(0, 3));
  const originPrefix3 = Number(originDigits.slice(0, 3));
  const prefixDistance2 = Math.abs(targetPrefix2 - originPrefix2);
  const prefixDistance3 = Math.abs(targetPrefix3 - originPrefix3);
  const isMinasGerais = targetPrefix2 >= 30 && targetPrefix2 <= 39;
  const isMetroContagem = targetPrefix3 >= 320 && targetPrefix3 <= 339;

  if (targetDigits === originDigits) {
    return 1;
  }

  if (isMetroContagem) {
    return 1.003;
  }

  if (isMinasGerais && prefixDistance3 <= 15) {
    return 1.006;
  }

  if (isMinasGerais && prefixDistance2 <= 3) {
    return 1.012;
  }

  if (isMinasGerais) {
    return 1.018;
  }

  if (prefixDistance2 <= 10) {
    return 1.032;
  }

  if (prefixDistance2 <= 25) {
    return 1.047;
  }

  return 1.065;
};

export const getPricedProduct = (product: Product, zipCode?: string | null): Product => {
  const multiplier = getRegionalPriceMultiplier(zipCode);
  const basePrice = product.basePrice ?? product.price;
  const price = roundCurrency(basePrice * multiplier);

  return {
    ...product,
    basePrice,
    price,
    regionalAdjustment: roundCurrency(price - basePrice),
  };
};

export const getPricedProducts = (products: Product[], zipCode?: string | null) =>
  products.map((product) => getPricedProduct(product, zipCode));
