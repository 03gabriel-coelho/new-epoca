const FAVORITES_STORAGE_KEY = 'epoca_b2b_favorites';

const safeWindow = () => (typeof window !== 'undefined' ? window : null);

const readFavoritesMap = (): Record<string, string[]> => {
  const browserWindow = safeWindow();
  if (!browserWindow) {
    return {};
  }

  try {
    const raw = browserWindow.localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
  } catch {
    return {};
  }
};

const saveFavoritesMap = (favoritesMap: Record<string, string[]>) => {
  const browserWindow = safeWindow();
  if (!browserWindow) {
    return;
  }

  browserWindow.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesMap));
};

export const getStoredFavorites = (ownerKey: string) => {
  const favoritesMap = readFavoritesMap();
  return favoritesMap[ownerKey] || [];
};

export const saveStoredFavorites = (ownerKey: string, productIds: string[]) => {
  const favoritesMap = readFavoritesMap();
  favoritesMap[ownerKey] = productIds;
  saveFavoritesMap(favoritesMap);
};
