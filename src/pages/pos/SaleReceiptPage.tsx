import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Spinner } from "../../components/common/Spinner";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { getSale, getSaleItems } from "../../services/sales.service";
import { formatPeso } from "../../utils/currency";
import { formatDateTime } from "../../utils/date";
import { ROUTES } from "../../lib/routes";
import type { Sale, SaleItem } from "../../types/domain";

export function SaleReceiptPage() {
  const { saleId } = useParams<{ saleId: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<Sale | null>(null);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!saleId) return;
    Promise.all([getSale(saleId), getSaleItems(saleId)])
      .then(([s, i]) => {
        setSale(s);
        setItems(i);
      })
      .finally(() => setLoading(false));
  }, [saleId]);

  if (loading) {
    return (
      <AppLayout>
        <Spinner />
      </AppLayout>
    );
  }

  if (!sale) {
    return (
      <AppLayout>
        <p className="text-center text-lg text-neutral-600">Sale not found.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-600" />
        <h1 className="text-2xl font-bold text-neutral-900">Sale Complete!</h1>
        <p className="text-lg text-neutral-500">{formatDateTime(sale.created_at)}</p>
      </div>

      <Card className="mb-4 flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-lg">
            <span className="text-neutral-800">
              {item.product_name_snapshot} x{item.quantity}
            </span>
            <span className="font-semibold text-neutral-900">{formatPeso(item.line_total)}</span>
          </div>
        ))}

        <div className="mt-2 flex flex-col gap-1 border-t border-neutral-200 pt-2 text-lg">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>{formatPeso(sale.subtotal)}</span>
          </div>
          {sale.discount > 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>Discount</span>
              <span>-{formatPeso(sale.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-neutral-900">
            <span>Total</span>
            <span>{formatPeso(sale.total)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Payment</span>
            <span className="capitalize">{sale.payment_method}</span>
          </div>
          {sale.payment_method === "cash" && (
            <div className="flex justify-between text-neutral-600">
              <span>Change</span>
              <span>{formatPeso(sale.change_given)}</span>
            </div>
          )}
        </div>
      </Card>

      <Button onClick={() => navigate(ROUTES.pos, { replace: true })}>New Sale</Button>
      <Button
        variant="secondary"
        className="mt-3"
        onClick={() => navigate(ROUTES.home, { replace: true })}
      >
        Back to Home
      </Button>
    </AppLayout>
  );
}
