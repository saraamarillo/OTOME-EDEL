import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import { AVAILABLE_EPISODES, TOTAL_EPISODES, EPISODES, EPISODE_COVERS, getFirstScene, getSynopsis } from '../../constants/episodes'
import { ROUTE_THEME } from '../../constants/theme'
import RouteNav from '../../components/RouteNav/RouteNav'
import styles from './EpisodeListScreen.module.css'

export default function EpisodeListScreen() {
  const setScreen           = useGameStore((s) => s.setScreen)
  const setScene            = useGameStore((s) => s.setScene)
  const setSelectedEpisode  = useGameStore((s) => s.setSelectedEpisode)
  const selectProtagonist   = useGameStore((s) => s.selectProtagonist)
  const resetRouteAffinity  = useGameStore((s) => s.resetRouteAffinity)
  const protagonistId       = useGameStore((s) => s.protagonistId)
  const protagonist         = PROTAGONISTS.find((p) => p.id === protagonistId)
  const theme                = ROUTE_THEME[protagonistId] ?? ROUTE_THEME.ayla
  const completedAll        = useGameStore((s) => s.completedEpisodes)
  const playCountsAll       = useGameStore((s) => s.episodePlayCounts)
  const logout              = useGameStore((s) => s.logout)
  const userName            = useGameStore((s) => s.userName)

  const completed   = completedAll[protagonistId] ?? []
  const playCounts  = playCountsAll[protagonistId] ?? {}

  const pendingList     = AVAILABLE_EPISODES.filter((ep) => !completed.includes(ep))
  const completedList   = AVAILABLE_EPISODES.filter((ep) => completed.includes(ep))
  const noMoreEpisodes  = pendingList.length === 0 && AVAILABLE_EPISODES.length < TOTAL_EPISODES

  function handlePlay(ep) {
    if (completed.includes(ep)) {
      resetRouteAffinity()
    }
    setSelectedEpisode(ep)
    setScene(getFirstScene(ep, protagonistId))
    setScreen('game')
  }

  function renderCamaraCard(ep, { completed: isCompleted }) {
    const meta = EPISODES[ep]
    const timesPlayed = playCounts[ep] ?? 0
    return (
      <div key={ep} className={styles.epRow}>
        <div className={styles.epImageCard}>
          <div className={styles.epImageTape} />
          <img src={EPISODE_COVERS[protagonistId]?.[ep] ?? EPISODE_COVERS.default[ep]} alt="" className={styles.epImage} />
        </div>
        <div className={styles.epInfo}>
          <div className={styles.epHeading}>
            <span className={styles.epNumber}>Episodio {ep}</span> · {meta?.title}
          </div>
          <p className={styles.epSynopsis}>{getSynopsis(ep, protagonistId)}</p>
          <div className={styles.epProgressRow}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: isCompleted ? '100%' : '0%' }} />
            </div>
            <span className={styles.progressPct}>{isCompleted ? '100 %' : '0 %'}</span>
          </div>
          <div className={styles.epFooter}>
            <button
              className={`${styles.playBtn} ${isCompleted ? styles.replayBtn : ''}`}
              onClick={() => handlePlay(ep)}
            >
              {isCompleted ? 'Volver a jugar el episodio' : 'Comenzar episodio'}
            </button>
            {isCompleted && (
              <span className={styles.playCount}>
                Episodio jugado <b>{timesPlayed} {timesPlayed === 1 ? 'vez' : 'veces'}</b>
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  function renderDiarioCard(ep, { completed: isCompleted }) {
    const meta = EPISODES[ep]
    const timesPlayed = playCounts[ep] ?? 0
    return (
      <div key={ep} className={styles.diarioCard}>
        <div className={styles.diarioTape} />
        <div className={styles.diarioPhoto}>
          <img src={EPISODE_COVERS[protagonistId]?.[ep] ?? EPISODE_COVERS.default[ep]} alt="" />
        </div>
        <div className={styles.diarioHeading}>
          <span className={styles.diarioNumber}>Episodio {ep}</span> · {meta?.title}
        </div>
        <p className={styles.diarioSynopsis}>{getSynopsis(ep, protagonistId)}</p>
        <div className={styles.epProgressRow}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: isCompleted ? '100%' : '0%' }} />
          </div>
          <span className={styles.progressPct}>{isCompleted ? '100 %' : '0 %'}</span>
        </div>
        <button className={styles.diarioPlayBtn} onClick={() => handlePlay(ep)}>
          {isCompleted ? 'Volver a jugar el episodio' : 'Comenzar episodio'}
        </button>
        {isCompleted && (
          <span className={styles.diarioPlayCount}>
            Jugado {timesPlayed} {timesPlayed === 1 ? 'vez' : 'veces'}
          </span>
        )}
      </div>
    )
  }

  const isDiario = theme.mode === 'diario'
  const renderEpisode = isDiario ? renderDiarioCard : renderCamaraCard

  return (
    <div className={styles.screen} data-theme={theme.mode} style={{ background: theme.bg, '--accent': theme.accent }}>
      <RouteNav active="episodeList" />

      <div className={`${styles.body} ${theme.mode === 'camara' ? styles.bodyCamara : styles.bodyDiario}`}>
        <div className={styles.topRow}>
          <div className={styles.tabs}>
            {PROTAGONISTS.map((p) => (
              <button
                key={p.id}
                className={`${styles.tab} ${p.id === protagonistId ? styles.tabActive : ''}`}
                disabled={!p.available}
                onClick={() => selectProtagonist(p.id)}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className={styles.userRow}>
            <span className={styles.userName}>♥ {userName}</span>
            <button className={styles.logoutBtn} onClick={logout}>Salir</button>
          </div>
        </div>

        {pendingList.length > 0 && (
          <>
            <div className={styles.sectionLabel}>Episodios disponibles</div>
            {isDiario ? (
              <div className={styles.grid}>
                {pendingList.map((ep) => renderEpisode(ep, { completed: false }))}
              </div>
            ) : (
              pendingList.map((ep) => renderEpisode(ep, { completed: false }))
            )}
          </>
        )}

        {noMoreEpisodes && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>♥</div>
            <h2 className={styles.emptyTitle}>No hay más episodios disponibles por ahora</h2>
            <p className={styles.emptyText}>Vuelve pronto para continuar la historia.</p>
          </div>
        )}

        {completedList.length > 0 && (
          <>
            <div className={styles.sectionLabel} style={{ marginTop: 34 }}>Episodios terminados</div>
            {isDiario ? (
              <div className={styles.grid}>
                {completedList.map((ep) => renderEpisode(ep, { completed: true }))}
              </div>
            ) : (
              completedList.map((ep) => renderEpisode(ep, { completed: true }))
            )}
          </>
        )}
      </div>
    </div>
  )
}
