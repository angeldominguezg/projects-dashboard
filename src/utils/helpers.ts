export function getFirstNWords(text: string, n: number): string {
  const words = text.split(" ");
  const firstsN = words.slice(0, n);
  return firstsN.join(" ");
}
