export const formatPrice = (price) => {
  return '₹' + Number(price || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const getDiscountPercent = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

export const getPlaceholderImage = (name) => {
  return 'https://placehold.co/600x600/fce7f3/ec4899?text=' + encodeURIComponent(name || 'Fashion');
};

export const getAvailableSizes = (sizes) => {
  if (!sizes || !Array.isArray(sizes)) return [];
  return sizes.filter(s => s.isAvailable && s.stock > 0);
};

export const getSizePrice = (sizes, selectedSize) => {
  if (!sizes || !selectedSize) return 0;
  const sizeObj = sizes.find(s => s.size === selectedSize);
  return sizeObj?.price || 0;
};

// Convert bra/cup size to generic size
export const convertToStandardSize = (measurements) => {
  if (!measurements) return 'M';
  const { bust, waist, hips } = measurements;
  if (!bust || !waist || !hips) return 'M';
  if (bust <= 32 && waist <= 26) return 'XS';
  if (bust <= 34 && waist <= 28) return 'S';
  if (bust <= 36 && waist <= 30) return 'M';
  if (bust <= 38 && waist <= 32) return 'L';
  if (bust <= 40 && waist <= 34) return 'XL';
  if (bust <= 42 && waist <= 36) return '2XL';
  return '3XL';
};

export const getColorHex = (colorName, productColors) => {
  if (!productColors || !colorName) return '#cccccc';
  const color = productColors.find(c => c.name === colorName || c.name === colorName);
  return color?.hex || '#cccccc';
};
