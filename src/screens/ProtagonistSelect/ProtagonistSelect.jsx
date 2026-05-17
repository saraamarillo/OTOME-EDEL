import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import styles from './ProtagonistSelect.module.css'

/** Créditos de autora por personaje (solo protagonistas disponibles) */
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

      {/* Créditos de personajes disponibles */}
      <div className={styles.characterCredits}>
        <p className={styles.creditsNote}>
          Personajes originales pertenecientes a sus respectivas creadoras
          dentro de la campaña de rol «EDEL».
        </p>
        <div className={styles.creditsList}>
          {PROTAGONISTS.filter((p) => p.available && CREATOR_CREDITS[p.id]).map((p) => {
            const cr = CREATOR_CREDITS[p.id]
            return (
              <span key={p.id} className={styles.creditItem}>
                <span style={{ color: p.color }}>{p.name}</span>
                {' — '}
                <a
                  href={cr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {cr.label}
                </a>
              </span>
            )
          })}
        </div>
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
