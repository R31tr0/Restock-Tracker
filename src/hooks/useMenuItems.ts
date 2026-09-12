import { useState, useEffect, useCallback } from 'react';
import { MenuItem, StockUpdatePayload } from '../types/menuItem';
import { fetchMenuItems, updateMenuItem } from '../api/menuApi';

export const useMenuItems = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await fetchMenuItems();

    if (result.ok) {
      setItems(result.data);
    }else {
      setError(result.error.message);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const updateStock = async (payload: StockUpdatePayload): Promise<boolean> => {
    const result = await updateMenuItem(payload);

    if (result.ok) {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === payload.id ? result.data : item))
      );
      return true;
    } else {
      setError(result.error.message);
      return false;
    }
  };
  return {
    items,
    loading,
    error,
    reload: loadMenu,
    updateStock,
  };
};