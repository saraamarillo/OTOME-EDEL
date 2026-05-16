import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import { useGameStore } from '../../store/gameStore'
import styles from './DialogueBox.module.css'

export default function DialogueBox({ node }) {
  const protagonistId = useGameStore((s) => s.protagonistId)

  if (!node || node.type === 'choice' || node.type === 'thought') return null

  const npcChar = NPC_CHARACTERS.find((c) => c.id === node.character)
  const protagonistChar = PROTAGONISTS.find((p) => p.id === node.character)

  // Determine bubble color class
  let boxClass = styles.box
  if (node.type === 'dialogue') {
    if (node.character === 'soledad') {
      boxClass += ' ' + styles.soledad
    } else if (node.character === 'ayla') {
      boxClass += ' ' + styles.ayla
    } else if (!node.character) {
      // Current protagonist's own voice
      boxClass += ' ' + (protagonistId === 'soledad' ? styles.soledad : styles.ayla)
    } else {
      // Regular NPC
      boxClass += ' ' + styles.npc
    }
  }

  // Name label: NPC name, or protagonist first name for cross-route appearances
  const labelName = npcChar?.name ?? (protagonistChar ? protagonistChar.name.split(' ')[0] : null)
  const labelColor = npcChar?.color ?? protagonistChar?.color

  return (
    <div className={boxClass}>
      {labelName && node.character && (
        <p className={styles.name} style={{ color: labelColor }}>
          {labelName}
        </p>
      )}
      <p className={`${styles.text} ${node.type === 'narration' ? styles.narration : ''}`}>
        {node.text}
      </p>
      <span className={styles.arrow}>▼</span>
    </div>
  )
}
