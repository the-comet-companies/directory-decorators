export const services = [
  { id: '1', name: 'Screen Printing', slug: 'screen-printing', description: 'High-quality screen printing for bulk orders.', icon: '🖨️' },
  { id: '2', name: 'Embroidery', slug: 'embroidery', description: 'Professional embroidery for apparel and accessories.', icon: '🧵' },
  { id: '3', name: 'DTG Printing', slug: 'dtg-printing', description: 'Direct-to-garment printing for full-color designs.', icon: '👕' },
  { id: '4', name: 'DTF Printing', slug: 'dtf-printing', description: 'Direct-to-film transfers for versatile printing.', icon: '🎞️' },
  { id: '5', name: 'Heat Transfer', slug: 'heat-transfer', description: 'Heat transfer printing for detailed designs.', icon: '🔥' },
  { id: '6', name: 'Sublimation', slug: 'sublimation', description: 'Dye sublimation for vibrant all-over prints.', icon: '🌈' },
  { id: '7', name: 'Vinyl Printing', slug: 'vinyl-printing', description: 'Vinyl cutting and printing for decals and lettering.', icon: '✂️' },
  { id: '8', name: 'Large Format Printing', slug: 'large-format-printing', description: 'Banners, posters, and wide-format prints.', icon: '📐' },
  { id: '9', name: 'Custom Apparel', slug: 'custom-apparel', description: 'Custom-designed clothing and branded apparel.', icon: '👔' },
  { id: '10', name: 'Signage Printing', slug: 'signage-printing', description: 'Business signs, yard signs, and trade show displays.', icon: '🪧' },
];

// Neighborhoods are no longer needed from static data — cities come from Supabase
export const neighborhoods: { id: string; name: string; slug: string; city: string; region: string }[] = [];

export const productCategories = [
  { id: '1', name: 'T-Shirts', slug: 't-shirts' },
  { id: '2', name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts' },
  { id: '3', name: 'Caps & Hats', slug: 'caps-hats' },
  { id: '4', name: 'Polos', slug: 'polos' },
  { id: '5', name: 'Tote Bags', slug: 'tote-bags' },
  { id: '6', name: 'Promotional Items', slug: 'promotional-items' },
];
