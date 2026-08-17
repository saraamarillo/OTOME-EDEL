import { useGameStore } from '../../store/gameStore'
import { NPC_CHARACTERS, PROTAGONISTS } from '../../constants/characters'
import { AFFINITY_MAX } from '../../constants/affinity'
import { ROUTE_THEME } from '../../constants/theme'
import RouteNav from '../../components/RouteNav/RouteNav'
import styles from './CharactersScreen.module.css'

export default function CharactersScreen() {
  const protagonistId  = useGameStore((s) => s.protagonistId)
  const affinitiesAll   = useGameStore((s) => s.affinities)
  const encounteredAll  = useGameStore((s) => s.encounteredNPCs)

  const affinities      = affinitiesAll[protagonistId] ?? {}
  const encounteredNPCs = encounteredAll[protagonistId] ?? []

  const theme = ROUTE_THEME[protagonistId] ?? ROUTE_THEME.ayla
  const isCamara = theme.mode === 'camara'

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

  const Card = isCamara ? CamaraCard : DiarioCard

  return (
    <div className={`${styles.screen} ${isCamara ? styles.screenCamara : styles.screenDiario}`}>
      <RouteNav active="characters" />

      <div className={`${styles.body} ${isCamara ? styles.bodyCamara : styles.bodyDiario}`}>
        <div className={styles.header}>
          <h2 className={isCamara ? styles.titleCamara : styles.titleDiario}>Personajes</h2>
          <span className={isCamara ? styles.hintCamara : styles.hintDiario}>
            Solo se muestran los personajes que ya han aparecido
          </span>
        </div>

        {metCharacters.length === 0 ? (
          <p className={isCamara ? styles.emptyCamara : styles.emptyDiario}>
            Todavía no has conocido a nadie en esta ruta.
          </p>
        ) : (
          <div className={styles.grid}>
            {metCharacters.map((ch, i) => <Card key={ch.id} ch={ch} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function CamaraCard({ ch }) {
  return (
    <div className={styles.cardCamara}>
      <div className={styles.cardCamaraPhoto}>
        <img src={ch.avatar} alt={ch.name} />
        <span className={`${styles.miniBracket} ${styles.miniBracketTl}`} />
        <span className={`${styles.miniBracket} ${styles.miniBracketBr}`} />
      </div>
      <div className={styles.cardCamaraBody}>
        <div className={styles.nameCamara}>{ch.name}</div>
        <div className={styles.roleCamara} style={{ color: ch.color }}>{ch.role}</div>
        <div className={styles.affinityRow}>
          <span className={styles.affinityLabelCamara}>Afinidad</span>
          <span className={styles.affinityPctCamara} style={{ color: ch.color }}>{ch.affinity}%</span>
        </div>
        <div className={styles.barTrackCamara}>
          <div className={styles.barFill} style={{ width: `${ch.affinity}%`, background: ch.color }} />
        </div>
      </div>
    </div>
  )
}

function DiarioCard({ ch, index }) {
  return (
    <div className={styles.cardDiario} style={{ transform: `rotate(${index % 2 === 0 ? -1.6 : 1.8}deg)` }}>
      <div className={styles.tapeSmall} />
      <div className={styles.cardDiarioPhoto}>
        <img src={ch.avatar} alt={ch.name} />
      </div>
      <div className={styles.nameDiario}>{ch.name}</div>
      <div className={styles.roleDiario} style={{ color: ch.color }}>{ch.role}</div>
      <div className={styles.affinityRow}>
        <span className={styles.affinityLabelDiario}>Afinidad</span>
        <span className={styles.affinityPctDiario} style={{ color: ch.color }}>{ch.affinity}%</span>
      </div>
      <div className={styles.barTrackDiario}>
        <div className={styles.barFill} style={{ width: `${ch.affinity}%`, background: ch.color }} />
      </div>
    </div>
  )
}
