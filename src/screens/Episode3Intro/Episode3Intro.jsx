import { useGameStore } from '../../store/gameStore'
import { PROTAGONISTS } from '../../constants/characters'
import { ROUTE_THEME } from '../../constants/theme'
import { EPISODES, EPISODE_COVERS, getFirstScene, getSynopsis } from '../../constants/episodes'
import styles from './Episode3Intro.module.css'

/**
 * Portada del episodio 3, a modo de pequeña "cabecera" por ruta (como la
 * pantalla de título de EDEL) con un botón Comenzar en el mismo estilo que
 * el de confirmar protagonista. Se llega aquí desde el pop-up de la
 * pantalla de elegir personaje.
 */
export default function Episode3Intro() {
  const protagonistId = useGameStore((s) => s.protagonistId)
  const setScreen = useGameStore((s) => s.setScreen)
  const setScene = useGameStore((s) => s.setScene)
  const resetRouteAffinity = useGameStore((s) => s.resetRouteAffinity)
  const completedAll = useGameStore((s) => s.completedEpisodes)

  const protagonist = PROTAGONISTS.find((p) => p.id === protagonistId)
  const theme = ROUTE_THEME[protagonistId] ?? ROUTE_THEME.ayla
  const cover = EPISODE_COVERS[protagonistId]?.[3] ?? EPISODE_COVERS.default[3]
  const completed = completedAll[protagonistId] ?? []

  function handleStart() {
    if (completed.includes(3)) resetRouteAffinity()
    setScene(getFirstScene(3, protagonistId))
    setScreen('game')
  }

  return (
    <div className={styles.screen} data-theme={theme.mode}>
      <img src={cover} alt="" className={styles.coverImg} />
      <div className={styles.scrim} />

      <button className={styles.backBtn} onClick={() => setScreen('protagonistSelect')}>← Volver</button>

      <div className={styles.content}>
        <p className={styles.wordmark}>EDEL</p>
        <p className={styles.epLabel}>Episodio 3 · {protagonist?.name.split(' ')[0]}</p>
        <h1 className={styles.title}>{EPISODES[3]?.title}</h1>
        <p className={styles.synopsis}>{getSynopsis(3, protagonistId)}</p>

        <button className={styles.startBtn} onClick={handleStart}>Comenzar</button>
      </div>
    </div>
  )
}
