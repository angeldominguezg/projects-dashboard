// utils/timeAgo.js
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha para mostrar "Created X time ago"
 * @param {string} dateString - Fecha en formato ISO (ej: "2025-07-03T11:29:54+00:00")
 * @param {Object} options - Opciones de configuración
 * @param {string} options.locale - Código de idioma ('es', 'en')
 * @param {boolean} options.addPrefix - Añadir "Created" al inicio
 * @param {boolean} options.addSuffix - Añadir "ago" o equivalente (true por defecto)
 * @param {boolean} options.includeSeconds - Incluir segundos en tiempos cortos
 * @returns {string} Texto formateado (ej: "Created 2 days ago")
 */
export function timeAgo(
  dateString: string, 
  { 
    locale = 'es', 
    addPrefix = true, 
    addSuffix = true, 
    includeSeconds = false 
  } = {}
) {
  if (!dateString) return '';
  
  try {
    // Parsear la fecha
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    // Configurar el locale
    const localeObj = locale === 'es' ? es : undefined;
    
    // Generar el texto de tiempo relativo
    const timeDistance = formatDistanceToNow(date, {
      addSuffix,
      includeSeconds,
      locale: localeObj
    });
    
    // Añadir el prefijo según el idioma
    if (addPrefix) {
      return locale === 'es' 
        ? `Creado ${timeDistance}` 
        : `Created ${timeDistance}`;
    }
    
    return timeDistance;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
}

/**
 * Formatea una fecha para mostrar tiempo relativo con fallback a formato específico
 * @param {string} dateString - Fecha en formato ISO
 * @param {number} maxDays - Máximo número de días para mostrar formato relativo
 * @param {string} formatPattern - Patrón de formato si excede maxDays
 * @param {string} locale - Código de idioma ('es', 'en')
 * @returns {string} Texto formateado
 */
export function smartTimeAgo(
  dateString: string, 
  maxDays = 7, 
  formatPattern = 'PPP', 
  locale = 'es'
) {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const localeObj = locale === 'es' ? es : undefined;
    const now = new Date();
    
    // Calcular diferencia en días
    const diffInMs = now - date;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    // Si es reciente, usar formato relativo
    if (diffInDays < maxDays) {
      return locale === 'es'
        ? `Creado ${formatDistanceToNow(date, { addSuffix: true, locale: localeObj })}`
        : `Created ${formatDistanceToNow(date, { addSuffix: true, locale: localeObj })}`;
    }
    
    // Si es antiguo, usar formato de fecha específico
    return locale === 'es'
      ? `Creado el ${format(date, formatPattern, { locale: localeObj })}`
      : `Created on ${format(date, formatPattern, { locale: localeObj })}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
}

