import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import AffinityReport from '../../components/AffinityReport/AffinityReport'
import styles from './EpisodeEndScreen.module.css'

export default function EpisodeEndScreen() {
  const setScreen       = useGameStore((s) => s.setScreen)
  const completeEpisode = useGameStore((s) => s.completeEpisode)
  const userId          = useGameStore((s) => s.userId)
  const [showAffinity, setShowAffinity] = useState(false)

  useEffect(() => {
    completeEpisode(1)
  }, [])

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.label}>Episodio 1</p>
        <h1 className={styles.title}>Fin</h1>
        <p className={styles.subtitle}>Universidad Somnia · Guadalajara</p>

        <div className={styles.buttons}>
          <button className={styles.btn} onClick={() => setShowAffinity(true)}>
            ♥ Ver vínculos
          </button>
          <button className={styles.btn} onClick={() => setScreen('gallery')}>
            Ver galería
          </button>
          {userId ? (
            <button className={styles.btn} onClick={() => setScreen('episodeList')}>
              Lista de episodios
            </button>
          ) : (
            <button className={styles.btn} onClick={() => setScreen('comingSoon')}>
              Episodio 2
            </button>
          )}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setScreen('protagonistSelect')}>
            Elegir protagonista
          </button>
        </div>
      </div>

      {showAffinity && <AffinityReport onClose={() => setShowAffinity(false)} />}
    </div>
  )
}
