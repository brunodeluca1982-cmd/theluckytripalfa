export type ImageStatus = 'pending' | 'approved' | 'blocked';

/**
 * Returns the image URL only if the image is approved and has a valid URL.
 * Otherwise returns null (UI should show placeholder).
 */
export function getApprovedImageUrl(
  image_url?: string | null,
  image_status?: ImageStatus
): string | null {
  if (image_status === 'approved' && image_url) {
    return image_url;
  }
  return null;
}
