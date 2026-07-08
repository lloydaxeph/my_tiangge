import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { listCustomerBalances, type CustomerBalance } from "../services/utang.service";

export function useCustomers() {
  const { session } = useAuth();
  const [customers, setCustomers] = useState<CustomerBalance[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      setCustomers(await listCustomerBalances(session.user.id));
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { customers, loading, refresh };
}
