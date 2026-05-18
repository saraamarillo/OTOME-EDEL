import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useScene } from '../../hooks/useScene'
import Background from '../../components/Background/Background'
import CharacterSprite from '../../components/CharacterSprite/CharacterSprite'
import DialogueBox from '../../components/DialogueBox/DialogueBox'
import ThoughtBox from '../../components/ThoughtBox/ThoughtBox'
import ChoicePanel from '../../components/ChoicePanel/ChoicePanel'
import AffinityMeter from '../../components/AffinityMeter/AffinityMeter'
import styles from './GameScreen.module.css'

export default function GameScreen() {
  const sceneId            = useGameStore((s) => s.sceneId)
  const activeCharacterId  = useGameStore((s) => s.activeCharacterId)
  const imageReveal        = useGameStore((s) => s.imageReveal)
  const clearImageReveal   = useGameStore((s) => s.clearImageReveal)
  const setScreen          = useGameStore((s) => s.setScreen)
  const saveProgress       = useGameStore((s) => s.saveProgress)
  const userId             = useGameStore((s) => s.userId)
  const volume             = useGameStore((s) => s.volume)
  const setVolume          = useGameStore((s) => s.setVolume)

  const [confirmMenu, setConfirmMenu] = useState(null)   // 'protagonistSelect' | 'episodeList'
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [volumeOpen,  setVolumeOpen]  = useState(false)

  const { currentNode, loading, error, advanceTo, makeChoice } = useScene(sceneId)
  const isChoice = !loading && !error && currentNode?.type === 'choice'

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setVolumeOpen(false)
        return
      }
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        if (!currentNode || isChoice) return
        advanceTo(currentNode.next ?? null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentNode, isChoice, advanceTo])

  if (loading) return <div className={styles.loading}>Cargando...</div>
  if (error)   return <div className={styles.error}>Error al cargar la escena.</div>

  function handleNext() {
    if (!currentNode || isChoice || confirmMenu || menuOpen) return
    advanceTo(currentNode.next ?? null)
  }

  function handleNavClick(dest) {
    setMenuOpen(false)
    setConfirmMenu(dest)
  }

  function handleConfirmNav() {
    if (userId) saveProgress()
    setScreen(confirmMenu)
    setConfirmMenu(null)
  }

  return (
    <div className={styles.screen} onClick={handleNext}>
      {/* Fondo */}
      <Background />

      {/* Sprite del personaje activo */}
      <CharacterSprite characterId={activeCharacterId} visible={!!activeCharacterId} />

      <div className={styles.ui}>

        {/* ── Hamburger (top-left) ──────────────────────────── */}
        <button
          className={styles.hamburgerBtn}
          title="Menú"
          onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); setVolumeOpen(false) }}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

        {/* ── Título centrado (top-center) ──────────────────── */}
        <p className={styles.gameTitle}>EDEL</p>

        {/* ── Drawer lateral izquierdo ──────────────────────── */}
        {menuOpen && (
          <div
            className={styles.menuOverlay}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(false) }}
          >
            <nav className={styles.menuDrawer} onClick={(e) => e.stopPropagation()}>
              <p className={styles.drawerLogo}>EDEL</p>
              <button
                className={styles.drawerItem}
                onClick={() => handleNavClick('protagonistSelect')}
              >
                Elegir protagonista
              </button>
              <button
                className={styles.drawerItem}
                onClick={() => handleNavClick('episodeList')}
              >
                Lista de episodios
              </button>
            </nav>
          </div>
        )}

        {/* ── Diálogo, narración y pensamiento ─────────────── */}
        <DialogueBox node={currentNode} />
        <ThoughtBox node={currentNode} />

        {/* ── Panel de elecciones ───────────────────────────── */}
        {isChoice && (
          <div onClick={(e) => e.stopPropagation()}>
            <ChoicePanel
              choices={currentNode.choices}
              text={currentNode.text}
              onChoice={makeChoice}
            />
          </div>
        )}

        {/* ── Medidor de afinidad ───────────────────────────── */}
        {activeCharacterId && (
          <div className={styles.affinityPanel}>
            <AffinityMeter characterId={activeCharacterId} />
          </div>
        )}

        {/* ── Control de volumen (bottom-right) ────────────── */}
        <div className={styles.volumeWidget} onClick={(e) => e.stopPropagation()}>
          {volumeOpen && (
            <div className={styles.volumePopup}>
              <span className={styles.volumeLabel}>{Math.round(volume * 100)}%</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className={styles.volumeSlider}
              />
            </div>
          )}
          <button
            className={styles.volumeBtn}
            title="Volumen"
            onClick={() => { setVolumeOpen((o) => !o); setMenuOpen(false) }}
          >
            E
          </button>
        </div>

      </div>

      {/* ── Diálogo de confirmación de salida ─────────────── */}
      {confirmMenu && (
        <div className={styles.confirmOverlay} onClick={(e) => e.stopPropagation()}>
          <div className={styles.confirmBox}>
            <p className={styles.confirmText}>
              {confirmMenu === 'protagonistSelect'
                ? '¿Volver a elegir protagonista?'
                : '¿Volver a la lista de episodios?'}
            </p>
            {userId && <p className={styles.confirmSub}>Tu progreso se guardará.</p>}
            <div className={styles.confirmBtns}>
              <button className={styles.confirmYes} onClick={handleConfirmNav}>Sí, salir</button>
              <button className={styles.confirmNo} onClick={() => setConfirmMenu(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Imagen desbloqueada ───────────────────────────── */}
      {imageReveal && (
        <div
          className={styles.imageReveal}
          onClick={(e) => { e.stopPropagation(); clearImageReveal() }}
        >
          <img
            src={`/assets/gallery/${imageReveal}.png`}
            alt=""
            className={styles.revealImg}
          />
          <p className={styles.revealHint}>✦ Imagen desbloqueada · Toca para continuar</p>
        </div>
      )}
    </div>
  )
}
