/** Rango de afinidad por personaje. */
export const AFFINITY_MIN = 0
export const AFFINITY_MAX = 100
export const AFFINITY_DEFAULT = 0

/**
 * Umbrales que determinan qué expresión muestra un personaje.
 * El sprite que se carga es: /assets/sprites/<id>/<expression>.png
 */
// sad y angry solo se activan manualmente por nodo ("expression": "sad")
// La afinidad solo cambia el sprite entre neutral / happy / blush
export const AFFINITY_THRESHOLDS = {
  veryHigh: { min: 80, expression: 'blush' },
  high:     { min: 60, expression: 'happy' },
  neutral:  { min: 0,  expression: 'neutral' },
}

/** Cuántos corazones se muestran en el medidor (UI). */
export const HEART_COUNT = 5
