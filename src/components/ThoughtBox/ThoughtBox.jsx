import { PROTAGONISTS } from '../../constants/characters'
import { useGameStore } from '../../store/gameStore'
import { ROUTE_TINT } from '../../constants/theme'
import { useProtagonistFace } from '../../hooks/useProtagonistFace'
import styles from './ThoughtBox.module.css'

/**
 * Esquina inferior izquierda.
 * El avatar de la protagonista es siempre visible y cambia de expresión
 * según protagonistExpression (fijada por los nodos de la escena).
 * La burbuja de pensamiento solo aparece en nodos de tipo "thought".
 */
export default function ThoughtBox({ node }) {
  const protagonistId = useGameStore((s) => s.protagonistId)
  const protagonistExpression = useGameStore((s) => s.protagonistExpression)
  const phoneCallActive = useGameStore((s) => s.phoneCallActive)
  const callFrozenExpression = useGameStore((s) => s.callFrozenExpression)
  const protagonist = PROTAGONISTS.find((p) => p.id === protagonistId)

  const expr = (phoneCallActive ? callFrozenExpression : null) ?? protagonistExpression ?? 'neutral'
  const face = useProtagonistFace(protagonistId, expr, protagonist?.avatar)

  if (!protagonist) return null

  const isThought = node?.type === 'thought'
  const faceSrc = face.src

  return (
    <>
      <div className={styles.avatarWrap}>
        <div className={styles.avatarRing} style={{ borderColor: protagonist.color }}>
          <img
            className={styles.avatar}
            src={faceSrc}
            alt={protagonist.name}
            draggable={false}
            onError={face.onError}
          />
        </div>
      </div>
      {isThought && node.text && (
        <div className={styles.bubble} style={{ background: ROUTE_TINT[protagonistId] ?? '#eef0f4' }}>
          <p className={styles.text}>{node.text}</p>
        </div>
      )}
    </>
  )
}
