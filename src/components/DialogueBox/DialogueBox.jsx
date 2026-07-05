import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import { useGameStore } from '../../store/gameStore'
import styles from './DialogueBox.module.css'

export default function DialogueBox({ node }) {
  const protagonistId = useGameStore((s) => s.protagonistId)

  if (!node || node.type === 'choice' || node.type === 'thought') return null

  const activeProtagonist = PROTAGONISTS.find((p) => p.id === protagonistId)
  const accent = activeProtagonist?.color ?? '#e38e1f'

  // Narración y voz propia de la protagonista (sin personaje) -> misma
  // barra inferior; la narración se distingue en cursiva y entre paréntesis
  const isNarration = node.type === 'narration'
  const isOwnVoice = node.type === 'dialogue' && !node.character

  if (isNarration || isOwnVoice) {
    return (
      <div className={styles.ownVoiceBox} style={{ '--accent': accent }}>
        <p className={`${styles.ownVoiceText} ${isNarration ? styles.narrationText : ''}`}>
          {isNarration ? `(${node.text})` : node.text}
        </p>
        <span className={styles.ownVoiceArrow}>▼</span>
      </div>
    )
  }

  const npcChar = NPC_CHARACTERS.find((c) => c.id === node.character)
  const protagonistChar = PROTAGONISTS.find((p) => p.id === node.character)

  // Name label: NPC name, or protagonist first name for cross-route appearances
  const labelName = npcChar?.name ?? (protagonistChar ? protagonistChar.name.split(' ')[0] : null)
  const labelColor = npcChar?.color ?? protagonistChar?.color

  return (
    <div className={styles.box} style={{ borderTopColor: labelColor || 'rgba(200,150,180,0.55)' }}>
      {labelName && (
        <p className={styles.name} style={{ color: labelColor }}>
          {labelName}
        </p>
      )}
      <p className={styles.text}>{node.text}</p>
      <span className={styles.arrow}>▼</span>
    </div>
  )
}
