import { useGameStore } from '../../store/gameStore'
import styles from './Background.module.css'

export default function Background() {
  const backgroundId = useGameStore((s) => s.backgroundId)

  const bgStyle =
    backgroundId && backgroundId !== 'pantalla_negra'
      ? { backgroundImage: `url('/assets/backgrounds/${backgroundId}.png')` }
      : backgroundId === 'pantalla_negra'
      ? { backgroundImage: 'none', background: '#000' }
      : undefined

  return <div className={styles.background} style={bgStyle} />
}
