import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Package } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { SearchBar } from "../../components/common/SearchBar";
import { Button } from "../../components/common/Button";
import { Spinner } from "../../components/common/Spinner";
import { EmptyState } from "../../components/common/EmptyState";
import { CategoryChips } from "../../components/inventory/CategoryChips";
import { ProductCard } from "../../components/inventory/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { ROUTES } from "../../lib/routes";

export function InventoryListPage() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryId || p.category_id === categoryId;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryId]);

  return (
    <AppLayout>
      <PageHeader title="Inventory" onBack />

      <div className="mb-4 flex flex-col gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products" />
        <CategoryChips categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Tap Add Product to add your first item."
        />
      ) : (
        <div className="mb-24 flex flex-col gap-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(ROUTES.inventoryEdit(product.id))}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
        <Button
          onClick={() => navigate(ROUTES.inventoryNew)}
          className="flex items-center justify-center gap-2"
        >
          <Plus className="h-6 w-6" /> Add Product
        </Button>
      </div>
    </AppLayout>
  );
}
