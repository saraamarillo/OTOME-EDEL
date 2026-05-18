import { useEffect, useRef } from 'react'
import { useGameStore } from './store/gameStore'
import TitleScreen from './screens/TitleScreen/TitleScreen'
import LoginScreen from './screens/LoginScreen/LoginScreen'
import EpisodeListScreen from './screens/EpisodeListScreen/EpisodeListScreen'
import ProtagonistSelect from './screens/ProtagonistSelect/ProtagonistSelect'
import GameScreen from './screens/GameScreen/GameScreen'
import EpisodeEndScreen from './screens/EpisodeEndScreen/EpisodeEndScreen'
import ComingSoonScreen from './screens/ComingSoonScreen/ComingSoonScreen'
import GalleryScreen from './screens/GalleryScreen/GalleryScreen'
import styles from './App.module.css'

const MUSIC_SRC = '/assets/music/OTOME EDEL.mp3'

const GAME_W = 1280
const GAME_H = 720

const SCREENS = {
  title: TitleScreen,
  login: LoginScreen,
  episodeList: EpisodeListScreen,
  protagonistSelect: ProtagonistSelect,
  game: GameScreen,
  episodeEnd: EpisodeEndScreen,
  comingSoon: ComingSoonScreen,
  gallery: GalleryScreen,
}

export default function App() {
  const currentScreen = useGameStore((s) => s.currentScreen)
  const volume = useGameStore((s) => s.volume)
  const Screen = SCREENS[currentScreen] ?? TitleScreen
  const ref = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(MUSIC_SRC)
      audio.loop = true
      audio.volume = volume
      audioRef.current = audio
    }

    const audio = audioRef.current
    const inEpisode = currentScreen === 'game'

    if (inEpisode) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [currentScreen])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    function applyScale() {
      if (!ref.current) return
      const scale = Math.min(window.innerWidth / GAME_W, window.innerHeight / GAME_H)
      const offsetX = (window.innerWidth - GAME_W * scale) / 2
      const offsetY = (window.innerHeight - GAME_H * scale) / 2
      ref.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
    }
    applyScale()
    window.addEventListener('resize', applyScale)
    return () => window.removeEventListener('resize', applyScale)
  }, [])

  return (
    <div ref={ref} className={styles.viewport}>
      <Screen />
    </div>
  )
}
