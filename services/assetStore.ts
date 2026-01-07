
import { BrandingAssets } from '../types';
import { DEFAULT_HEADER_SVG, DEFAULT_FOOTER_SVG, DEFAULT_WATERMARK_SVG } from '../constants';

const ASSET_STORAGE_KEY = 'ays_branding_assets_v1';

export const getBrandingAssets = (): BrandingAssets => {
  const data = localStorage.getItem(ASSET_STORAGE_KEY);
  const saved = data ? JSON.parse(data) : {};
  
  // Return saved assets or fallback to permanent code-based defaults
  return {
    header: saved.header || DEFAULT_HEADER_SVG,
    footer: saved.footer || DEFAULT_FOOTER_SVG,
    watermark: saved.watermark || DEFAULT_WATERMARK_SVG
  };
};

export const saveBrandingAssets = (assets: BrandingAssets) => {
  localStorage.setItem(ASSET_STORAGE_KEY, JSON.stringify(assets));
};
