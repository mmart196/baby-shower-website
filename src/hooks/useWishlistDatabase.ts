import { useState, useEffect, useCallback } from 'react';
import { WishlistItem } from '../types';
import { supabase } from '../lib/supabase';

const FALLBACK_STORAGE_KEY = 'baby-shower-wishlist-fallback';

export const useWishlistDatabase = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load items from Supabase on mount
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('wishlist_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      // Convert database format to app format
      const mappedItems: WishlistItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        category: item.category as WishlistItem['category'],
        retailer: item.retailer,
        link: item.link,
        image: item.image || undefined,
        claimed: item.claimed,
        claimedBy: item.claimed_by || undefined,
        claimedAt: item.claimed_at ? new Date(item.claimed_at) : undefined,
        claimMessage: item.claim_message || undefined
      }));

      setItems(mappedItems);
    } catch (err) {
      console.error('Error loading wishlist from database:', err);
      setError('Failed to load wishlist. Using local data as fallback.');
      
      // Fallback to localStorage
      try {
        const fallbackData = localStorage.getItem(FALLBACK_STORAGE_KEY);
        if (fallbackData) {
          const parsedItems = JSON.parse(fallbackData);
          const itemsWithDates = parsedItems.map((item: any) => ({
            ...item,
            claimedAt: item.claimedAt ? new Date(item.claimedAt) : undefined
          }));
          setItems(itemsWithDates);
        }
      } catch (fallbackErr) {
        console.error('Fallback loading failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save to localStorage as backup
  const saveToFallback = useCallback((updatedItems: WishlistItem[]) => {
    try {
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (err) {
      console.error('Failed to save fallback data:', err);
    }
  }, []);

  // Claim an item
  const claimItem = useCallback(async (itemId: string, claimedBy?: string, claimMessage?: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('wishlist_items')
        .update({
          claimed: true,
          claimed_by: claimedBy || 'Anonymous',
          claimed_at: new Date().toISOString(),
          claim_message: claimMessage || null
        })
        .eq('id', itemId);

      if (supabaseError) {
        throw supabaseError;
      }

      // Update local state
      const updatedItems = items.map(item =>
        item.id === itemId
          ? {
              ...item,
              claimed: true,
              claimedBy: claimedBy || 'Anonymous',
              claimedAt: new Date(),
              claimMessage: claimMessage || undefined
            }
          : item
      );
      setItems(updatedItems);
      saveToFallback(updatedItems);
    } catch (err) {
      console.error('Error claiming item:', err);
      setError('Failed to claim item. Please try again.');
    }
  }, [items, saveToFallback]);

  // Unclaim an item (admin function)
  const unclaimItem = useCallback(async (itemId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('wishlist_items')
        .update({
          claimed: false,
          claimed_by: null,
          claimed_at: null,
          claim_message: null
        })
        .eq('id', itemId);

      if (supabaseError) {
        throw supabaseError;
      }

      // Update local state
      const updatedItems = items.map(item =>
        item.id === itemId
          ? {
              ...item,
              claimed: false,
              claimedBy: undefined,
              claimedAt: undefined,
              claimMessage: undefined
            }
          : item
      );
      setItems(updatedItems);
      saveToFallback(updatedItems);
    } catch (err) {
      console.error('Error unclaiming item:', err);
      setError('Failed to unclaim item. Please try again.');
    }
  }, [items, saveToFallback]);

  // Add new item (admin function)
  const addItem = useCallback(async (item: Omit<WishlistItem, 'id'>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('wishlist_items')
        .insert({
          name: item.name,
          price: item.price,
          category: item.category,
          retailer: item.retailer,
          link: item.link,
          image: item.image || null,
          claimed: false
        })
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      const newItem: WishlistItem = {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        category: data.category as WishlistItem['category'],
        retailer: data.retailer,
        link: data.link,
        image: data.image || undefined,
        claimed: false
      };

      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      saveToFallback(updatedItems);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    }
  }, [items, saveToFallback]);

  // Update item (admin function)
  const updateItem = useCallback(async (itemId: string, updates: Partial<WishlistItem>) => {
    try {
      const { error: supabaseError } = await supabase
        .from('wishlist_items')
        .update({
          name: updates.name,
          price: updates.price,
          category: updates.category,
          retailer: updates.retailer,
          link: updates.link,
          image: updates.image || null
        })
        .eq('id', itemId);

      if (supabaseError) {
        throw supabaseError;
      }

      // Update local state
      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      setItems(updatedItems);
      saveToFallback(updatedItems);
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item. Please try again.');
    }
  }, [items, saveToFallback]);

  // Delete item (admin function)
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemId);

      if (supabaseError) {
        throw supabaseError;
      }

      // Update local state
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      saveToFallback(updatedItems);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    }
  }, [items, saveToFallback]);

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

  // Refresh data from server
  const refresh = useCallback(() => {
    loadItems();
  }, []);

  // Add multiple items (bulk import)
  const addItems = useCallback(async (newItems: Omit<WishlistItem, 'id'>[]) => {
    try {
      console.log('Adding', newItems.length, 'items to database');
      
      const itemsToInsert = newItems.map(item => ({
        name: item.name,
        price: item.price,
        category: item.category,
        retailer: item.retailer,
        link: item.link,
        image: item.image || null,
        claimed: false
      }));

      const { data, error: supabaseError } = await supabase
        .from('wishlist_items')
        .insert(itemsToInsert)
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      // Convert database format to app format
      const mappedItems: WishlistItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        category: item.category as WishlistItem['category'],
        retailer: item.retailer,
        link: item.link,
        image: item.image || undefined,
        claimed: false
      }));

      const updatedItems = [...items, ...mappedItems];
      setItems(updatedItems);
      saveToFallback(updatedItems);
      
      console.log('Successfully added', mappedItems.length, 'items');
      return mappedItems;
    } catch (err) {
      console.error('Error adding items:', err);
      setError('Failed to add items. Please try again.');
      throw err;
    }
  }, [items, saveToFallback]);

  return {
    items,
    loading,
    error,
    claimItem,
    unclaimItem,
    addItem,
    addItems,
    updateItem,
    deleteItem,
    getItemsByCategory,
    getUnclaimedItems,
    getClaimedItems,
    refresh
  };
};
