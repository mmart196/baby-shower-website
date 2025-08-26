import { useState, useEffect, useCallback } from 'react';
import { WishlistItem } from '../types';
import { initialWishlistItems } from '../data/initialData';

const STORAGE_KEY = 'baby-shower-wishlist';

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load items from localStorage on mount
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        // Ensure dates are properly restored
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          claimedAt: item.claimedAt ? new Date(item.claimedAt) : undefined
        }));
        setItems(itemsWithDates);
      } else {
        setItems(initialWishlistItems);
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      setItems(initialWishlistItems);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    if (!loading && items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loading]);

  // Enhanced: Claim an item
  const claimItem = useCallback((itemId: string, claimedBy?: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            claimed: true, 
            claimedBy: claimedBy || 'Anonymous',
            claimedAt: new Date()
          }
        : item
    ));
  }, []);

  // Enhanced: Unclaim an item (admin function)
  const unclaimItem = useCallback((itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            claimed: false, 
            claimedBy: undefined,
            claimedAt: undefined
          }
        : item
    ));
  }, []);

  // Add new item (admin function)
  const addItem = useCallback((item: Omit<WishlistItem, 'id'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: Date.now().toString(),
      claimed: false
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  // Update item (admin function)
  const updateItem = useCallback((itemId: string, updates: Partial<WishlistItem>) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, ...updates }
        : item
    ));
  }, []);

  // Delete item (admin function)
  const deleteItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  // Filter functions
  const getItemsByCategory = useCallback((category: string) => {
    return items.filter(item => category === 'All' || item.category === category);
  }, [items]);

  const getUnclaimedItems = useCallback(() => {
    return items.filter(item => !item.claimed);
  }, [items]);

  const getClaimedItems = useCallback(() => {
    return items.filter(item => item.claimed);
  }, [items]);

  return {
    items,
    loading,
    claimItem,
    unclaimItem,
    addItem,
    updateItem,
    deleteItem,
    getItemsByCategory,
    getUnclaimedItems,
    getClaimedItems
  };
};
