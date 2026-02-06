import { useState, useCallback } from "react";
import { callEdgeFunction } from "@/lib/edge-functions";
import type { UserProfile, CreateUserPayload } from "@/types/access-control";

export function useManageUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callEdgeFunction<UserProfile[]>("manage-users", {
        method: "POST",
        body: JSON.stringify({ action: "list_users" }),
      });
      setUsers(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao listar usuários";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (payload: CreateUserPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await callEdgeFunction<UserProfile>("manage-users", {
        method: "POST",
        body: JSON.stringify({ action: "create_user", data: payload }),
      });
      setUsers((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar usuário";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (user_id: string, updates: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      try {
        const data = await callEdgeFunction<UserProfile>("manage-users", {
          method: "POST",
          body: JSON.stringify({
            action: "update_user",
            data: { user_id, ...updates },
          }),
        });
        setUsers((prev) => prev.map((u) => (u.id === user_id ? data : u)));
        return data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao atualizar usuário";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const toggleUserStatus = useCallback(async (user_id: string) => {
    setError(null);
    try {
      const data = await callEdgeFunction<{ id: string; is_active: boolean }>(
        "manage-users",
        {
          method: "POST",
          body: JSON.stringify({ action: "toggle_user_status", data: { user_id } }),
        },
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === data.id ? { ...u, is_active: data.is_active } : u,
        ),
      );
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao alterar status";
      setError(msg);
      throw err;
    }
  }, []);

  return {
    users,
    loading,
    error,
    listUsers,
    createUser,
    updateUser,
    toggleUserStatus,
  };
}
