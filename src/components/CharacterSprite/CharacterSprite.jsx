import { useState, useEffect } from 'react'
import { useCharacterAffinity } from '../../hooks/useAffinity'
import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import styles from './CharacterSprite.module.css'

/** Expresión usada como sustituto cuando no hay retrato "neutral" para ese look. */
const NEUTRAL_SUBSTITUTE = 'happy'

/**
 * Muestra el sprite centrado del personaje activo.
 *
 * Ruta del sprite: /assets/sprites/<id>/<look>_<expression>.png
 * Cadena de fallback (por si el look no tiene retrato neutro, p. ej. Soledad):
 *   1. <look>_<expression>.png (o <look>_happy.png si expression es "neutral")
 *   2. <look>.png (retrato base sin expresión)
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
  const primarySrc  = characterId ? `/assets/sprites/${characterId}/${look}${isNeutral ? `_${NEUTRAL_SUBSTITUTE}` : `_${expression}`}.png` : null

  useEffect(() => { setStage(0) }, [characterId, look, expression])

  if (!characterId) return null

  const charData = NPC_CHARACTERS.find((c) => c.id === characterId) ?? PROTAGONISTS.find((p) => p.id === characterId)

  if (charData?.protagonistOnly && charData.protagonistOnly !== protagonistId) return null

  const bareSrc   = `/assets/sprites/${characterId}/${look}.png`
  const avatarSrc = charData?.avatar ?? null

  let src = primarySrc
  if (stage === 1) src = bareSrc
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
