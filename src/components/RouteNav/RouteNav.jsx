import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import { ROUTE_THEME } from '../../constants/theme'
import styles from './RouteNav.module.css'

const NAV_LINKS = [
  { id: 'episodeList', label: 'Episodios' },
  { id: 'characters',  label: 'Personajes' },
  { id: 'gallery',     label: 'Galería' },
]

/**
 * Cabecera + navegación de Landing/Episodios/Personajes/Galería.
 * El estilo cambia según la ruta: Ayla es una cámara de fotos (visor
 * oscuro, HUD en monoespaciada), Soledad es un diario escrito a mano
 * (papel rayado, tipografía manuscrita).
 */
export default function RouteNav({ active }) {
  const setScreen = useGameStore((s) => s.setScreen)
  const protagonistId = useGameStore((s) => s.protagonistId)
  const protagonist = PROTAGONISTS.find((p) => p.id === protagonistId)
  const theme = ROUTE_THEME[protagonistId] ?? ROUTE_THEME.ayla
  const isCamara = theme.mode === 'camara'
  const [showCredits, setShowCredits] = useState(false)

  const goTo = (id) => setScreen(id)

  return (
    <>
      {isCamara ? (
        <CamaraNav active={active} protagonist={protagonist} goTo={goTo} onHeart={() => setShowCredits(true)} />
      ) : (
        <DiarioNav active={active} protagonist={protagonist} goTo={goTo} onHeart={() => setShowCredits(true)} />
      )}

      {showCredits && (
        <div className={styles.creditsOverlay} onClick={() => setShowCredits(false)}>
          <div
            className={`${styles.creditsCard} ${isCamara ? styles.creditsCardCamara : styles.creditsCardDiario}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.creditsHeart}>♥</div>
            <p className={styles.creditsText}>
              Esta novela visual interactiva está inspirada en la campaña de rol «EDEL»<br />
              {protagonist?.creator && <>Personaje creado por: {protagonist.creator}<br /></>}
              Diseño y adaptación interactiva por saramarillo<br />
              Historia original creada y dirigida por cadia.ink
            </p>
            <button className={styles.creditsClose} onClick={() => setShowCredits(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  )
}

function CamaraNav({ active, protagonist, goTo, onHeart }) {
  const shortName = (protagonist?.name.split(' ')[0] ?? '').toUpperCase()

  return (
    <div className={styles.camaraChrome}>
      <div className={styles.gridV} style={{ left: '33.33%' }} />
      <div className={styles.gridV} style={{ left: '66.66%' }} />
      <div className={styles.gridH} style={{ top: '33.33%' }} />
      <div className={styles.gridH} style={{ top: '66.66%' }} />

      <button className={styles.hudLeft} onClick={() => goTo('landing')}>
        <span className={styles.recDot} />REC · {shortName}_01
      </button>
      <button className={styles.changeBtnCamara} onClick={() => goTo('protagonistSelect')}>
        Cambiar protagonista
      </button>

      <div className={styles.hudRight}><span>f/2.8</span><span>1/250</span><span>ISO 400</span></div>
      <button className={styles.heartBtnCamara} onClick={onHeart} title="Créditos">♥</button>

      <div className={styles.dialNav}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            className={`${styles.dialItem} ${active === link.id ? styles.dialActive : ''}`}
            onClick={() => goTo(link.id)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function DiarioNav({ active, protagonist, goTo, onHeart }) {
  return (
    <div className={styles.diarioChrome}>
      <div className={styles.ruled} />
      <div className={styles.marginLine} />

      <button className={styles.logoDiario} onClick={() => goTo('landing')}>EDEL — mi diario</button>
      <button className={styles.changeBtnDiario} onClick={() => goTo('protagonistSelect')}>
        cambiar de protagonista
      </button>

      <button className={styles.heartBtnDiario} onClick={onHeart} title="Créditos">♥</button>

      <div className={styles.tabsDiario}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            className={`${styles.tabDiario} ${active === link.id ? styles.tabActive : ''}`}
            onClick={() => goTo(link.id)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  )
}
