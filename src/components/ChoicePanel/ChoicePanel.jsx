import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import styles from './ChoicePanel.module.css'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

export default function ChoicePanel({ choices = [], text = null, onChoice }) {
  const protagonistId = useGameStore((s) => s.protagonistId)
  if (!choices.length) return null

  const protagData  = PROTAGONISTS.find((p) => p.id === protagonistId)
  const themeColor  = protagData?.color ?? '#e38e1f'

  return (
    <div className={styles.panel}>
      <p className={styles.decideLabel} style={{ color: themeColor }}>¿QUÉ DECIDES?</p>
      {text && <p className={styles.question}>{text}</p>}
      {choices.map((choice, i) => (
        <button
          key={i}
          className={styles.choice}
          onClick={() => onChoice(choice)}
        >
          <span className={styles.letterBadge} style={{ background: themeColor }}>
            {LETTERS[i] ?? String.fromCharCode(65 + i)}
          </span>
          {choice.label}
        </button>
      ))}
    </div>
  )
}
