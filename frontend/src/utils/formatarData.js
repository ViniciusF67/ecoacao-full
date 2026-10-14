export function formatarData(isoString) {
  const data = new Date(isoString)
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}
