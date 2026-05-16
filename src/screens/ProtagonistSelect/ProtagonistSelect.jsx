import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import styles from './ProtagonistSelect.module.css'

/**
 * Pantalla de selección de protagonista.
 * Muestra las protagonistas disponibles y permite elegir una.
 */
export default function ProtagonistSelect() {
  const [selected, setSelected] = useState(null)
  const selectProtagonist = useGameStore((s) => s.selectProtagonist)
  const setScreen = useGameStore((s) => s.setScreen)
  const setScene = useGameStore((s) => s.setScene)

  const FIRST_SCENE = {
    soledad: 'sol_scene_01_campus',
    ayla: 'ayla_scene_01_campus',
    maven: 'scene_01_campus',
  }

  function handleConfirm() {
    if (!selected) return
    selectProtagonist(selected.id)
    setScene(FIRST_SCENE[selected.id] ?? 'scene_01_campus')
    setScreen('game')
  }

  return (
    <div className={styles.screen}>
      <h2 className={styles.heading}>¿Quién eres?</h2>

      <div className={styles.cards}>
        {PROTAGONISTS.map((p) => (
          <button
            key={p.id}
            className={`${styles.card} ${selected?.id === p.id ? styles.active : ''} ${!p.available ? styles.locked : ''}`}
            onClick={() => p.available && setSelected(p)}
            disabled={!p.available}
          >
            <div
              className={styles.portrait}
              style={{ borderColor: p.color }}
            >
              {p.avatar
                ? <img src={p.avatar} alt={p.name} className={styles.portraitImg} />
                : <div className={styles.portraitFallback} style={{ background: p.color + '22' }} />
              }
            </div>
            <p className={styles.name} style={{ color: p.color }}>{p.name}</p>
            <p className={styles.desc}>{p.description}</p>
            {!p.available && <span className={styles.soon}>Próximamente</span>}
          </button>
        ))}
      </div>

      <button
        className={styles.confirmBtn}
        disabled={!selected}
        onClick={handleConfirm}
      >
        Continuar
      </button>
    </div>
  )
}
