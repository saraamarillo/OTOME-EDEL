import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import styles from './PhoneCallOverlay.module.css'

export default function PhoneCallOverlay({ node, onAdvance }) {
  if (!node || node.type !== 'phone') return null

  const protagonistId         = useGameStore((s) => s.protagonistId)
  const protagonistExpression = useGameStore((s) => s.protagonistExpression)
  const volume                = useGameStore((s) => s.volume)

  useEffect(() => {
    const audio = new Audio('/assets/music/ringtone.mp3')
    audio.loop   = true
    audio.volume = Math.max(0, Math.min(1, volume))
    audio.play().catch(() => {})
    return () => { audio.pause(); audio.currentTime = 0 }
  }, [])

  const characterId  = node.character
  const allChars     = [...NPC_CHARACTERS, ...PROTAGONISTS]
  const charData     = allChars.find((c) => c.id === characterId)
  const callerName   = charData?.name ?? characterId ?? '???'
  const callerAvatar = charData?.avatar ?? null

  const protagData    = PROTAGONISTS.find((p) => p.id === protagonistId)
  const expr          = protagonistExpression ?? 'neutral'
  const protagSprite  = protagonistId ? `/assets/sprites/${protagonistId}/arc1_${expr}.png` : null
  const protagAvatar  = protagData?.avatar ?? null

  return (
    <div className={styles.overlay} onClick={(e) => { e.stopPropagation(); onAdvance() }}>

      {/* Sección central: círculo + bocadillo */}
      <div className={styles.callerSection}>

        {/* Círculo del llamante centrado */}
        <div className={styles.callerCircle}>
          {callerAvatar ? (
            <img
              src={callerAvatar}
              alt={callerName}
              className={styles.callerImg}
              onError={(e) => { e.currentTarget.src = '/assets/phone.png'; e.currentTarget.className = styles.phoneIconFallback }}
            />
          ) : (
            <img src="/assets/phone.png" alt="llamada" className={styles.phoneIconFallback} />
          )}
        </div>

        {/* Burbuja de diálogo debajo del círculo */}
        <div className={styles.bubble}>
          <p className={styles.callLabel}>llamada entrante</p>
          <p className={styles.callerName}>{callerName}</p>
          {node.text && <p className={styles.text}>{node.text}</p>}
          <p className={styles.hint}>· toca para continuar ·</p>
        </div>

      </div>

      {/* Cara protagonista — esquina inferior izquierda */}
      {protagonistId && (
        <div className={styles.protagCircle}>
          <img
            src={protagSprite ?? protagAvatar}
            alt={protagonistId}
            className={styles.protagImg}
            onError={(e) => { if (protagAvatar) e.currentTarget.src = protagAvatar }}
          />
        </div>
      )}

    </div>
  )
}
