import { useGameStore } from '../../store/gameStore'
import styles from './ChoicePanel.module.css'

export default function ChoicePanel({ choices = [], text = null, onChoice }) {
  const protagonistId = useGameStore((s) => s.protagonistId)
  if (!choices.length) return null

  const colorClass = protagonistId === 'ayla' ? styles.choiceAyla : styles.choiceSoledad

  return (
    <div className={styles.panel}>
      {text && <p className={styles.question}>{text}</p>}
      {choices.map((choice, i) => (
        <button
          key={i}
          className={`${styles.choice} ${colorClass}`}
          onClick={() => onChoice(choice)}
        >
          <span className={styles.bullet}>◆</span>
          {choice.label}
        </button>
      ))}
    </div>
  )
}
