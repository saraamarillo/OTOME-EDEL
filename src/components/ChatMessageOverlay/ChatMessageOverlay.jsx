import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import styles from './ChatMessageOverlay.module.css'

const CHAT_PATH = 'M450,954.9c-59.9-3.7-127.2-22.6-180.8-48.8-5-2.5-9.5-4.7-15.4-2.9l-157,48.5c-8.7,2.7-16.9-2.2-21.8-9.3-3.6-5.3-2.5-12.2-.8-18.2l7.3-25,14.3-49.3,13.3-52.8c.9-3.7,3.3-9.7.5-13.1-19.7-24.6-37.6-49.6-52.6-77.5-30.3-56.4-48.4-118.2-54.7-181.8l-1.2-15.8L0,489.7v-27s1-17.1,1-17.1c.3-5,.8-9.6,1.3-14.8,5.2-56.8,20.6-111.7,45.2-163.3,19.7-41.3,45-78.7,75.7-112.3l30.6-30.6C234.1,51.5,336.4,9.5,444.6,1.2c9.2-.7,17.2-1.3,26.2-1.1l35.9.6,11.2.7c53.3,3.3,105.1,17.1,154.5,37.9,47.4,20,90.3,47.3,128.9,80.9l15.4,14.7,12.5,12.5,11.7,12.4c66,74.4,105.7,168.2,116.4,267.1l1.1,13.9,1,18v36.1s-1,19-1,19l-1.2,14.7c-9.2,89-43.4,172.7-98.7,242.9-15.9,20.2-32.8,38.8-51.9,56.1-39.8,36.1-84.1,65.9-133.5,87.5s-93.1,32.7-142.3,38.5l-14,1.1-15,1h-39s-12.7-.8-12.7-.8Z'
const CHAT_PATH_2 = 'M301.8,672.1l-47.9,64.8c-3,4.1-13,3.8-15.2-1.2l-41.5-95.3c-4.3-9.8-6.2-19.9-6.2-30.8l-.2-235.9c0-49.7,39.6-95.1,90.7-95.1h403.1c51.3.1,89.9,46.6,89.8,96l-.2,205.8c-2,54.7-49.1,96-103.7,91.6h-368.7Z'

export function ChatIcon({ className }) {
  return (
    <svg viewBox="0 0 959.5 955.7" className={className} fill="currentColor">
      <path d={CHAT_PATH} opacity=".28" />
      <path d={CHAT_PATH_2} />
      <circle cx="621.3" cy="474.7" r="38.8" />
      <circle cx="344.7" cy="474.7" r="38.8" />
      <circle cx="483.1" cy="474.7" r="38.8" />
    </svg>
  )
}

export default function ChatMessageOverlay({ node, onAdvance }) {
  if (!node || node.type !== 'chat') return null

  const protagonistId         = useGameStore((s) => s.protagonistId)
  const protagonistExpression = useGameStore((s) => s.protagonistExpression)
  const volume                = useGameStore((s) => s.volume)

  useEffect(() => {
    const audio = new Audio('/assets/music/notification.mp3')
    audio.volume = Math.max(0, Math.min(1, volume))
    audio.play().catch(() => {})
    return () => { audio.pause(); audio.currentTime = 0 }
  }, [])

  const characterId  = node.character
  const allChars     = [...NPC_CHARACTERS, ...PROTAGONISTS]
  const charData     = allChars.find((c) => c.id === characterId)
  const displayName  = charData?.name ?? characterId ?? '???'

  const protagData    = PROTAGONISTS.find((p) => p.id === protagonistId)
  const expr          = protagonistExpression ?? 'neutral'
  const protagSprite  = protagonistId ? `/assets/sprites/${protagonistId}/arc1_${expr}.png` : null
  const protagAvatar  = protagData?.avatar ?? null
  const theme         = protagData?.color ?? '#7d5cc8'

  return (
    <div className={styles.overlay} onClick={(e) => { e.stopPropagation(); onAdvance() }}>

      <div className={styles.iconRow}>
        <div className={styles.iconBtn} style={{ background: theme }}>
          <ChatIcon className={styles.icon} />
        </div>
      </div>

      <div className={styles.card} style={{ borderTopColor: theme }}>
        <div className={styles.cardHead}>
          <span className={styles.iconInline} style={{ color: theme }}><ChatIcon className={styles.iconInline} /></span>
          <span className={styles.speaker} style={{ color: theme }}>{displayName}</span>
          <span className={styles.remoteLabel}>Mensaje nuevo</span>
        </div>
        {node.isGroup && <p className={styles.groupTag}>Grupo Club Paranormal</p>}
        {node.text && <p className={styles.text}>{node.text}</p>}
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
