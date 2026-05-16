import { useGameStore } from '../../store/gameStore'
import styles from './Background.module.css'

/**
 * Renderiza el fondo de escenario.
 * Lee backgroundId del store y carga /assets/backgrounds/<id>.png.
 * Si no hay fondo definido muestra un degradado oscuro de fallback.
 */
export default function Background() {
  const backgroundId = useGameStore((s) => s.backgroundId)

  return (
    <div
      className={styles.background}
      style={
        backgroundId
          ? { backgroundImage: `url('/assets/backgrounds/${backgroundId}.png')` }
          : undefined
      }
    />
  )
}
