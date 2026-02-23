export async function filterByVendorType(vendors: any[], vendorType?: string) {
  if (!vendorType) return vendors;
  return vendors.filter((v) => v.service_type_id === vendorType);
}
