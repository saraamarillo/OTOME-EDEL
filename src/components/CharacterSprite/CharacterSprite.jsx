import { useState } from 'react'
import { useCharacterAffinity } from '../../hooks/useAffinity'
import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS } from '../../constants/characters'
import styles from './CharacterSprite.module.css'

/**
 * Muestra el sprite centrado del personaje activo.
 *
 * Ruta del sprite: /assets/sprites/<id>/<look>_<expression>.png
 * Si ese archivo no existe, recae en /assets/sprites/<id>/<look>.png
 *
 * lookChanges en los nodos JSON cambian el look via gameStore.
 * protagonistOnly: solo renderiza si la protagonista activa coincide.
 * spriteSize 'small': escala reducida (Apolo).
 */
export default function CharacterSprite({ characterId, visible = true }) {
  const { expression } = useCharacterAffinity(characterId)
  const protagonistId = useGameStore((s) => s.protagonistId)
  const look = useGameStore((s) => s.characterLooks[characterId] ?? 'arc1')
  const [useFallback, setUseFallback] = useState(false)

  if (!characterId) return null

  const charData = NPC_CHARACTERS.find((c) => c.id === characterId)

  if (charData?.protagonistOnly && charData.protagonistOnly !== protagonistId) return null

  const primarySrc  = `/assets/sprites/${characterId}/${look}_${expression}.png`
  const fallbackSrc = `/assets/sprites/${characterId}/${look}.png`
  const src = useFallback ? fallbackSrc : primarySrc

  const isSmall = charData?.spriteSize === 'small'

  return (
    <div className={`${styles.wrapper} ${visible ? styles.visible : styles.hidden} ${isSmall ? styles.small : ''}`}>
      <img
        className={styles.sprite}
        src={src}
        alt={characterId}
        draggable={false}
        onError={() => { if (!useFallback) setUseFallback(true) }}
      />
    </div>
  )
}
