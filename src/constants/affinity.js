/** Rango de afinidad por personaje. */
export const AFFINITY_MIN = 0
export const AFFINITY_MAX = 100
export const AFFINITY_DEFAULT = 0

/**
 * Umbrales que determinan qué expresión muestra un personaje.
 * El sprite que se carga es: /assets/sprites/<id>/<expression>.png
 */
export const AFFINITY_THRESHOLDS = {
  veryHigh: { min: 80, expression: 'happy' },
  high:     { min: 60, expression: 'neutral' },  // expression positiva
  neutral:  { min: 40, expression: 'neutral' },
  low:      { min: 20, expression: 'serious' },
  veryLow:  { min: 0,  expression: 'cold' },
}

/** Cuántos corazones se muestran en el medidor (UI). */
export const HEART_COUNT = 5
