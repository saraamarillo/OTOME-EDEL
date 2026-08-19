import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import { ROUTE_THEME } from '../../constants/theme'
import styles from './Episode3Popup.module.css'

/**
 * Pop-up en la pantalla de elegir personaje: avisa de que el episodio 3
 * está disponible para las dos rutas y permite saltar directamente a la
 * portada de cualquiera de las dos sin pasar por la selección normal.
 */
export default function Episode3Popup({ onClose }) {
  const selectProtagonist = useGameStore((s) => s.selectProtagonist)
  const setSelectedEpisode = useGameStore((s) => s.setSelectedEpisode)
  const setScreen = useGameStore((s) => s.setScreen)

  function handlePick(id) {
    selectProtagonist(id)
    setSelectedEpisode(3)
    setScreen('episode3Intro')
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>

        <p className={styles.eyebrow}>Nuevo episodio</p>
        <h2 className={styles.heading}>Episodio 3 disponible</h2>
        <p className={styles.body}>
          «Nos vamos de fiesta» ya está aquí, desde el punto de vista de Ayla y de Soledad. Elige con quién quieres vivirlo.
        </p>

        <div className={styles.split}>
          {PROTAGONISTS.map((p) => {
            const theme = ROUTE_THEME[p.id] ?? ROUTE_THEME.ayla
            return (
              <button
                key={p.id}
                className={`${styles.half} ${theme.mode === 'camara' ? styles.halfCamara : styles.halfDiario}`}
                onClick={() => handlePick(p.id)}
              >
                <span className={styles.halfName}>{p.name.split(' ')[0]}</span>
                <span className={styles.halfCta}>Jugar POV {p.name.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
