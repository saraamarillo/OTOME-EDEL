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

  return (
    <>
      <div className={styles.avatarWrap}>
        <div className={styles.avatarRing} data-protagonist={protagonistId}>
          <img
            className={styles.avatar}
            src={protagonist.avatar}
            alt={protagonist.name}
            draggable={false}
          />
        </div>
      </div>
      {isThought && node.text && (
        <div className={styles.bubble}>
          <p className={styles.text}>{node.text}</p>
        </div>
      )}
    </>
  )
}
