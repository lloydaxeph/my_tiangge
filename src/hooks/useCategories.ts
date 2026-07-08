import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { listCategories } from "../services/categories.service";
import type { Category } from "../types/domain";

export function useCategories() {
  const { session } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      setCategories(await listCategories(session.user.id));
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { categories, loading, refresh };
}
