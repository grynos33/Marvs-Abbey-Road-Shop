export function getStoragePathFromPublicUrl(bucket: string, publicUrl: string | null | undefined): string | null {
  if (!publicUrl) return null;

  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;

  const rawPath = publicUrl.slice(idx + marker.length).split('?')[0].split('#')[0];
  if (!rawPath) return null;

  return decodeURIComponent(rawPath);
}
