import { useGameStore } from '../../store/gameStore'
import styles from './TitleScreen.module.css'

/**
 * Pantalla de título: logo EDEL + botón de inicio + créditos y footer legal.
 */
export default function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <div className={styles.screen}>

      {/* ── Contenido principal centrado ────────────────────── */}
      <div className={styles.main}>
        <h1 className={styles.logo}>EDEL</h1>
        <p className={styles.subtitle}>Entre Desvelo y Ensueño Latente</p>

        <button
          className={styles.startBtn}
          onClick={() => setScreen('login')}
        >
          Comenzar
        </button>
      </div>

      {/* ── Parte inferior ────────────────────────────────────── */}
      <div className={styles.bottom}>
        <p className={styles.hint}>Toca para continuar</p>
      </div>

    </div>
  )
}
