import { useGameStore } from '../../store/gameStore'
import styles from './RouteNav.module.css'

/**
 * Barra de navegación compartida entre Landing, Episodios, Personajes y Galería.
 */
export default function RouteNav({ active, showLinks = true }) {
  const setScreen = useGameStore((s) => s.setScreen)

  const links = [
    { id: 'episodeList', label: 'Episodios' },
    { id: 'characters',  label: 'Personajes' },
    { id: 'gallery',     label: 'Galería' },
  ]

  return (
    <div className={styles.nav}>
      <span className={styles.logo}>EDEL</span>
      {showLinks && (
        <div className={styles.links}>
          {links.map((link) => (
            <button
              key={link.id}
              className={`${styles.link} ${active === link.id ? styles.active : ''}`}
              onClick={() => setScreen(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
