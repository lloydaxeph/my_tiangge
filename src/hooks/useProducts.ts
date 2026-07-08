import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { listProducts } from "../services/products.service";
import type { Product } from "../types/domain";

export function useProducts() {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      setProducts(await listProducts(session.user.id));
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, loading, refresh };
}
