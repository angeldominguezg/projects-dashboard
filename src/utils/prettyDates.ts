import { format, parseISO } from 'date-fns';

/**
 * Convierte una fecha ISO a formato dd/mm/yyyy.
 * @param {string} dateString - La fecha en formato ISO (ej: "2025-07-03T11:29:54+00:00").
 * @returns {string} La fecha formateada como dd/mm/yyyy o una cadena vacía si la entrada es inválida.
 */
export function toDDMMYYYY(dateString: string): string {
  if (!dateString) {
    return '';
  }
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date to dd/mm/yyyy:', error);
    return '';
  }
}
