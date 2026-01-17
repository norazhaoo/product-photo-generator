
import { ArtisticStyle } from './types';

// 商业摄影核心：产品主体优先、边缘轮廓清晰、环境光影服务于材质
const LUXURY_CORE = `
  MASTER DIRECTIVE: This is a high-end commercial hero shot. 
  SUBJECT PRIORITY: The product is the absolute hero. Use shallow depth of field (f/2.8) to blur the background.
  LIGHTING: Apply precise rim lighting to separate the product from the background. Ensure the product's edges are sharp and clean.
  INTEGRATION: Natural soft contact shadows at the base. Realistic environment reflections on the product's surface.
  INTEGRITY: 100% preservation of labels, logos, and geometry.
`;

// Fix: Updated keys to match valid ArtisticStyle values defined in types.ts
export const STYLE_CONFIGS: Partial<Record<ArtisticStyle, string>> = {
  '极致奢华': `${LUXURY_CORE} Aesthetic: Luxury provocative high-gloss.`,
  '斯堪的纳维亚极简': `${LUXURY_CORE} Aesthetic: Pure minimalist essential.`,
  'VOGUE 封面': `${LUXURY_CORE} Aesthetic: Sharp editorial fashion.`,
  '黑色电影': `${LUXURY_CORE} Aesthetic: Dramatic cinematic mystery.`,
  '法式优雅': `${LUXURY_CORE} Aesthetic: Timeless editorial elegance.`
};