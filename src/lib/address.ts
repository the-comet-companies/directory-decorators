type AddressParts = {
  address?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
};

export function formatAddress(p: AddressParts): string {
  const line1 = (p.address || '').trim();
  const line2 = (p.addressLine2 || '').trim();
  const city = (p.city || '').trim();
  const state = (p.state || '').trim();
  const zip = (p.zip || '').trim();

  // Legacy rows often pack "123 St, City, ST 90058" into address. If the address
  // string already contains a comma and the city value, show address verbatim.
  if (line1 && city && line1.toLowerCase().includes(city.toLowerCase()) && !line2 && !zip) {
    return line1;
  }

  const parts: string[] = [];
  if (line1) parts.push(line1);
  if (line2) parts.push(line2);
  const cityStateZip = [city, [state, zip].filter(Boolean).join(' ').trim()].filter(Boolean).join(', ');
  if (cityStateZip) parts.push(cityStateZip);
  return parts.join(', ');
}
