import { PROTAGONISTS } from '../../constants/characters'
import { useGameStore } from '../../store/gameStore'
import styles from './ThoughtBox.module.css'

/**
 * Esquina inferior izquierda.
 * El avatar de la protagonista es siempre visible.
 * La burbuja de pensamiento solo aparece en nodos de tipo "thought".
 */
export default function ThoughtBox({ node }) {
  const protagonistId = useGameStore((s) => s.protagonistId)
  const protagonist = PROTAGONISTS.find((p) => p.id === protagonistId)

  if (!protagonist) return null

  const isThought = node?.type === 'thought'

  const bubbleClass = [
    styles.bubble,
    protagonistId === 'soledad' ? styles.soledad : styles.ayla,
  ].join(' ')

  return (
    <div className={styles.wrapper}>
      <img
        className={styles.avatar}
        src={protagonist.avatar}
        alt={protagonist.name}
        draggable={false}
      />
      {isThought && node.text && (
        <div className={bubbleClass}>
          <p className={styles.text}>{node.text}</p>
        </div>
      )}
    </div>
  )
}
