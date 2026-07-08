import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Spinner } from "../../components/common/Spinner";
import { ProductForm } from "../../components/inventory/ProductForm";
import { useCategories } from "../../hooks/useCategories";
import {
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../../services/products.service";
import { createCategory } from "../../services/categories.service";
import { ROUTES } from "../../lib/routes";
import type { Product } from "../../types/domain";
import type { ProductInput } from "../../services/products.service";

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, refresh: refreshCategories } = useCategories();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <Spinner />
      </AppLayout>
    );
  }

  if (!product || !id) {
    return (
      <AppLayout>
        <PageHeader title="Product not found" onBack />
      </AppLayout>
    );
  }

  const handleSubmit = async (input: ProductInput, imageFile: File | null) => {
    let imageUrl = input.imageUrl;
    if (imageFile) {
      imageUrl = await uploadProductImage(product.user_id, imageFile);
    }
    await updateProduct(id, { ...input, imageUrl });
    navigate(ROUTES.inventory, { replace: true });
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await deleteProduct(id);
    navigate(ROUTES.inventory, { replace: true });
  };

  const handleCreateCategory = async (name: string) => {
    const category = await createCategory(product.user_id, name);
    await refreshCategories();
    return category.id;
  };

  return (
    <AppLayout>
      <PageHeader title="Edit Product" onBack />
      <ProductForm
        categories={categories}
        initialValues={{
          name: product.name,
          categoryId: product.category_id,
          barcode: product.barcode,
          currentStock: product.current_stock,
          buyingPrice: product.buying_price,
          sellingPrice: product.selling_price,
          imageUrl: product.image_url,
        }}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onCreateCategory={handleCreateCategory}
      />
    </AppLayout>
  );
}
