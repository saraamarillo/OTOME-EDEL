import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import RouteNav from '../../components/RouteNav/RouteNav'
import styles from './LandingScreen.module.css'

const ROUTE_ICONS = {
  soledad: (
    <svg viewBox="0 0 120 120" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="60" cy="60" r="16" />
      <path d="M60 26v-14 M60 108v-14 M26 60h-14 M108 60h-14 M37 37l-10-10 M93 37l10-10 M37 83l-10 10 M93 83l10 10" />
    </svg>
  ),
  ayla: (
    <svg viewBox="0 0 120 100" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="30" width="92" height="58" rx="8" />
      <path d="M42 30l8-14h20l8 14" />
      <circle cx="60" cy="60" r="20" />
      <circle cx="92" cy="42" r="3" />
    </svg>
  ),
}

export default function LandingScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const protagonistId = useGameStore((s) => s.protagonistId)
  const [showCopyright, setShowCopyright] = useState(false)

  const protagonist = PROTAGONISTS.find((p) => p.id === protagonistId)
  if (!protagonist) return null

  return (
    <div className={styles.screen}>
      <RouteNav active="landing" showLinks={false} />

      <div className={styles.content}>
        <div className={styles.textCol}>
          <p className={styles.routeLabel}>RUTA · {protagonist.name}</p>
          <h1 className={styles.routeName}>{protagonist.name.split(' ')[0]}</h1>

          {ROUTE_ICONS[protagonist.id] && (
            <div className={styles.iconWrap} style={{ color: protagonist.color }}>
              {ROUTE_ICONS[protagonist.id]}
            </div>
          )}

          <p className={styles.bio} style={{ color: protagonist.color }}>{protagonist.landingBio ?? protagonist.description}</p>

          <div className={styles.actions}>
            <button className={styles.pill} style={{ background: protagonist.color }} onClick={() => setScreen('episodeList')}>Episodios</button>
            <button className={styles.pill} style={{ background: protagonist.color }} onClick={() => setScreen('characters')}>Personajes</button>
            <button className={styles.pill} style={{ background: protagonist.color }} onClick={() => setScreen('gallery')}>Galería</button>
            <button
              className={styles.heartBtn}
              style={{ color: protagonist.color }}
              onClick={() => setShowCopyright(true)}
              title="Créditos"
            >♥</button>
          </div>
        </div>

        <div className={styles.portraitWrap}>
          <img
            className={styles.portrait}
            src={`/assets/sprites/${protagonist.id}/arc1.png`}
            alt={protagonist.name}
            draggable={false}
          />
        </div>
      </div>

      {showCopyright && (
        <div className={styles.copyOverlay} onClick={() => setShowCopyright(false)}>
          <div className={styles.copyCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.copyHeart} style={{ color: protagonist.color }}>♥</div>
            <p className={styles.copyText}>
              Esta novela visual interactiva está inspirada en la campaña de rol «EDEL»<br />
              {protagonist.creator && <>Personaje creado por: {protagonist.creator}<br /></>}
              Diseño y adaptación interactiva por saramarillo<br />
              Historia original creada y dirigida por cadia.ink
            </p>
            <button className={styles.copyClose} onClick={() => setShowCopyright(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}
