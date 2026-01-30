import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DbClient } from '@/hooks/useDatabase';

interface ClientState {
  currentClient: DbClient | null;
  setCurrentClient: (client: DbClient | null) => void;
  logout: () => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      currentClient: null,
      setCurrentClient: (client) => set({ currentClient: client }),
      logout: () => set({ currentClient: null }),
    }),
    {
      name: 'client-storage',
    }
  )
);
