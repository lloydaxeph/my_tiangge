import { useState } from "react";
import { Barcode, Package, Trash2 } from "lucide-react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { BarcodeScannerModal } from "../common/BarcodeScannerModal";
import { CategoryChips } from "./CategoryChips";
import { productSchema } from "../../utils/validation";
import type { Category } from "../../types/domain";
import type { ProductInput } from "../../services/products.service";

interface ProductFormProps {
  categories: Category[];
  initialValues?: Partial<ProductInput>;
  submitLabel: string;
  onSubmit: (input: ProductInput, imageFile: File | null) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCreateCategory?: (name: string) => Promise<string | undefined>;
}

export function ProductForm({
  categories,
  initialValues,
  submitLabel,
  onSubmit,
  onDelete,
  onCreateCategory,
}: ProductFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(initialValues?.categoryId ?? null);
  const [barcode, setBarcode] = useState(initialValues?.barcode ?? "");
  const [currentStock, setCurrentStock] = useState(String(initialValues?.currentStock ?? "0"));
  const [buyingPrice, setBuyingPrice] = useState(String(initialValues?.buyingPrice ?? "0"));
  const [sellingPrice, setSellingPrice] = useState(String(initialValues?.sellingPrice ?? "0"));
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.imageUrl ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = productSchema.safeParse({
      name,
      categoryId,
      barcode: barcode || null,
      currentStock,
      buyingPrice,
      sellingPrice,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await onSubmit(
        {
          name: result.data.name,
          categoryId: result.data.categoryId,
          barcode: result.data.barcode,
          currentStock: result.data.currentStock,
          buyingPrice: result.data.buyingPrice,
          sellingPrice: result.data.sellingPrice,
          imageUrl: initialValues?.imageUrl ?? null,
        },
        imageFile
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="mx-auto flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-neutral-100">
        {imagePreview ? (
          <img src={imagePreview} alt="" className="h-full w-full object-cover" />
        ) : (
          <Package className="h-12 w-12 text-neutral-400" />
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
      </label>

      <Input
        label="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="block text-lg font-medium text-neutral-800">Category</span>
          {onCreateCategory && (
            <button
              type="button"
              className="text-base font-semibold text-emerald-700 underline"
              onClick={async () => {
                const name = window.prompt("New category name");
                if (!name?.trim()) return;
                const newId = await onCreateCategory(name.trim());
                if (newId) setCategoryId(newId);
              }}
            >
              + New Category
            </button>
          )}
        </div>
        {categories.length > 0 && (
          <CategoryChips
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            noneLabel="None"
          />
        )}
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label="Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          fullWidth={false}
          onClick={() => setScannerOpen(true)}
          className="mb-0 flex h-14 w-14 items-center justify-center p-0"
        >
          <Barcode className="h-6 w-6" />
        </Button>
      </div>

      <Input
        label="Current Stock"
        type="number"
        inputMode="decimal"
        value={currentStock}
        onChange={(e) => setCurrentStock(e.target.value)}
        error={errors.currentStock}
      />
      <Input
        label="Buying Price (₱)"
        type="number"
        inputMode="decimal"
        value={buyingPrice}
        onChange={(e) => setBuyingPrice(e.target.value)}
        error={errors.buyingPrice}
      />
      <Input
        label="Selling Price (₱)"
        type="number"
        inputMode="decimal"
        value={sellingPrice}
        onChange={(e) => setSellingPrice(e.target.value)}
        error={errors.sellingPrice}
      />

      {submitError && <p className="text-lg text-red-600">{submitError}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </Button>

      {onDelete && (
        <Button
          type="button"
          variant="danger"
          onClick={onDelete}
          className="flex items-center justify-center gap-2"
        >
          <Trash2 className="h-5 w-5" /> Delete Product
        </Button>
      )}

      {scannerOpen && (
        <BarcodeScannerModal
          onDetected={(code) => {
            setBarcode(code);
            setScannerOpen(false);
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </form>
  );
}
