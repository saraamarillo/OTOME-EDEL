import { useGameStore } from '../../store/gameStore'
import styles from './EpisodeListScreen.module.css'

const TOTAL_EPISODES = 20
const AVAILABLE = [1]

const EP_TITLES = {
  1: 'Nueva Etapa Universitaria',
}

export default function EpisodeListScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const completedEpisodes = useGameStore((s) => s.completedEpisodes)
  const logout = useGameStore((s) => s.logout)
  const userName = useGameStore((s) => s.userName)
  const selectProtagonist = useGameStore((s) => s.selectProtagonist)

  const handlePlay = (ep) => {
    selectProtagonist(null)
    setScreen('protagonistSelect')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.logo}>EDEL</h1>
        <div className={styles.userRow}>
          <span className={styles.userName}>♥ {userName}</span>
          <button className={styles.logoutBtn} onClick={logout}>Salir</button>
        </div>
      </div>

      <p className={styles.sectionTitle}>Episodios</p>

      <div className={styles.grid}>
        {Array.from({ length: TOTAL_EPISODES }, (_, i) => {
          const ep = i + 1
          const available = AVAILABLE.includes(ep)
          const completed = completedEpisodes.includes(ep)

          return (
            <div
              key={ep}
              className={`${styles.card} ${available ? styles.available : styles.locked} ${completed ? styles.completed : ''}`}
              onClick={() => available && handlePlay(ep)}
            >
              <span className={styles.epNum}>Ep. {ep}</span>
              {available ? (
                <>
                  <span className={styles.epTitle}>{EP_TITLES[ep] ?? ''}</span>
                  <span className={styles.epStatus}>
                    {completed ? '✓ Completado' : '▶ Jugar'}
                  </span>
                </>
              ) : (
                <span className={styles.comingSoon}>Próximamente</span>
              )}
            </div>
          )
        })}
      </div>

      <div className={styles.footer}>
        <button className={styles.galleryBtn} onClick={() => setScreen('gallery')}>
          Ver galería
        </button>
      </div>
    </div>
  )
}
