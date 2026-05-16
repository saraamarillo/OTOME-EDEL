import { AFFINITY_THRESHOLDS, HEART_COUNT } from '../constants/affinity'

/**
 * Devuelve la expresión que debe mostrar un personaje según su afinidad actual.
 * Recorre los umbrales de mayor a menor y devuelve el primero que se cumpla.
 */
export function getExpressionForAffinity(affinityValue) {
  const sorted = Object.values(AFFINITY_THRESHOLDS).sort((a, b) => b.min - a.min)
  for (const threshold of sorted) {
    if (affinityValue >= threshold.min) return threshold.expression
  }
  return 'neutral'
}

/**
 * Convierte un valor de afinidad (0-100) a un número de corazones llenos (0-HEART_COUNT).
 */
export function affinityToHearts(affinityValue) {
  return Math.round((affinityValue / 100) * HEART_COUNT)
}
