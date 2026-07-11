import { useEffect, useState } from 'react'

/** Expresión usada como sustituto cuando no hay retrato "neutral" para esa protagonista. */
const NEUTRAL_SUBSTITUTE = 'happy'

/**
 * Resuelve la ruta del retrato arc1_<expr> de la protagonista activa con una
 * cadena de fallback en 3 pasos, pensada para protagonistas que todavía no
 * tienen un arc1.png neutro (p. ej. Soledad, que solo tiene emociones):
 *   1. arc1.png (si expr === 'neutral') o arc1_<expr>.png
 *   2. si el paso 1 era el neutro y no existe: arc1_happy.png
 *   3. avatarFallback (foto de perfil genérica)
 */
export function useProtagonistFace(protagonistId, expr, avatarFallback) {
  const [stage, setStage] = useState(0)
  const isNeutral = expr === 'neutral'

  useEffect(() => { setStage(0) }, [protagonistId, expr])

  if (!protagonistId) return { src: null, onError: () => {} }

  const primarySrc = `/assets/sprites/${protagonistId}/arc1${isNeutral ? '' : `_${expr}`}.png`
  const substituteSrc = `/assets/sprites/${protagonistId}/arc1_${NEUTRAL_SUBSTITUTE}.png`

  let src = primarySrc
  if (stage === 1) src = isNeutral ? substituteSrc : avatarFallback
  if (stage >= 2) src = avatarFallback

  function onError() {
    setStage((s) => s + 1)
  }

  return { src, onError }
}
