import styles from './ChoicePanel.module.css'

export default function ChoicePanel({ choices = [], text = null, onChoice }) {
  if (!choices.length) return null

  return (
    <div className={styles.panel}>
      {text && <p className={styles.question}>{text}</p>}
      {choices.map((choice, i) => (
        <button
          key={i}
          className={styles.choice}
          onClick={() => onChoice(choice)}
        >
          <span className={styles.bullet}>◆</span>
          {choice.label}
        </button>
      ))}
    </div>
  )
}
