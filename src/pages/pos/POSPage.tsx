import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Barcode, ShoppingCart } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { SearchBar } from "../../components/common/SearchBar";
import { Spinner } from "../../components/common/Spinner";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { BarcodeScannerModal } from "../../components/common/BarcodeScannerModal";
import { ProductGridButton } from "../../components/pos/ProductGridButton";
import { CartLine } from "../../components/pos/CartLine";
import { DiscountInput } from "../../components/pos/DiscountInput";
import { ChangeCalculator } from "../../components/pos/ChangeCalculator";
import { PaymentMethodToggle } from "../../components/pos/PaymentMethodToggle";
import { useProducts } from "../../hooks/useProducts";
import { createSale } from "../../services/sales.service";
import { formatPeso } from "../../utils/currency";
import { ROUTES } from "../../lib/routes";
import type { CartItem, PaymentMethod } from "../../types/domain";

export function POSPage() {
  const navigate = useNavigate();
  const { products, loading, refresh } = useProducts();
  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountTendered, setAmountTendered] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  const subtotal = cart.reduce((sum, item) => sum + item.product.selling_price * item.quantity, 0);
  const discountValue = Number(discount) || 0;
  const total = Math.max(subtotal - discountValue, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing) {
        if (existing.quantity >= product.current_stock) return prev;
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleBarcodeDetected = (code: string) => {
    setScannerOpen(false);
    const product = products.find((p) => p.barcode === code);
    if (product) {
      addToCart(product.id);
    } else {
      setError(`No product found with barcode ${code}`);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          const nextQty = item.quantity + delta;
          if (nextQty > item.product.current_stock) return item;
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleConfirmSale = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const tendered = paymentMethod === "cash" ? Number(amountTendered) || 0 : total;
      const saleId = await createSale(cart, paymentMethod, discountValue, tendered);
      await refresh();
      navigate(ROUTES.saleReceipt(saleId), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete sale");
    } finally {
      setSubmitting(false);
    }
  };

  const canCheckout =
    cart.length > 0 && (paymentMethod === "gcash" || (Number(amountTendered) || 0) >= total);

  return (
    <AppLayout>
      <PageHeader title="New Sale" onBack />

      <div className="mb-4 flex gap-2">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search products" />
        </div>
        <Button
          variant="secondary"
          fullWidth={false}
          onClick={() => setScannerOpen(true)}
          className="flex h-14 w-14 items-center justify-center p-0"
        >
          <Barcode className="h-6 w-6" />
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No products found"
          description="Add products in Inventory first."
        />
      ) : (
        <div className="mb-28 grid grid-cols-3 gap-3">
          {filtered.map((product) => (
            <ProductGridButton
              key={product.id}
              product={product}
              onClick={() => addToCart(product.id)}
            />
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
          <Button
            onClick={() => setCheckoutOpen(true)}
            className="flex items-center justify-between px-6"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" /> {cartCount} item{cartCount > 1 ? "s" : ""}
            </span>
            <span>{formatPeso(subtotal)}</span>
          </Button>
        </div>
      )}

      {scannerOpen && (
        <BarcodeScannerModal onDetected={handleBarcodeDetected} onClose={() => setScannerOpen(false)} />
      )}

      {checkoutOpen && (
        <Modal title="Checkout" onClose={() => setCheckoutOpen(false)}>
          <div className="flex flex-col gap-3">
            <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
              {cart.map((item) => (
                <CartLine
                  key={item.product.id}
                  item={item}
                  onIncrement={() => updateQuantity(item.product.id, 1)}
                  onDecrement={() => updateQuantity(item.product.id, -1)}
                  onRemove={() => removeItem(item.product.id)}
                />
              ))}
            </div>

            <DiscountInput value={discount} onChange={setDiscount} />

            <div className="flex items-center justify-between border-t border-neutral-200 pt-2 text-xl font-bold text-neutral-900">
              <span>Total</span>
              <span>{formatPeso(total)}</span>
            </div>

            <PaymentMethodToggle value={paymentMethod} onChange={setPaymentMethod} />

            {paymentMethod === "cash" && (
              <ChangeCalculator total={total} amountTendered={amountTendered} onChange={setAmountTendered} />
            )}

            {error && <p className="text-lg text-red-600">{error}</p>}

            <Button onClick={handleConfirmSale} disabled={!canCheckout || submitting}>
              {submitting ? "Completing Sale..." : "Complete Sale"}
            </Button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
