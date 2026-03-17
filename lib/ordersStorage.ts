import { mockOrders } from './mockData';
import { StoredOrder } from '../types';

const ORDERS_STORAGE_KEY = 'epoca_b2b_orders';

const safeWindow = () => (typeof window !== 'undefined' ? window : null);

export const getStoredOrders = (): StoredOrder[] => {
  const browserWindow = safeWindow();
  if (!browserWindow) {
    return [];
  }

  try {
    const raw = browserWindow.localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredOrder[]) : [];
  } catch {
    return [];
  }
};

export const getStoredOrdersByCustomer = (customerId: string) => {
  return getStoredOrders()
    .filter((order) => order.customer_id === customerId)
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
};

const getNextOrderNumber = () => {
  const maxStored = getStoredOrders().reduce((max, order) => Math.max(max, order.winthor_numped), 0);
  const maxMock = mockOrders.reduce((max, order) => Math.max(max, order.winthor_numped), 0);
  return Math.max(maxStored, maxMock) + 1;
};

export const createStoredOrder = (order: Omit<StoredOrder, 'id' | 'winthor_numped'>) => {
  const nextOrder: StoredOrder = {
    ...order,
    id: `order-${Date.now()}`,
    winthor_numped: getNextOrderNumber(),
  };

  const nextOrders = [nextOrder, ...getStoredOrders()];
  const browserWindow = safeWindow();

  if (browserWindow) {
    browserWindow.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
  }

  return nextOrder;
};
