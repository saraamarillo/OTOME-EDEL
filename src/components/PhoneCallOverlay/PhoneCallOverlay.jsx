import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import styles from './PhoneCallOverlay.module.css'

const PHONE_PATH = 'M450.2,922.2l-20.3-1.1c-55.1-4.4-108.4-17.8-158.8-40.5-9.7-4.4-19.6-5.7-29.9-2l-165.6,58.7c-8.2,2.9-17.3-.4-20.9-8.2s-1.3-9.7.2-14.4l37.1-123.3,8.3-30.7c1.3-9.5-4.3-17.4-9.7-24.6C37.5,665.1,7.1,580.6,1,492.6l-.6-15.9c-.4-10.6-.6-20.5,0-31l1.1-22.2c8.4-100,48-196.2,115.1-270.9l28.7-29.4c49.4-46.1,107.8-80.1,172.3-100.6,32.5-10.3,65.3-16.7,99.2-20.4l13.9-1.1,19.4-.8c7.3-.3,15.1-.6,22.6-.2l19.1,1c49.2,2.5,103.8,16.1,149.8,34.9,50.1,20.4,94.9,49.9,134.6,86.2l29.1,29.9c13.6,14,24.7,29.1,35.8,45.4,46.2,67.7,73.7,146.4,79.9,228.1l1,20.2c.5,9.2,1.5,18,.2,27.2l-.8,21.5c-2.9,39.7-10,77.9-23,115.8-14.2,41.3-33.6,79.7-58.3,115.6s-22.8,32-36.7,46.3l-24.3,25c-37,34.6-78.7,63.2-125.3,83.7-46.7,20.6-95.6,34.6-146.3,39.1l-12.8,1.1-19.1,1h-25.4Z'
const PHONE_PATH_2 = 'M542.8,589.8l105.6,133c1.4,1.8.6,4.7-.8,5.7l-19.4,14.7c-46.7,28.6-102.5,16.8-150.3-5.8-59.3-28.1-116.3-79.1-159.2-128.7-38.2-44.1-69.9-92.4-94.8-145.1s-18.5-43.3-24.6-66.5c-11.7-44.5-14.1-100.1,13.7-138.1,7.8-10.7,17.7-18.9,27.9-27.2s5.1-1.2,6.9,1l106.8,134.8c1.5,1.8,2,4.8.4,6.3l-15.2,14.8c-17.8,17.3-12,39.9.9,60.2,30,47.1,64.9,90.7,104.5,130,8.9,8.9,17.5,16.7,27.8,23.3,12.9,8.3,28.6,8.2,41.5.2l18.8-14.2c1.6-1.2,3-2,4.9-1.8s3,1.2,4.7,3.4Z'

export function PhoneIcon({ className }) {
  return (
    <svg viewBox="0 0 922.9 938.2" className={className} fill="currentColor">
      <path d={PHONE_PATH} opacity=".32" />
      <path d={PHONE_PATH_2} />
    </svg>
  )
}

export default function PhoneCallOverlay({ node, onAdvance }) {
  if (!node || node.type !== 'phone') return null

  const protagonistId         = useGameStore((s) => s.protagonistId)
  const protagonistExpression = useGameStore((s) => s.protagonistExpression)
  const callFrozenExpression  = useGameStore((s) => s.callFrozenExpression)
  const volume                = useGameStore((s) => s.volume)
  const ringtonePlayed        = useGameStore((s) => s.ringtonePlayed)
  const setRingtonePlayed     = useGameStore((s) => s.setRingtonePlayed)
  const audioRef              = useRef(null)

  useEffect(() => {
    if (ringtonePlayed) return
    setRingtonePlayed(true)
    const audio = new Audio('/assets/music/ringtone.mp3')
    audio.loop   = false
    audio.volume = Math.max(0, Math.min(1, volume))
    audioRef.current = audio
    audio.play().catch(() => {})
    return () => { audio.pause(); audio.currentTime = 0 }
  }, [])

  function stopRingtone() {
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.currentTime = 0 }
  }

  const characterId  = node.character
  const allChars     = [...NPC_CHARACTERS, ...PROTAGONISTS]
  const charData     = allChars.find((c) => c.id === characterId)
  const callerName   = charData?.name ?? characterId ?? '???'

  const protagData    = PROTAGONISTS.find((p) => p.id === protagonistId)
  const expr          = callFrozenExpression ?? protagonistExpression ?? 'neutral'
  const protagSprite  = protagonistId ? `/assets/sprites/${protagonistId}/arc1_${expr}.png` : null
  const protagAvatar  = protagData?.avatar ?? null
  const theme         = protagData?.color ?? '#2f7fb8'

  return (
    <div className={styles.overlay} onClick={(e) => { e.stopPropagation(); stopRingtone(); onAdvance() }}>

      <div className={styles.iconRow}>
        <div className={styles.iconBtn} style={{ background: theme }}>
          <PhoneIcon className={styles.icon} />
        </div>
      </div>

      <div className={styles.card} style={{ borderTopColor: theme }}>
        <div className={styles.cardHead}>
          <span className={styles.iconInline} style={{ color: theme }}><PhoneIcon className={styles.iconInline} /></span>
          <span className={styles.speaker} style={{ color: theme }}>{callerName}</span>
          <span className={styles.remoteLabel}>Llamada entrante</span>
        </div>
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
