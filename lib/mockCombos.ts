import { Combo, Product } from '../types';
import { mockProductsFromERP } from './mockProducts';

const getProductByCode = (code: number, fallbackIndex: number): Product => {
  const byCode = mockProductsFromERP.find((product) => product.winthor_codprod === code);
  if (byCode) {
    return byCode;
  }

  const fallback = mockProductsFromERP[fallbackIndex];
  if (!fallback) {
    throw new Error(`Produto mock nao encontrado para codigo ${code} nem para indice ${fallbackIndex}.`);
  }

  return fallback;
};

const limpaVidrosUau = getProductByCode(4686, 0);
const herbissimoNeutro = getProductByCode(20515, 1);
const finiMorango = getProductByCode(46733, 2);
const neveFolhaDupla = getProductByCode(59692, 3);
const neveFolhaTripla = getProductByCode(59688, 4);
const neveFloral = getProductByCode(64811, 5);
const scottDuramax = getProductByCode(59681, 6);
const coryPalito = getProductByCode(60134, 7);
const sucoUva = getProductByCode(64072, 8);
const sucoCaju = getProductByCode(64069, 9);
const energOriginal = getProductByCode(64055, 10);
const energManga = getProductByCode(64053, 11);
const jontexLubXL = getProductByCode(64323, 12);
const jontexLub = getProductByCode(58110, 13);
const ollaMorango = getProductByCode(53777, 14);
const farnese85Leite = getProductByCode(64489, 15);
const farnese180Puro = getProductByCode(64157, 16);
const farnese180Pitaya = getProductByCode(64154, 17);
const farnese180ErvaDoce = getProductByCode(64151, 18);
const farnese85ErvaDoce = getProductByCode(64486, 19);
const farnese180Lavanda = getProductByCode(64158, 20);
const farnese180Aveia = getProductByCode(64156, 21);
const farnese85Frutas = getProductByCode(64487, 22);
const farnese180Flor = getProductByCode(64155, 23);

