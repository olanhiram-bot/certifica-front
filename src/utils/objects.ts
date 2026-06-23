
/**
 * Elimina las propiedades nulas o indefinidas de un objeto.
 *
 * @param obj
 * @returns Objeto sin propiedades nulas o indefinidas
 */
export function removeNulls(obj: Record<string, unknown>): Record<string, unknown> {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]
    }
  }
  return obj
}

/**
 * Convierte un objeto a FormData, manejando arrays correctamente.
 *
 * @param obj
 * @returns FormData
 */
export function convertToFormData(obj: Record<string, unknown>): FormData {
  const formData = new FormData()
  for (const key in obj) {
    if (obj[key] != null) {
      if (obj[key] instanceof Array) {
        for (const key2 in obj[key]) {
          formData.append(`${key}[]`, obj[key][key2])
        }
      } else {
        formData.append(key, String(obj[key]))
      }
    }
  }
  return formData
}
