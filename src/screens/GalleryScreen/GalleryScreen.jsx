import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import { EPISODES, getFirstScene } from '../../constants/episodes'
import { GALLERY_IMAGES as ALL_IMAGES } from '../../constants/galleryImages'
import { ROUTE_THEME } from '../../constants/theme'
import RouteNav from '../../components/RouteNav/RouteNav'
import styles from './GalleryScreen.module.css'

export default function GalleryScreen() {
  const setScreen          = useGameStore((s) => s.setScreen)
  const setScene           = useGameStore((s) => s.setScene)
  const setSelectedEpisode = useGameStore((s) => s.setSelectedEpisode)
  const selectProtagonist  = useGameStore((s) => s.selectProtagonist)
  const unlockedAll        = useGameStore((s) => s.unlockedImages)
  const playCountsAll      = useGameStore((s) => s.episodePlayCounts)
  const protagonistId      = useGameStore((s) => s.protagonistId)
  const protagonist        = PROTAGONISTS.find((p) => p.id === protagonistId)
  const theme               = ROUTE_THEME[protagonistId] ?? ROUTE_THEME.ayla
  const [viewing, setViewing] = useState(null)
  const [showLocked, setShowLocked] = useState(false)

  const unlockedImages = unlockedAll[protagonistId] ?? []
  const playCounts     = playCountsAll[protagonistId] ?? {}

  const items = ALL_IMAGES.filter((img) => img.routes.includes(protagonistId))

  function handlePlayEpisode(ep) {
    setSelectedEpisode(ep)
    setScene(getFirstScene(ep, protagonistId))
    setScreen('game')
  }

  function renderEpisodeSection(ep) {
    const epItems = items.filter((i) => i.episode === ep)
    const meta = EPISODES[ep]
    const marginTop = ep === Number(Object.keys(EPISODES)[0]) ? 0 : 40

    if (epItems.length === 0) {
      return (
        <div key={ep}>
          <div className={styles.epHeader} style={{ marginTop }}>
            <span className={styles.epBadge}>Episodio {ep} · {meta.title}</span>
            <span className={styles.epCount}>0 / 2</span>
          </div>
          <div className={styles.lockedRow}>
            {[0, 1].map((i) => (
              <div key={i} className={styles.lockedCard}>
                <span className={styles.lockedHeart} style={{ top: 16, left: 18 }}>♥</span>
                <span className={styles.lockedHeart} style={{ bottom: 18, right: 20 }}>♥</span>
                <span className={styles.lockedIcon}>🔒</span>
              </div>
            ))}
          </div>
          <div className={styles.epFooter}>
            <button className={styles.replayBtnDisabled} disabled>Volver a jugar el episodio</button>
            <div className={styles.playCount}>
              Episodio jugado <b>{playCounts[ep] ?? 0} veces</b>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key={ep}>
        <div className={styles.epHeader} style={{ marginTop }}>
          <span className={styles.epBadge}>Episodio {ep} · {meta.title}</span>
          <span className={styles.epCount}>
            {unlockedImages.filter((id) => epItems.some((i) => i.id === id)).length} / {epItems.length}
          </span>
        </div>

        <div className={styles.grid}>
          {epItems.map((item) => {
            const unlocked = unlockedImages.includes(item.id)
            return (
              <button
                key={item.id}
                className={`${styles.card} ${unlocked ? styles.unlocked : styles.locked}`}
                onClick={() => (unlocked ? setViewing(item.id) : setShowLocked(true))}
              >
                {unlocked ? (
                  <img src={`/assets/gallery/${item.id}.png`} alt={item.title} className={styles.thumb} />
                ) : (
                  <div className={styles.placeholder}>
                    <span className={styles.lock}>?</span>
                  </div>
                )}
                <p className={styles.cardTitle}>{item.title}</p>
                <p className={styles.cardSub}>{unlocked ? item.subtitle : 'No conseguida'}</p>
              </button>
            )
          })}
        </div>

        <div className={styles.epFooter}>
          <button className={styles.replayBtn} onClick={() => handlePlayEpisode(ep)}>
            Volver a jugar el episodio
          </button>
          <div className={styles.playCount}>
            Episodio jugado <b>{playCounts[ep] ?? 0} {(playCounts[ep] ?? 0) === 1 ? 'vez' : 'veces'}</b>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.screen} data-theme={theme.mode} style={{ background: theme.bg, '--accent': theme.accent }}>
      <RouteNav active="gallery" />

      <div className={`${styles.body} ${theme.mode === 'camara' ? styles.bodyCamara : styles.bodyDiario}`}>
        <div className={styles.topRow}>
          <h2 className={styles.title}>Mis recuerdos</h2>
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
        </div>

        {Object.keys(EPISODES).map(Number).map(renderEpisodeSection)}
      </div>

      {viewing && (
        <div className={styles.lightbox} onClick={() => setViewing(null)}>
          <img src={`/assets/gallery/${viewing}.png`} alt={viewing} className={styles.lightboxImg} />
          <p className={styles.lightboxHint}>Toca para cerrar</p>
        </div>
      )}

      {showLocked && (
        <div className={styles.lockedOverlay} onClick={() => setShowLocked(false)}>
          <div className={styles.lockedModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lockedModalIcon}>🔒</div>
            <div className={styles.lockedModalTitle}>Imagen no conseguida</div>
            <div className={styles.lockedModalText}>No tomaste el camino correcto para desbloquear este recuerdo.</div>
            <button className={styles.lockedModalBtn} onClick={() => setShowLocked(false)}>Continuar</button>
          </div>
        </div>
      )}
    </div>
  )
}
