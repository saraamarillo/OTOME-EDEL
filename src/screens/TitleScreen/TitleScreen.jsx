import { useGameStore } from '../../store/gameStore'
import styles from './TitleScreen.module.css'

/**
 * Pantalla de título: logo EDEL + botón de inicio.
 */
export default function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <h1 className={styles.title}>EDEL</h1>
        <p className={styles.subtitle}>Universidad Somnia · Guadalajara</p>
        <button
          className={styles.startBtn}
          onClick={() => setScreen('login')}
        >
          Comenzar
        </button>
      </div>
    </div>
  )
}
