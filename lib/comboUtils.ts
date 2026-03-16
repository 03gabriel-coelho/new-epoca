import { Combo, ComboItem, CartItem, Product } from '../types';

export type ComboSelections = Record<string, Record<string, number>>;

export const mapComboItemsWithProducts = (items: ComboItem[], products: Product[]) =>
  items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.product_id);
      return product ? { ...item, product } : null;
    })
    .filter((entry): entry is { product_id: string; quantity: number; product: Product } => Boolean(entry));

const getCartRewardQuantity = (item?: CartItem) =>
  (item?.combo_breakdown || [])
    .filter((entry) => entry.role === 'reward')
    .reduce((total, entry) => total + entry.quantity, 0);

export const getCartTriggerEligibleQuantity = (cart: CartItem[], productId: string) => {
  const cartEntry = cart.find((item) => item.product_id === productId);
  if (!cartEntry) {
    return 0;
  }

  return Math.max(cartEntry.quantity - getCartRewardQuantity(cartEntry), 0);
};

export const getComboProducts = (combo: Combo, products: Product[], selections?: ComboSelections) =>
  mapComboItemsWithProducts(resolveComboQualifyingItems(combo, selections || createDefaultComboSelections(combo)), products);

export const getComboRewardProducts = (combo: Combo, products: Product[]) => mapComboItemsWithProducts(combo.reward_items || [], products);

export const createDefaultComboSelections = (combo: Combo): ComboSelections => {
  const entries = (combo.selection_groups || []).map((group) => {
    const firstEligible = group.eligible_product_ids[0];
    return [
      group.id,
      firstEligible ? { [firstEligible]: group.required_quantity } : {},
    ];
  });

  return Object.fromEntries(entries);
};

export const resolveComboQualifyingItems = (combo: Combo, selections?: ComboSelections): ComboItem[] => {
  const fixedItems = combo.qualifying_items || [];
  const selectionItems = (combo.selection_groups || []).flatMap((group) => {
    const groupSelections = selections?.[group.id] || {};
    return Object.entries(groupSelections)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ product_id: productId, quantity }));
  });

  return [...fixedItems, ...selectionItems];
};

export const getSelectionGroupQuantity = (groupId: string, selections: ComboSelections) =>
  Object.values(selections[groupId] || {}).reduce((total, quantity) => total + quantity, 0);

export const isComboSelectionComplete = (combo: Combo, selections: ComboSelections) =>
  (combo.selection_groups || []).every((group) => getSelectionGroupQuantity(group.id, selections) >= group.required_quantity);

export const getComboBasePrice = (combo: Combo, products: Product[], selections?: ComboSelections) =>
  mapComboItemsWithProducts(
    resolveComboQualifyingItems(combo, selections || createDefaultComboSelections(combo)),
    products
  ).reduce((total, item) => total + item.product.price * item.quantity, 0);

export const getComboDiscountValue = (combo: Combo, products: Product[], selections?: ComboSelections) => {
  if (!combo.discount_percentage) {
    return 0;
  }

  return Number((getComboBasePrice(combo, products, selections) * (combo.discount_percentage / 100)).toFixed(2));
};

export const getComboPrice = (combo: Combo, products: Product[], selections?: ComboSelections) => {
  const basePrice = getComboBasePrice(combo, products, selections);
  if (!combo.discount_percentage) {
    return Number(basePrice.toFixed(2));
  }

  return Number((basePrice - (basePrice * (combo.discount_percentage / 100))).toFixed(2));
};

export const getComboRewardValue = (combo: Combo, products: Product[]) =>
  getComboRewardProducts(combo, products).reduce((total, item) => total + item.product.price * item.quantity, 0);

export const getComboQuantityInCart = (combo: Combo, cart: CartItem[]) => {
  const fixedQuantities = combo.qualifying_items.map((comboItem) => {
    return Math.floor(getCartTriggerEligibleQuantity(cart, comboItem.product_id) / comboItem.quantity);
  });

  const selectionQuantities = (combo.selection_groups || []).map((group) => {
    const totalSelectedInCart = group.eligible_product_ids.reduce((total, productId) => {
      return total + getCartTriggerEligibleQuantity(cart, productId);
    }, 0);

    return Math.floor(totalSelectedInCart / group.required_quantity);
  });

  const quantities = [...fixedQuantities, ...selectionQuantities];

  if (quantities.length === 0) {
    return 0;
  }

  return Math.min(...quantities);
};

export const getAppliedComboQualifyingItemsFromCart = (combo: Combo, cart: CartItem[]): ComboItem[] => {
  const appliedCount = getComboQuantityInCart(combo, cart);
  if (appliedCount <= 0) {
    return [];
  }

  const fixedItems = combo.qualifying_items.map((comboItem) => ({
    product_id: comboItem.product_id,
    quantity: comboItem.quantity * appliedCount,
  }));

  const selectionItems = (combo.selection_groups || []).flatMap((group) => {
    let remaining = group.required_quantity * appliedCount;

    return group.eligible_product_ids.flatMap((productId) => {
      if (remaining <= 0) {
        return [];
      }

      const cartEntry = cart.find((item) => item.product_id === productId);
      const availableQuantity = getCartTriggerEligibleQuantity(cart, productId);
      if (availableQuantity <= 0) {
        return [];
      }

      const quantity = Math.min(availableQuantity, remaining);
      remaining -= quantity;

      return quantity > 0 ? [{ product_id: productId, quantity }] : [];
    });
  });

  return [...fixedItems, ...selectionItems];
};

export const getAppliedComboRewardItemsFromCart = (combo: Combo, cart: CartItem[]): ComboItem[] => {
  const appliedCount = getComboQuantityInCart(combo, cart);
  if (appliedCount <= 0) {
    return [];
  }

  return (combo.reward_items || []).map((rewardItem) => ({
    product_id: rewardItem.product_id,
    quantity: rewardItem.quantity * appliedCount,
  }));
};

export const getCartComboBasePrice = (combo: Combo, products: Product[], cart: CartItem[]) =>
  mapComboItemsWithProducts(getAppliedComboQualifyingItemsFromCart(combo, cart), products).reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

export const getCartComboDiscountValue = (combo: Combo, products: Product[], cart: CartItem[]) => {
  if (!combo.discount_percentage) {
    return 0;
  }

  return Number((getCartComboBasePrice(combo, products, cart) * (combo.discount_percentage / 100)).toFixed(2));
};

export const getCartComboRewardValue = (combo: Combo, products: Product[], cart: CartItem[]) =>
  mapComboItemsWithProducts(getAppliedComboRewardItemsFromCart(combo, cart), products).reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

export const getAllComboVisualProducts = (combo: Combo, products: Product[]) => {
  const qualifyingProducts = mapComboItemsWithProducts(resolveComboQualifyingItems(combo, createDefaultComboSelections(combo)), products).map((item) => item.product);
  const rewardProducts = getComboRewardProducts(combo, products).map((item) => item.product);
  const unique = new Map<string, Product>();

  [...qualifyingProducts, ...rewardProducts].forEach((product) => {
    unique.set(product.id, product);
  });

  return Array.from(unique.values());
};

export const getComboSummaryLabel = (combo: Combo) => {
  switch (combo.rule_type) {
    case 'discount_percentage':
      return `Desconto de ${combo.discount_percentage || 0}%`;
    case 'buy_x_get_y':
      return 'Compre e ganhe';
    case 'combo_bundle':
      return 'Casadinha';
    case 'value_threshold_bonus':
      return `Meta de R$ ${combo.minimum_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`;
    default:
      return 'Combo promocional';
  }
};
