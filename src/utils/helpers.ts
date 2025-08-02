export function getFirstNWords(text: string, n: number): string {
  const words = text.split(" ");
  const firstsN = words.slice(0, n);
  return firstsN.join(" ");
}

export function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones bajos con guiones
      .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
}