import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import styles from './GalleryScreen.module.css'

const ALL_IMAGES = [
  {
    id: 'ethan_cafeteria',
    title: 'La cafetería',
    subtitle: 'con Ethan',
    routes: ['soledad', 'ayla'],
  },
  {
    id: 'ryan_crucigrama',
    title: 'El crucigrama',
    subtitle: 'con Ryan',
    routes: ['soledad'],
  },
  {
    id: 'lydia_plantas',
    title: 'Las plantas',
    subtitle: 'con Lydia',
    routes: ['ayla'],
  },
]

export default function GalleryScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const unlockedImages = useGameStore((s) => s.unlockedImages)
  const protagonistId = useGameStore((s) => s.protagonistId)
  const [viewing, setViewing] = useState(null)

  const items = ALL_IMAGES.filter((img) => img.routes.includes(protagonistId))

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h2 className={styles.title}>Galería — Episodio 1</h2>
        <p className={styles.count}>
          {unlockedImages.filter((id) => items.some((i) => i.id === id)).length} / {items.length}
        </p>
      </div>

      <div className={styles.grid}>
        {items.map((item) => {
          const unlocked = unlockedImages.includes(item.id)
          return (
            <button
              key={item.id}
              className={`${styles.card} ${unlocked ? styles.unlocked : styles.locked}`}
              onClick={() => unlocked && setViewing(item.id)}
              disabled={!unlocked}
            >
              {unlocked ? (
                <img
                  src={`/assets/gallery/${item.id}.png`}
                  alt={item.title}
                  className={styles.thumb}
                />
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

      <button className={styles.back} onClick={() => setScreen('episodeEnd')}>
        Volver
      </button>

      {viewing && (
        <div className={styles.lightbox} onClick={() => setViewing(null)}>
          <img
            src={`/assets/gallery/${viewing}.png`}
            alt={viewing}
            className={styles.lightboxImg}
          />
          <p className={styles.lightboxHint}>Toca para cerrar</p>
        </div>
      )}
    </div>
  )
}
