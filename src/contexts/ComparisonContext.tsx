import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const MAX_COMPARISON_ITEMS = 4;

interface ComparisonContextType {
  comparisonIds: string[];
  isInComparison: (productId: string) => boolean;
  toggleComparison: (productId: string) => void;
  clearComparison: () => void;
  loading: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch comparison list when user changes
  useEffect(() => {
    if (user) {
      fetchComparisonList();
    } else {
      // Use localStorage for non-logged in users
      const stored = localStorage.getItem('comparison_list');
      if (stored) {
        setComparisonIds(JSON.parse(stored));
      }
    }
  }, [user]);

  // Sync to localStorage for non-logged in users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('comparison_list', JSON.stringify(comparisonIds));
    }
  }, [comparisonIds, user]);

  const fetchComparisonList = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comparison_lists')
        .select('product_ids')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setComparisonIds(data?.product_ids || []);
    } catch (error) {
      console.error('Error fetching comparison list:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncToDatabase = async (newIds: string[]) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from('comparison_lists')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('comparison_lists')
          .update({ product_ids: newIds })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('comparison_lists')
          .insert({ user_id: user.id, product_ids: newIds });
      }
    } catch (error) {
      console.error('Error syncing comparison list:', error);
    }
  };

  const isInComparison = (productId: string) => {
    return comparisonIds.includes(productId);
  };

  const toggleComparison = (productId: string) => {
    const isCurrentlyInComparison = isInComparison(productId);

    if (isCurrentlyInComparison) {
      const newIds = comparisonIds.filter(id => id !== productId);
      setComparisonIds(newIds);
      syncToDatabase(newIds);
      toast.success('Removed from comparison');
    } else {
      if (comparisonIds.length >= MAX_COMPARISON_ITEMS) {
        toast.error(`Maximum ${MAX_COMPARISON_ITEMS} products can be compared`);
        return;
      }
      const newIds = [...comparisonIds, productId];
      setComparisonIds(newIds);
      syncToDatabase(newIds);
      toast.success('Added to comparison');
    }
  };

  const clearComparison = () => {
    setComparisonIds([]);
    syncToDatabase([]);
  };

  return (
    <ComparisonContext.Provider value={{ comparisonIds, isInComparison, toggleComparison, clearComparison, loading }}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
