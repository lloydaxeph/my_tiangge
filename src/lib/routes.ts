export const ROUTES = {
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  home: "/home",

  pos: "/pos",
  saleReceipt: (saleId: string) => `/pos/receipt/${saleId}`,

  inventory: "/inventory",
  inventoryNew: "/inventory/new",
  inventoryEdit: (id: string) => `/inventory/${id}/edit`,

  customers: "/customers",
  customerDetail: (id: string) => `/customers/${id}`,
  customerReminders: "/customers/reminders",

  settings: "/settings",
  settingsProfile: "/settings/profile",
  settingsGcashQr: "/settings/gcash-qr",

  adminUsers: "/admin/users",
  adminInventory: "/admin/inventory",
  adminUtang: "/admin/utang",
  adminSales: "/admin/sales",
} as const;
