import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import styles from './ChatMessageOverlay.module.css'

export default function ChatMessageOverlay({ node, onAdvance }) {
  if (!node || node.type !== 'chat') return null

  const protagonistId         = useGameStore((s) => s.protagonistId)
  const protagonistExpression = useGameStore((s) => s.protagonistExpression)
  const volume                = useGameStore((s) => s.volume)
  const [senderFallback, setSenderFallback] = useState(false)
  const [protagFallback, setProtagFallback] = useState(false)

  useEffect(() => {
    const audio = new Audio('/assets/music/notification.mp3')
    audio.volume = Math.max(0, Math.min(1, volume))
    audio.play().catch(() => {})
    return () => { audio.pause(); audio.currentTime = 0 }
  }, [])

  const characterId  = node.character
  const allChars     = [...NPC_CHARACTERS, ...PROTAGONISTS]
  const charData     = allChars.find((c) => c.id === characterId)
  const displayName  = charData?.name ?? characterId
  const accentColor  = charData?.color ?? 'rgba(255,255,255,0.4)'
  const senderAvatar = charData?.avatar ?? null

  const protagData        = PROTAGONISTS.find((p) => p.id === protagonistId)
  const expr              = protagonistExpression ?? 'neutral'
  const protagPrimary     = protagonistId ? `/assets/sprites/${protagonistId}/arc1_${expr}.png` : null
  const protagFallbackSrc = protagData?.avatar ?? null

  return (
    <div className={styles.wrapper} onClick={(e) => { e.stopPropagation(); onAdvance() }}>

      {/* Cara del remitente: esquina superior-izquierda, parcialmente cortada */}
      <div className={styles.senderCircle} style={{ borderColor: accentColor }}>
        {senderAvatar && !senderFallback ? (
          <img
            src={senderAvatar}
            alt={displayName}
            className={styles.senderImg}
            onError={() => setSenderFallback(true)}
          />
        ) : (
          <span className={styles.senderInitial}>{displayName[0]}</span>
        )}
      </div>

      {/* Burbuja de mensaje */}
      <div className={styles.bubble}>
        <p className={styles.name} style={{ color: accentColor }}>{displayName}</p>
        <p className={styles.text}>{node.text}</p>

        {/* Cara protagonista dentro de la burbuja, esquina inferior-derecha */}
        {protagonistId && (
          <div className={styles.protagCircle}>
            {protagPrimary && !protagFallback ? (
              <img
                src={protagPrimary}
                alt={protagonistId}
                className={styles.protagImg}
                onError={() => setProtagFallback(true)}
              />
            ) : protagFallbackSrc ? (
              <img src={protagFallbackSrc} alt={protagonistId} className={styles.protagImg} />
            ) : null}
          </div>
        )}
      </div>

      <p className={styles.hint}>· toca para continuar ·</p>
    </div>
  )
}
