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
        <p className={styles.subtitle}>Universidad Somnia · Guadalajara</p>

        <p className={styles.episode}>Episodio Piloto · Ya disponible</p>

        <div className={styles.credits}>
          <p>Esta novela visual interactiva está inspirada en la campaña de rol «EDEL»</p>
          <p>
            Diseño y adaptación interactiva por{' '}
            <a
              href="https://www.instagram.com/saramarillo"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >saramarillo</a>
          </p>
          <p>
            Historia original creada y dirigida por{' '}
            <a
              href="https://www.instagram.com/cadia.ink"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >cadia.ink</a>
          </p>
        </div>

        <button
          className={styles.startBtn}
          onClick={() => setScreen('login')}
        >
          Comenzar
        </button>
      </div>

      {/* ── Parte inferior: @checkrol + footer legal ─────────── */}
      <div className={styles.bottom}>
        <p className={styles.checkrolLine}>
          Más rutas, episodios y secretos próximamente.{' '}
          <a
            href="https://www.instagram.com/checkrol"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >@checkrol</a>
        </p>

        <p className={styles.footerText}>
          © 2026 CheckRol. Todos los derechos reservados.{' '}
          Proyecto inspirado en la campaña de rol «EDEL», creada por{' '}
          <a
            href="https://www.instagram.com/cadia.ink"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >cadia.ink</a>
          {' '}· Adaptada por{' '}
          <a
            href="https://www.instagram.com/saramarillo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >saramarillo</a>
          {' '}· Fanmade sin fines comerciales.
          <br />
          Creado con Claude Code de Anthropic · Imágenes generadas con Adobe Firefly
          <br />
          Música creada con Suno AI · Corrección y apoyo de guion con OpenAI
        </p>
      </div>

    </div>
  )
}
