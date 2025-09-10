import { useState, useEffect, useCallback } from 'react';
import { RSVP } from '../types';
import { supabase } from '../lib/supabase';

const FALLBACK_STORAGE_KEY = 'baby-shower-rsvps-fallback';

export const useRSVP = () => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage as fallback
  const saveToFallback = useCallback((rsvpData: RSVP[]) => {
    try {
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(rsvpData));
    } catch (err) {
      console.warn('Failed to save RSVPs to localStorage:', err);
    }
  }, []);

  // Load from localStorage as fallback
  const loadFromFallback = useCallback((): RSVP[] => {
    try {
      const stored = localStorage.getItem(FALLBACK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((rsvp: any) => ({
          ...rsvp,
          submittedAt: new Date(rsvp.submittedAt)
        }));
      }
    } catch (err) {
      console.warn('Failed to load RSVPs from localStorage:', err);
    }
    return [];
  }, []);

  // Load RSVPs from Supabase on mount
  useEffect(() => {
    loadRSVPs();
  }, []);

  const loadRSVPs = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Convert database format to app format
      const mappedRSVPs: RSVP[] = (data || []).map(rsvp => ({
        id: rsvp.id,
        name: rsvp.name,
        email: rsvp.email || undefined,
        phone: rsvp.phone || undefined,
        attending: rsvp.attending,
        guestCount: rsvp.guest_count,
        dietaryRestrictions: rsvp.dietary_restrictions || undefined,
        message: rsvp.message || undefined,
        submittedAt: new Date(rsvp.created_at)
      }));

      setRsvps(mappedRSVPs);
      saveToFallback(mappedRSVPs);
    } catch (err) {
      console.error('Error loading RSVPs from database:', err);
      setError('Failed to load RSVPs from database. Using offline data.');
      
      // Fallback to localStorage
      const fallbackRSVPs = loadFromFallback();
      setRsvps(fallbackRSVPs);
    } finally {
      setLoading(false);
    }
  };

  // Submit new RSVP
  const submitRSVP = useCallback(async (rsvpData: Omit<RSVP, 'id' | 'submittedAt'>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('rsvps')
        .insert({
          name: rsvpData.name,
          email: rsvpData.email || null,
          phone: rsvpData.phone || null,
          attending: rsvpData.attending,
          guest_count: rsvpData.guestCount,
          dietary_restrictions: rsvpData.dietaryRestrictions || null,
          message: rsvpData.message || null
        })
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      const newRSVP: RSVP = {
        id: data.id,
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        attending: data.attending,
        guestCount: data.guest_count,
        dietaryRestrictions: data.dietary_restrictions || undefined,
        message: data.message || undefined,
        submittedAt: new Date(data.created_at)
      };

      const updatedRSVPs = [newRSVP, ...rsvps];
      setRsvps(updatedRSVPs);
      saveToFallback(updatedRSVPs);
      
      return newRSVP;
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      
      // Fallback: save to localStorage only
      const fallbackRSVP: RSVP = {
        id: `fallback-${Date.now()}`,
        ...rsvpData,
        submittedAt: new Date()
      };
      
      const updatedRSVPs = [fallbackRSVP, ...rsvps];
      setRsvps(updatedRSVPs);
      saveToFallback(updatedRSVPs);
      
      throw new Error('Failed to submit RSVP to database. Saved locally.');
    }
  }, [rsvps, saveToFallback]);

  // Delete RSVP (admin function)
  const deleteRSVP = useCallback(async (rsvpId: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('rsvps')
        .delete()
        .eq('id', rsvpId);

      if (supabaseError) {
        throw supabaseError;
      }

      const updatedRSVPs = rsvps.filter(rsvp => rsvp.id !== rsvpId);
      setRsvps(updatedRSVPs);
      saveToFallback(updatedRSVPs);
    } catch (err) {
      console.error('Error deleting RSVP:', err);
      setError('Failed to delete RSVP. Please try again.');
    }
  }, [rsvps, saveToFallback]);

  // Get RSVP statistics
  const getStats = useCallback(() => {
    const attending = rsvps.filter(rsvp => rsvp.attending);
    const notAttending = rsvps.filter(rsvp => !rsvp.attending);
    const totalGuests = attending.reduce((sum, rsvp) => sum + rsvp.guestCount, 0);
    
    return {
      total: rsvps.length,
      attending: attending.length,
      notAttending: notAttending.length,
      totalGuests,
      withDietaryRestrictions: attending.filter(rsvp => rsvp.dietaryRestrictions).length
    };
  }, [rsvps]);

  return {
    rsvps,
    loading,
    error,
    submitRSVP,
    deleteRSVP,
    refreshRSVPs: loadRSVPs,
    stats: getStats()
  };
};
