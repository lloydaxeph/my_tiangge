import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listAllUsers,
  listAllProducts,
  listAllUtang,
  listAllSales,
  setUserDisabled,
} from "../services/admin.service";
import type { Product, Profile, Sale, Utang, UtangPayment } from "../types/domain";

function useStoreNameLookup() {
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    listAllUsers().then(setUsers);
  }, []);

  const storeNameFor = useCallback(
    (userId: string) => users.find((u) => u.id === userId)?.store_name || "Unknown store",
    [users]
  );

  return { users, storeNameFor };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await listAllUsers());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleDisabled = async (userId: string, disabled: boolean) => {
    await setUserDisabled(userId, disabled);
    await refresh();
  };

  return { users, loading, toggleDisabled };
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { storeNameFor } = useStoreNameLookup();

  useEffect(() => {
    listAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, storeNameFor };
}

export function useAdminUtang() {
  const [charges, setCharges] = useState<Utang[]>([]);
  const [payments, setPayments] = useState<UtangPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { storeNameFor } = useStoreNameLookup();

  useEffect(() => {
    listAllUtang()
      .then(({ charges, payments }) => {
        setCharges(charges);
        setPayments(payments);
      })
      .finally(() => setLoading(false));
  }, []);

  const entries = useMemo(
    () =>
      [
        ...charges.map((c) => ({ ...c, type: "charge" as const })),
        ...payments.map((p) => ({ ...p, type: "payment" as const })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [charges, payments]
  );

  return { entries, loading, storeNameFor };
}

export function useAdminSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { storeNameFor } = useStoreNameLookup();

  useEffect(() => {
    listAllSales()
      .then(setSales)
      .finally(() => setLoading(false));
  }, []);

  return { sales, loading, storeNameFor };
}
