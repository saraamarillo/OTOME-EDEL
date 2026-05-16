import { useGameStore } from '../../store/gameStore'
import styles from './ComingSoonScreen.module.css'

export default function ComingSoonScreen() {
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.label}>Episodio 2</p>
        <h1 className={styles.title}>Próximamente</h1>
        <p className={styles.subtitle}>
          La historia de Soledad y Ayla continúa.<br />
          El Club Paranormal guarda más secretos de los que parece.
        </p>
        <button className={styles.btn} onClick={() => setScreen('episodeEnd')}>
          Volver
        </button>
      </div>
    </div>
  )
}
