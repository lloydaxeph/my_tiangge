const formatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export function formatPeso(amount: number): string {
  return formatter.format(amount);
}
