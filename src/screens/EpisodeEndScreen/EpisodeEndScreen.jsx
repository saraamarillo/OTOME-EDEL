import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { ROUTE_THEME } from '../../constants/theme'
import AffinityReport from '../../components/AffinityReport/AffinityReport'
import styles from './EpisodeEndScreen.module.css'

export default function EpisodeEndScreen() {
  const setScreen         = useGameStore((s) => s.setScreen)
  const completeEpisode   = useGameStore((s) => s.completeEpisode)
  const saveProgress      = useGameStore((s) => s.saveProgress)
  const userId            = useGameStore((s) => s.userId)
  const selectedEpisode   = useGameStore((s) => s.selectedEpisode)
  const protagonistId     = useGameStore((s) => s.protagonistId)
  const theme              = ROUTE_THEME[protagonistId] ?? ROUTE_THEME.ayla
  const isCamara            = theme.mode === 'camara'
  const [showAffinity, setShowAffinity] = useState(false)

  useEffect(() => {
    completeEpisode(selectedEpisode)
    saveProgress()
  }, [])

  const btnClass = isCamara ? styles.btnCamara : styles.btnDiario

  return (
    <div className={`${styles.screen} ${isCamara ? styles.screenCamara : styles.screenDiario}`}>
      {isCamara && (
        <>
          <div className={styles.gridV} style={{ left: '33.33%' }} />
          <div className={styles.gridV} style={{ left: '66.66%' }} />
          <div className={styles.gridH} style={{ top: '33.33%' }} />
          <div className={styles.gridH} style={{ top: '66.66%' }} />
        </>
      )}
      {!isCamara && <div className={styles.ruled} />}

      <div className={styles.content}>
        <p className={isCamara ? styles.labelCamara : styles.labelDiario}>Episodio {selectedEpisode}</p>
        <h1 className={isCamara ? styles.titleCamara : styles.titleDiario}>Fin</h1>
        <p className={isCamara ? styles.subtitleCamara : styles.subtitleDiario}>Universidad Somnia · Guadalajara</p>

        <div className={styles.buttons}>
          <button className={btnClass} onClick={() => setShowAffinity(true)}>♥ Ver vínculos</button>
          <button className={btnClass} onClick={() => setScreen('gallery')}>Ver galería</button>
          {userId ? (
            <button className={btnClass} onClick={() => setScreen('episodeList')}>Lista de episodios</button>
          ) : (
            <button className={btnClass} onClick={() => setScreen('comingSoon')}>Episodio {selectedEpisode + 1}</button>
          )}
        </div>

        <button
          className={isCamara ? styles.changeCamara : styles.changeDiario}
          onClick={() => setScreen('protagonistSelect')}
        >
          Cambiar protagonista
        </button>
      </div>

      {showAffinity && <AffinityReport onClose={() => setShowAffinity(false)} />}
    </div>
  )
}
