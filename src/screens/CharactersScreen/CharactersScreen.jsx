import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import { AFFINITY_MAX } from '../../constants/affinity'
import { ROUTE_BG } from '../../constants/theme'
import RouteNav from '../../components/RouteNav/RouteNav'
import styles from './CharactersScreen.module.css'

export default function CharactersScreen() {
  const protagonistId  = useGameStore((s) => s.protagonistId)
  const affinitiesAll   = useGameStore((s) => s.affinities)
  const encounteredAll  = useGameStore((s) => s.encounteredNPCs)

  const affinities      = affinitiesAll[protagonistId] ?? {}
  const encounteredNPCs = encounteredAll[protagonistId] ?? []

  // La compañera protagonista aparece como personaje conocido en la ruta contraria
  const companion = protagonistId === 'soledad'
    ? PROTAGONISTS.find((p) => p.id === 'ayla')
    : protagonistId === 'ayla'
    ? PROTAGONISTS.find((p) => p.id === 'soledad')
    : null

  const visibleNPCs = NPC_CHARACTERS.filter(
    (npc) => !npc.protagonistOnly || npc.protagonistOnly === protagonistId
  )

  const companionEntry = companion
    ? [{ id: companion.id, name: companion.name, role: 'Compañera', avatar: companion.avatar, color: companion.color }]
    : []

  const metCharacters = [...companionEntry, ...visibleNPCs]
    .filter((entry) => companionEntry.includes(entry) || encounteredNPCs.includes(entry.id))
    .map((entry) => {
      const value = affinities[entry.id] ?? 0
      return { ...entry, affinity: Math.round((value / AFFINITY_MAX) * 100) }
    })

  return (
    <div className={styles.screen} style={{ background: ROUTE_BG[protagonistId] }}>
      <RouteNav active="characters" />

      <div className={styles.body}>
        <div className={styles.header}>
          <h2 className={styles.title}>Personajes</h2>
          <span className={styles.hint}>Solo se muestran los personajes que ya han aparecido</span>
        </div>

        {metCharacters.length === 0 ? (
          <p className={styles.empty}>Todavía no has conocido a nadie en esta ruta.</p>
        ) : (
          <div className={styles.grid}>
            {metCharacters.map((ch) => (
              <div key={ch.id} className={styles.card} style={{ borderTopColor: ch.color }}>
                <div className={styles.cardHead}>
                  <div className={styles.avatarClip}>
                    <img src={ch.avatar} alt={ch.name} />
                  </div>
                  <div>
                    <div className={styles.name}>{ch.name}</div>
                    <div className={styles.role} style={{ color: ch.color }}>{ch.role}</div>
                  </div>
                </div>
                <div className={styles.affinityRow}>
                  <span className={styles.affinityLabel}>Afinidad</span>
                  <span className={styles.affinityPct} style={{ color: ch.color }}>{ch.affinity}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${ch.affinity}%`, background: ch.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
