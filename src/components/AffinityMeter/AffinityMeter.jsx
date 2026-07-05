import { useState, useEffect, useRef } from 'react'
import { useCharacterAffinity } from '../../hooks/useAffinity'
import { AFFINITY_MAX } from '../../constants/affinity'
import styles from './AffinityMeter.module.css'

export default function AffinityMeter({ characterId }) {
  const { affinityValue, character } = useCharacterAffinity(characterId)
  const prevRef = useRef(affinityValue)
  const [pulsing, setPulsing] = useState(false)

  useEffect(() => {
    if (affinityValue > prevRef.current) {
      setPulsing(true)
      const t = setTimeout(() => setPulsing(false), 900)
      prevRef.current = affinityValue
      return () => clearTimeout(t)
    }
    prevRef.current = affinityValue
  }, [affinityValue])

  if (!character) return null

  const pct = Math.round((affinityValue / AFFINITY_MAX) * 100)

  return (
    <div className={styles.meter}>
      <div className={styles.bar}>
        <div className={`${styles.fill} ${pulsing ? styles.pulse : ''}`} style={{ height: `${pct}%` }} />
      </div>
      <div className={`${styles.heartWrap} ${pulsing ? styles.pulseBadge : ''}`}>
        <span className={styles.heartOutline}>♥</span>
        <span className={styles.heartFill}>♥</span>
        <span className={styles.pct}>{pct}%</span>
      </div>
    </div>
  )
}
