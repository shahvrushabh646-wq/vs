/** Text that is allowed to be painted on the reel. The studio name is never drawn. */
export function reelCopy(text: string | undefined | null, fallback = ""): string {
  const cleaned = (text || "")
    .replace(/festival\s+of\s+bharat/gi, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s·—\-–|]+|[\s·—\-–|]+$/g, "")
    .trim();
  return cleaned || fallback;
}
