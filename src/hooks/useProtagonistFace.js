import { useEffect, useState } from 'react'

/** Expresión de repuesto si ni siquiera el retrato base (neutral) existe para esa protagonista. */
const NEUTRAL_SUBSTITUTE = 'happy'

/**
 * Resuelve la ruta del retrato arc1_<expr> de la protagonista activa con una
 * cadena de fallback en 3 pasos:
 *   1. arc1.png (si expr === 'neutral') o arc1_<expr>.png
 *   2. si faltaba una emoción concreta: arc1.png (el retrato neutro/serio);
 *      si ni el neutro existe: arc1_happy.png
 *   3. avatarFallback (foto de perfil genérica)
 */
export function useProtagonistFace(protagonistId, expr, avatarFallback) {
  const [stage, setStage] = useState(0)
  const isNeutral = expr === 'neutral'

  useEffect(() => { setStage(0) }, [protagonistId, expr])

  if (!protagonistId) return { src: null, onError: () => {} }

  const primarySrc = `/assets/sprites/${protagonistId}/arc1${isNeutral ? '' : `_${expr}`}.png`
  const bareSrc = `/assets/sprites/${protagonistId}/arc1.png`
  const substituteSrc = `/assets/sprites/${protagonistId}/arc1_${NEUTRAL_SUBSTITUTE}.png`

  let src = primarySrc
  if (stage === 1) src = isNeutral ? substituteSrc : bareSrc
  if (stage >= 2) src = avatarFallback

  function onError() {
    setStage((s) => s + 1)
  }

  return { src, onError }
}
