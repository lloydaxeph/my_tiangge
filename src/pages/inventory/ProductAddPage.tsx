import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { ProductForm } from "../../components/inventory/ProductForm";
import { useCategories } from "../../hooks/useCategories";
import { useAuth } from "../../hooks/useAuth";
import { createProduct, uploadProductImage, updateProduct } from "../../services/products.service";
import { createCategory } from "../../services/categories.service";
import { ROUTES } from "../../lib/routes";
import type { ProductInput } from "../../services/products.service";

export function ProductAddPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { categories, refresh: refreshCategories } = useCategories();

  const handleCreateCategory = async (name: string) => {
    if (!session) return undefined;
    const category = await createCategory(session.user.id, name);
    await refreshCategories();
    return category.id;
  };

  const handleSubmit = async (input: ProductInput, imageFile: File | null) => {
    if (!session) return;
    const product = await createProduct(session.user.id, input);
    if (imageFile) {
      const imageUrl = await uploadProductImage(session.user.id, imageFile);
      await updateProduct(product.id, { ...input, imageUrl });
    }
    navigate(ROUTES.inventory, { replace: true });
  };

  return (
    <AppLayout>
      <PageHeader title="Add Product" onBack />
      <ProductForm
        categories={categories}
        submitLabel="Add Product"
        onSubmit={handleSubmit}
        onCreateCategory={handleCreateCategory}
      />
    </AppLayout>
  );
}
