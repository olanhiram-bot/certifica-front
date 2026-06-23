/**
 * Normaliza un string eliminando acentos, convirtiendo a minúsculas,
 * eliminando espacios extra y caracteres especiales
 * @param str - String a normalizar
 * @returns String normalizado
 */
export const normalizeString = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por uno solo
}

/**
 * Encuentra un elemento en un array comparando un campo string normalizado
 * @param items - Array de objetos a buscar
 * @param searchValue - Valor a buscar
 * @param fieldName - Nombre del campo a comparar (por defecto 'name')
 * @param returnField - Nombre del campo a retornar (por defecto 'id')
 * @returns El valor del campo especificado o null si no se encuentra
 */
export const findByNormalizedString = <T extends Record<string, unknown>>(
  items: T[],
  searchValue: string,
  fieldName: string = 'name',
  returnField: string = 'id',
): unknown | null => {
  if (!searchValue || !items.length) return null

  const normalizedSearch = normalizeString(searchValue)

  const found = items.find((item) => {
    const normalizedName = normalizeString(item[fieldName] as string)
    return (
      normalizedName === normalizedSearch ||
      normalizedName.includes(normalizedSearch) ||
      normalizedSearch.includes(normalizedName)
    )
  })

  return found ? found[returnField] : null
}

/**
 * Extrae la extensión de un archivo a partir de su URL, ignorando query strings
 * @param url - URL del archivo
 * @returns Extensión en minúsculas o string vacío si no hay extensión
 */
export const getFileExtension = (url: string): string => {
  const clean = url.split('?')[0] ?? ''
  const dot = clean.lastIndexOf('.')
  return dot !== -1 ? clean.slice(dot + 1).toLowerCase() : ''
}
