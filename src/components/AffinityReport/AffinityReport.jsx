import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import { AFFINITY_MAX } from '../../constants/affinity'
import styles from './AffinityReport.module.css'

/** Enmascara el nombre: "Et**" si no han sido conocidos */
function maskName(name) {
  return name.slice(0, 2) + '**'
}

/**
 * Overlay de afinidades al final del episodio.
 * - NPCs conocidos: nombre y rol reales + barra de afinidad
 * - NPCs no conocidos: nombre enmascarado + "??"
 * - Incluye la compañera protagonista (Ayla en ruta Soledad y viceversa)
 */
export default function AffinityReport({ onClose }) {
  const affinities      = useGameStore((s) => s.affinities)
  const encounteredNPCs = useGameStore((s) => s.encounteredNPCs)
  const protagonistId   = useGameStore((s) => s.protagonistId)

  // Compañera protagonista (aparece como NPC en la ruta contraria)
  const companion = protagonistId === 'soledad'
    ? PROTAGONISTS.find((p) => p.id === 'ayla')
    : protagonistId === 'ayla'
    ? PROTAGONISTS.find((p) => p.id === 'soledad')
    : null

  // Lista de NPCs del reparto + compañera al inicio
  const companionEntry = companion
    ? [{
        id: companion.id,
        name: companion.name,
        role: 'Compañera',
        color: companion.color,
        isCompanion: true,
      }]
    : []

  const allEntries = [
    ...companionEntry,
    ...NPC_CHARACTERS.map((npc) => ({ ...npc, isCompanion: false })),
  ].map((entry) => {
    const value = affinities[entry.id] ?? 0
    const pct   = Math.round((value / AFFINITY_MAX) * 100)
    const met   = entry.isCompanion || encounteredNPCs.includes(entry.id)
    return { ...entry, value, pct, met }
  }).sort((a, b) => {
    // Compañera siempre primera, luego por afinidad descendente, no conocidos al final
    if (a.isCompanion) return -1
    if (b.isCompanion) return 1
    if (a.met !== b.met) return a.met ? -1 : 1
    return b.value - a.value
  })

  const protagonistLabel = protagonistId === 'soledad'
    ? 'Camino de Soledad'
    : protagonistId === 'ayla'
    ? 'Camino de Ayla'
    : 'Camino de Maven'

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>

        {/* Cabecera */}
        <div className={styles.header}>
          <div>
            <p className={styles.route}>{protagonistLabel}</p>
            <h2 className={styles.title}>Vínculos</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.list}>
          {allEntries.map((entry) => {
            const active      = entry.value > 0
            const displayName = entry.met ? entry.name : maskName(entry.name)
            const displayRole = entry.met ? entry.role : '??'

            return (
              <div
                key={entry.id}
                className={`${styles.row} ${active ? styles.active : ''} ${!entry.met ? styles.unknown : ''}`}
              >
                {/* Inicial */}
                <div
                  className={styles.avatar}
                  style={{
                    background:  entry.met && active ? entry.color + '22' : 'rgba(255,255,255,0.04)',
                    borderColor: entry.met && active ? entry.color       : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <span style={{ color: entry.met && active ? entry.color : 'rgba(255,255,255,0.2)' }}>
                    {entry.met ? entry.name.charAt(0) : '?'}
                  </span>
                </div>

                {/* Nombre + rol + barra */}
                <div className={styles.info}>
                  <div className={styles.nameRow}>
                    <span
                      className={styles.npcName}
                      style={{ color: entry.met && active ? entry.color : entry.met ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)' }}
                    >
                      {displayName}
                    </span>
                    <span className={styles.role}>{displayRole}</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: active ? `${entry.pct}%` : '0%',
                        background: entry.met && active
                          ? `linear-gradient(to right, ${entry.color}88, ${entry.color})`
                          : 'rgba(255,255,255,0.06)',
                      }}
                    />
                  </div>
                </div>

                {/* Porcentaje */}
                <span
                  className={styles.pct}
                  style={{ color: entry.met && active ? entry.color : 'rgba(255,255,255,0.18)' }}
                >
                  {entry.met && entry.pct > 0 ? `${entry.pct}%` : '—'}
                </span>
              </div>
            )
          })}
        </div>

        <p className={styles.note}>
          ♥ Las afinidades se acumulan entre episodios · Los vínculos no conocidos se revelarán más adelante
        </p>
      </div>
    </div>
  )
}
