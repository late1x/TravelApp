import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

// Use AsyncStorage as the storage provider for Supabase
const AsyncStorageAdapter = {
  getItem: (key: string) => {
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key);
  },
};

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Supabase client
export const supabase = createClient(url!, key!, {
  auth: {
    storage: AsyncStorageAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});