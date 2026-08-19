import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import Episode3Popup from '../../components/Episode3Popup/Episode3Popup'
import styles from './ProtagonistSelect.module.css'

/** Créditos de autora por personaje */
const CREATOR_CREDITS = {
  soledad: {
    label: 'saramarillo',
    url: 'https://www.instagram.com/saramarillo',
  },
  ayla: {
    label: 'isaweakness',
    url: 'https://www.instagram.com/isaweakness',
  },
}

/**
 * Pantalla de selección de protagonista — minimalista: solo las dos
 * protagonistas disponibles, sin decoración de sobra.
 */
export default function ProtagonistSelect() {
  const [selected, setSelected] = useState(null)
  const [showEp3Popup, setShowEp3Popup] = useState(true)
  const selectProtagonist  = useGameStore((s) => s.selectProtagonist)
  const setScreen          = useGameStore((s) => s.setScreen)

  function handleConfirm() {
    if (!selected) return
    selectProtagonist(selected.id)
    setScreen('landing')
  }

  return (
    <div className={styles.screen}>
      <button className={styles.backBtn} onClick={() => setScreen('login')}>← Salir</button>

      <h2 className={styles.heading}>¿Quién eres?</h2>

      <div className={styles.cards}>
        {PROTAGONISTS.map((p) => (
          <button
            key={p.id}
            className={`${styles.card} ${selected?.id === p.id ? styles.active : ''}`}
            onClick={() => setSelected(p)}
            style={{ '--tint': p.color }}
          >
            <div className={styles.portrait}>
              <img src={p.avatar} alt={p.name} className={styles.portraitImg} />
            </div>
            <p className={styles.name} style={{ color: p.color }}>{p.name}</p>
            <p className={styles.desc}>{p.description}</p>
          </button>
        ))}
      </div>

      <div className={styles.credits}>
        {PROTAGONISTS.filter((p) => CREATOR_CREDITS[p.id]).map((p) => {
          const cr = CREATOR_CREDITS[p.id]
          return (
            <span key={p.id} className={styles.creditItem}>
              {p.name.split(' ')[0]} — <a href={cr.url} target="_blank" rel="noopener noreferrer" className={styles.link}>{cr.label}</a>
            </span>
          )
        })}
      </div>

      <button className={styles.confirmBtn} disabled={!selected} onClick={handleConfirm}>
        Continuar
      </button>

      {showEp3Popup && <Episode3Popup onClose={() => setShowEp3Popup(false)} />}
    </div>
  )
}
