import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import { ROUTE_THEME } from '../../constants/theme'
import RouteNav from '../../components/RouteNav/RouteNav'
import { useProtagonistFace } from '../../hooks/useProtagonistFace'
import styles from './LandingScreen.module.css'

export default function LandingScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const protagonistId = useGameStore((s) => s.protagonistId)

  const protagonist = PROTAGONISTS.find((p) => p.id === protagonistId)
  const face = useProtagonistFace(protagonistId, 'neutral', protagonist?.avatar)
  if (!protagonist) return null

  const theme = ROUTE_THEME[protagonistId] ?? ROUTE_THEME.ayla
  const isCamara = theme.mode === 'camara'

  return (
    <div className={`${styles.screen} ${isCamara ? styles.screenCamara : styles.screenDiario}`}>
      <RouteNav active="landing" />

      {isCamara ? (
        <CamaraHero protagonist={protagonist} face={face} setScreen={setScreen} />
      ) : (
        <DiarioHero protagonist={protagonist} face={face} setScreen={setScreen} />
      )}
    </div>
  )
}

function CamaraHero({ protagonist, face, setScreen }) {
  return (
    <div className={styles.contentCamara}>
      <div className={styles.viewfinder}>
        <img
          className={styles.viewfinderImg}
          src={face.src}
          alt={protagonist.name}
          draggable={false}
          onError={face.onError}
        />
        <div className={styles.tint} />
        <div className={`${styles.bracket} ${styles.bracketTl}`} />
        <div className={`${styles.bracket} ${styles.bracketTr}`} />
        <div className={`${styles.bracket} ${styles.bracketBl}`} />
        <div className={`${styles.bracket} ${styles.bracketBr}`} />
        <div className={styles.reticle} />
      </div>

      <div className={styles.textColCamara}>
        <div className={styles.pillCamara}>Ruta · {protagonist.name}</div>
        <h1 className={styles.h1Camara}>{protagonist.name.split(' ')[0]}</h1>
        <p className={styles.quoteCamara}>{protagonist.landingBio ?? protagonist.description}</p>
        <button className={styles.ctaCamara} onClick={() => setScreen('episodeList')}>
          <span className={styles.shutter}><span className={styles.shutterDot} /></span>
          <span className={styles.ctaLabelCamara}>Comenzar</span>
        </button>
      </div>
    </div>
  )
}

function DiarioHero({ protagonist, face, setScreen }) {
  return (
    <div className={styles.contentDiario}>
      <svg viewBox="0 0 120 120" className={styles.doodleLeaf} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20 90 Q40 40 70 55 Q95 66 80 30" />
        <path d="M78 26 l6 10 l-13 2" />
      </svg>
      <div className={styles.doodleHeart}>♥</div>

      <div className={styles.textColDiario}>
        <div className={styles.pillDiario}>Ruta · {protagonist.name}</div>
        <h1 className={styles.h1Diario}>{protagonist.name.split(' ')[0]}</h1>
        <p className={styles.quoteDiario}>{protagonist.landingBio ?? protagonist.description}</p>
        <button className={styles.ctaDiario} onClick={() => setScreen('episodeList')}>
          Comenzar
          <svg viewBox="0 0 40 16" className={styles.ctaArrow} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 8h34M28 2l8 6-8 6" />
          </svg>
        </button>
      </div>

      <div className={styles.photoWrap}>
        <div className={styles.photoCard}>
          <img
            className={styles.photoImg}
            src={face.src}
            alt={protagonist.name}
            draggable={false}
            onError={face.onError}
          />
          <div className={styles.caption}>{protagonist.age ? `verano, ${protagonist.age}` : protagonist.name}</div>
        </div>
        <div className={`${styles.tape} ${styles.tapeA}`} />
        <div className={`${styles.tape} ${styles.tapeB}`} />
      </div>
    </div>
  )
}
