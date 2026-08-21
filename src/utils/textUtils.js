// =====================================================
// NORMALIZAR TEXTO
// =====================================================

export function normalizarTexto(texto) {
  if (!texto) {
    return "";
  }

  return String(texto)
    .trim()
    .toLowerCase()
    .replace(/(^|\s)([a-záéíóúüñ])/g, (_, espacio, letra) => {
      return espacio + letra.toUpperCase();
    });
}