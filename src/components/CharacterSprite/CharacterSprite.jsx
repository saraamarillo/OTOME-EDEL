import { useState, useEffect } from 'react'
import { useCharacterAffinity } from '../../hooks/useAffinity'
import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import styles from './CharacterSprite.module.css'

/** Expresión de repuesto si ni siquiera el retrato base (neutral) existe para ese look. */
const NEUTRAL_SUBSTITUTE = 'happy'

/**
 * Muestra el sprite centrado del personaje activo.
 *
 * Ruta del sprite: /assets/sprites/<id>/<look>_<expression>.png
 * "neutral" (o cualquier expresión sin retrato propio) usa <look>.png, el
 * retrato base serio/neutro que ahora tiene cada personaje.
 * Cadena de fallback:
 *   1. <look>_<expression>.png (o <look>.png si expression es "neutral")
 *   2. <look>.png — si faltaba una emoción concreta, cae al neutral;
 *      <look>_happy.png — si ni el neutral existe
 *   3. avatar genérico del personaje
 *
 * lookChanges en los nodos JSON cambian el look via gameStore.
 * protagonistOnly: solo renderiza si la protagonista activa coincide.
 * spriteSize 'small': escala reducida (Apolo).
 */
export default function CharacterSprite({ characterId, visible = true }) {
  const { expression: affinityExpression } = useCharacterAffinity(characterId)
  const expressionOverride = useGameStore((s) => s.characterExpressions?.[characterId] ?? null)
  const expression = expressionOverride ?? affinityExpression
  const protagonistId = useGameStore((s) => s.protagonistId)
  const look = useGameStore((s) => s.characterLooks[characterId] ?? 'arc1')
  const [stage, setStage] = useState(0)

  const isNeutral   = expression === 'neutral'
  const primarySrc  = characterId ? `/assets/sprites/${characterId}/${look}${isNeutral ? '' : `_${expression}`}.png` : null

  useEffect(() => { setStage(0) }, [characterId, look, expression])

  if (!characterId) return null

  const charData = NPC_CHARACTERS.find((c) => c.id === characterId) ?? PROTAGONISTS.find((p) => p.id === characterId)

  if (charData?.protagonistOnly && charData.protagonistOnly !== protagonistId) return null

  const bareSrc      = `/assets/sprites/${characterId}/${look}.png`
  const substituteSrc = `/assets/sprites/${characterId}/${look}_${NEUTRAL_SUBSTITUTE}.png`
  const avatarSrc    = charData?.avatar ?? null

  let src = primarySrc
  if (stage === 1) src = isNeutral ? substituteSrc : bareSrc
  if (stage >= 2) src = avatarSrc ?? bareSrc

  const isSmall = charData?.spriteSize === 'small'

  return (
    <div className={`${styles.wrapper} ${visible ? styles.visible : styles.hidden} ${isSmall ? styles.small : ''}`}>
      <img
        className={styles.sprite}
        src={src}
        alt={characterId}
        draggable={false}
        onError={() => setStage((s) => s + 1)}
      />
    </div>
  )
}