export const mockCombos: Combo[] = [
  {
    id: 'combo-farnese-flex-18x2',
    rule_code: 65737,
    rule_type: 'buy_x_get_y',
    name: 'SAB FARNESE HIDRAT 180GRS - FRAGRANCIAS - 18X2',
    description: 'Monte 18 unidades escolhendo entre varios sabonetes Farnese elegiveis e ganhe 2 unidades de premio. Voce pode combinar os itens da linha para completar a regra.',
    benefit_label: 'FLEX 18x2',
    minimum_quantity: 18,
    category: 'Escolha da linha',
    qualifying_items: [],
    selection_groups: [
      {
        id: 'farnese-sabonetes',
        label: 'Escolha 18 sabonetes Farnese',
        helper_text: 'Voce pode combinar fragrancias e gramaturas diferentes para completar a regra.',
        required_quantity: 18,
        eligible_product_ids: [
          farnese85Leite.id,
          farnese180Puro.id,
          farnese180Pitaya.id,
          farnese180ErvaDoce.id,
          farnese85ErvaDoce.id,
          farnese180Lavanda.id,
          farnese180Aveia.id,
          farnese85Frutas.id,
          farnese180Flor.id
        ]
      }
    ],
    reward_items: [{ product_id: farnese180Pitaya.id, quantity: 2 }],
    image_product_ids: [farnese85Leite.id, farnese180Puro.id, farnese180Lavanda.id, farnese180Flor.id],
    prize_text: `2x ${farnese180Pitaya.description}`,
    valid_until: '2026-03-21'
  },
  {
    id: 'combo-ingleza-3',
    rule_code: 57239,
    rule_type: 'discount_percentage',
    name: 'COMBO INGLEZA - 3%',
    description: 'Na compra de 1 item da linha Ingleza, o cliente ganha 3% de desconto.',
    benefit_label: '3% OFF',
    discount_percentage: 3,
    minimum_quantity: 1,
    category: 'Desconto por linha',
    qualifying_items: [{ product_id: limpaVidrosUau.id, quantity: 1 }],
    image_product_ids: [limpaVidrosUau.id],
    prize_text: '3%',
    valid_until: '2026-03-21'
  },
  {
    id: 'combo-herbissimo-12x1',
    rule_code: 61075,
    rule_type: 'buy_x_get_y',
    name: 'DS HERBISSIMO CREM - 12X1',
    description: 'Na compra de 12 unidades de DS Herbissimo Creme 55g fragrancias, o cliente ganha 1 unidade do DS Herbissimo Creme sem perfume neutro.',
    benefit_label: '12x1',
    minimum_quantity: 12,
    category: 'Leve mais e ganhe',
    qualifying_items: [{ product_id: herbissimoNeutro.id, quantity: 12 }],
    reward_items: [{ product_id: herbissimoNeutro.id, quantity: 1 }],
    image_product_ids: [herbissimoNeutro.id],
    prize_text: herbissimoNeutro.description,
    valid_until: '2026-03-21'
  },
  {
    id: 'combo-fini-10x1',
    rule_code: 61926,
    rule_type: 'buy_x_get_y',
    name: 'COMBO FINI TUBES 12X15G SABORES - 10X1',
    description: 'A cada 10 unidades de Bala Fini Tubes 12x15g sabores, o cliente ganha 1 unidade de Bala Fini Tubes Morango.',
    benefit_label: '10x1',
    minimum_quantity: 10,
    category: 'Brinde por quantidade',
    qualifying_items: [{ product_id: finiMorango.id, quantity: 10 }],
    reward_items: [{ product_id: finiMorango.id, quantity: 1 }],
    image_product_ids: [finiMorango.id],
    prize_text: finiMorango.description,
    valid_until: '2026-03-21'
  },
  {
    id: 'combo-cory-100',
    rule_code: 69000,
    rule_type: 'value_threshold_bonus',
    name: 'CORY - A CADA R$ 100,00 GANHE 2 UN',
    description: 'A cada R$ 100,00 em produtos Cory, o cliente ganha 2 unidades de Palitos Cory Chocolate ao Leite.',
    benefit_label: 'R$ 100 = +2UN',
    minimum_value: 100,
    category: 'Meta por valor',
    qualifying_items: [
      { product_id: coryPalito.id, quantity: 8 },
      { product_id: finiMorango.id, quantity: 6 }
    ],
    reward_items: [{ product_id: coryPalito.id, quantity: 2 }],
    image_product_ids: [coryPalito.id, finiMorango.id],
    prize_text: coryPalito.description,
    valid_until: '2026-03-21'
  },
  {
    id: 'combo-suzano-6',
    rule_code: 70303,
    rule_type: 'combo_bundle',
    name: 'COMBO SUZANO - 6% DE DESCONTO',
    description: 'Combo casado com itens obrigatorios da linha Neve e Scott. Ao montar o kit completo, o cliente recebe 6% de desconto.',
    benefit_label: '6% NO KIT',
    discount_percentage: 6,
    category: 'Casadinha',
    qualifying_items: [
      { product_id: neveFolhaDupla.id, quantity: 10 },
      { product_id: neveFolhaTripla.id, quantity: 1 },
      { product_id: neveFloral.id, quantity: 3 },
      { product_id: scottDuramax.id, quantity: 6 }
    ],
    image_product_ids: [neveFolhaDupla.id, neveFolhaTripla.id, neveFloral.id, scottDuramax.id],
    prize_text: '6%',
    valid_until: '2026-03-31'
  },
  {
    id: 'combo-suco-uva-caju',
    rule_code: 70274,
    rule_type: 'buy_x_get_y',
    name: 'SUCO DAFRUTA UVA - GANHE 1 CAJU',
    description: 'A cada 12 unidades de suco Dafruta ou Maguary Uva 1L, o cliente ganha 1 unidade do nectar Caju 1L.',
    benefit_label: '12x + 1',
    minimum_quantity: 12,
    category: 'Troca de premio',
    qualifying_items: [{ product_id: sucoUva.id, quantity: 12 }],
    reward_items: [{ product_id: sucoCaju.id, quantity: 1 }],
    image_product_ids: [sucoUva.id, sucoCaju.id],
    prize_text: sucoCaju.description,
    valid_until: '2026-03-21'
  },
  {
    id: 'combo-flying-horse',
    rule_code: 70276,
    rule_type: 'buy_x_get_y',
    name: 'ENERG FLYING HORSE ORIGINAL -> MANGA',
    description: 'A cada 12 unidades do Energetico Flying Horse Original 473ml, o cliente ganha 1 unidade do sabor Manga.',
    benefit_label: '12x1 SABOR',
    minimum_quantity: 12,
    category: 'Premio em sabor',
    qualifying_items: [{ product_id: energOriginal.id, quantity: 12 }],
    reward_items: [{ product_id: energManga.id, quantity: 1 }],
    image_product_ids: [energOriginal.id, energManga.id],
    prize_text: energManga.description,
    valid_until: '2026-03-21'
  },
  {
    id: 'combo-jontex-10x1',
    rule_code: 66545,
    rule_type: 'buy_x_get_y',
    name: 'JONTEX - 10X1',
    description: 'Na compra de 10 unidades do preservativo Jontex Lub, o cliente ganha 1 unidade do Jontex Lub XL.',
    benefit_label: '10x1',
    minimum_quantity: 10,
    category: 'Brinde cruzado',
    qualifying_items: [{ product_id: jontexLub.id, quantity: 10 }],
    reward_items: [{ product_id: jontexLubXL.id, quantity: 1 }],
    image_product_ids: [jontexLub.id, jontexLubXL.id],
    prize_text: jontexLubXL.description,
    valid_until: '2026-03-21'
  },
  {
    id: 'combo-olla-10x1',
    rule_code: 66540,
    rule_type: 'buy_x_get_y',
    name: 'OLLA - 10X1',
    description: 'Na compra de 10 unidades do preservativo Olla Morango, o cliente ganha 1 unidade do mesmo item.',
    benefit_label: '10x1',
    minimum_quantity: 10,
    category: 'Brinde do mesmo item',
    qualifying_items: [{ product_id: ollaMorango.id, quantity: 10 }],
    reward_items: [{ product_id: ollaMorango.id, quantity: 1 }],
    image_product_ids: [ollaMorango.id],
    prize_text: ollaMorango.description,
    valid_until: '2026-03-21'
  }
];
