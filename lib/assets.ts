// Keep public asset URLs compatible with the repository's optional static base path.
export function assetUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`
}
