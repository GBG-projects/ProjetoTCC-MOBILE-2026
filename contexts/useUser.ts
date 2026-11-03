import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  role: string;
  nivel: number;
  foto: string | null;
  tempo_estudo_total: number;
  created_at: string;
};

let cache: Usuario | null = null;
const listeners = new Set<(u: Usuario | null) => void>();

function setCache(u: Usuario | null) {
  cache = u;
  listeners.forEach((l) => l(u));
}

// chame no logout
export function clearUser() {
  setCache(null);
}

export function useUser() {
  const [user, setUser] = useState<Usuario | null>(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    listeners.add(setUser);
    return () => {
      listeners.delete(setUser);
    };
  }, []);

  const refetch = useCallback(async () => {
    try {
      const salvo = await SecureStore.getItemAsync('usuario');
      if (!salvo) {
        setCache(null);
        return;
      }
      const { id } = JSON.parse(salvo);

      const res = await fetch(`${API_URL}/api/usuario/${id}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);

      setCache(await res.json());
    } catch (e) {
      console.error('Erro ao carregar usuário:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cache) refetch();
  }, [refetch]);

  return { user, loading, refetch };
}