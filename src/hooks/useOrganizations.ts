import { useState, useCallback } from "react";
import { callEdgeFunction } from "@/lib/edge-functions";
import type { Organization, CreateOrganizationPayload } from "@/types/access-control";

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callEdgeFunction<Organization[]>("manage-users", {
        method: "POST",
        body: JSON.stringify({ action: "list_organizations" }),
      });
      setOrganizations(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao listar organizações";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrganization = useCallback(async (payload: CreateOrganizationPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await callEdgeFunction<Organization>("manage-users", {
        method: "POST",
        body: JSON.stringify({ action: "create_organization", data: payload }),
      });
      setOrganizations((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar organização";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrganization = useCallback(
    async (organization_id: string, updates: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      try {
        const data = await callEdgeFunction<Organization>("manage-users", {
          method: "POST",
          body: JSON.stringify({
            action: "update_organization",
            data: { organization_id, ...updates },
          }),
        });
        setOrganizations((prev) =>
          prev.map((o) => (o.id === organization_id ? data : o)),
        );
        return data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao atualizar organização";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    organizations,
    loading,
    error,
    listOrganizations,
    createOrganization,
    updateOrganization,
  };
}
