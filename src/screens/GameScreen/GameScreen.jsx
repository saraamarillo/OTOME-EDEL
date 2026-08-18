import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useScene } from '../../hooks/useScene'
import Background from '../../components/Background/Background'
import CharacterSprite from '../../components/CharacterSprite/CharacterSprite'
import DialogueBox from '../../components/DialogueBox/DialogueBox'
import ThoughtBox from '../../components/ThoughtBox/ThoughtBox'
import ChoicePanel from '../../components/ChoicePanel/ChoicePanel'
import AffinityMeter from '../../components/AffinityMeter/AffinityMeter'
import PhoneCallOverlay, { PhoneIcon } from '../../components/PhoneCallOverlay/PhoneCallOverlay'
import ChatMessageOverlay, { ChatIcon } from '../../components/ChatMessageOverlay/ChatMessageOverlay'
import { getGalleryImage } from '../../constants/galleryImages'
import { PROTAGONISTS } from '../../constants/characters'
import { ROUTE_THEME } from '../../constants/theme'
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
  const phoneCallActive    = useGameStore((s) => s.phoneCallActive)
  const chatActive         = useGameStore((s) => s.chatActive)
  const protagonistId      = useGameStore((s) => s.protagonistId)
  const accent             = PROTAGONISTS.find((p) => p.id === protagonistId)?.color ?? '#e38e1f'
  const routeTheme         = ROUTE_THEME[protagonistId] ?? ROUTE_THEME.ayla

  const [confirmMenu, setConfirmMenu] = useState(null)   // 'protagonistSelect' | 'episodeList'
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [volumeOpen,  setVolumeOpen]  = useState(false)

  const { currentNode, loading, error, advanceTo, makeChoice } = useScene(sceneId)
  const isChoice = !loading && !error && currentNode?.type === 'choice'
  const isPhone  = !loading && !error && currentNode?.type === 'phone'
  const isChat   = !loading && !error && currentNode?.type === 'chat'

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

      {/* Sprite del personaje activo — oculto en llamadas/chats */}
      <CharacterSprite characterId={activeCharacterId} visible={!!activeCharacterId && !isPhone && !isChat} />

      {/* Oscurece el fondo para que la decisión se lea mejor */}
      {isChoice && <div className={styles.choiceScrim} />}

      <div className={styles.ui}>

        {/* ── Hamburger (top-left) ──────────────────────────── */}
        <button
          className={styles.hamburgerBtn}
          data-theme={routeTheme.mode}
          title="Menú"
          onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); setVolumeOpen(false) }}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

        {/* ── Título centrado (top-center) ──────────────────── */}
        <p className={styles.gameTitle}>EDEL</p>

        {/* ── Icono de llamada/chat persistente (líneas propias intermedias) ─ */}
        {phoneCallActive && !isPhone && (
          <div className={styles.commBadge} style={{ background: accent }} title="Llamada en curso">
            <PhoneIcon className={styles.commBadgeIcon} />
          </div>
        )}
        {chatActive && !isChat && (
          <div className={styles.commBadge} style={{ background: accent }} title="Conversación en curso">
            <ChatIcon className={styles.commBadgeIcon} />
          </div>
        )}

        {/* ── Drawer lateral izquierdo ──────────────────────── */}
        {menuOpen && (
          <div
            className={styles.menuOverlay}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(false) }}
          >
            <nav className={styles.menuDrawer} data-theme={routeTheme.mode} onClick={(e) => e.stopPropagation()}>
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
        {!isPhone && !isChat && <DialogueBox node={currentNode} />}
        {!isPhone && !isChat && <ThoughtBox node={currentNode} />}

        {/* ── Chat y llamada ────────────────────────────────── */}
        {isChat && (
          <ChatMessageOverlay
            node={currentNode}
            onAdvance={() => advanceTo(currentNode.next ?? null)}
          />
        )}

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
          <div className={styles.confirmBox} data-theme={routeTheme.mode}>
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

      {/* ── Llamada telefónica ───────────────────────────── */}
      {isPhone && (
        <PhoneCallOverlay
          node={currentNode}
          onAdvance={() => advanceTo(currentNode.next ?? null)}
        />
      )}

      {/* ── Imagen desbloqueada ───────────────────────────── */}
      {imageReveal && (() => {
        const meta = getGalleryImage(imageReveal)
        const isCamara = routeTheme.mode === 'camara'
        return (
          <div className={styles.imageReveal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.revealCard} data-theme={routeTheme.mode}>
              <p className={styles.revealLabel}>
                {isCamara ? '◆ RECUERDO CAPTURADO ◆' : '♥ Recuerdo desbloqueado ♥'}
              </p>
              <div className={styles.revealImgWrap}>
                <img
                  src={`/assets/gallery/${meta?.file}`}
                  alt=""
                  className={styles.revealImg}
                />
                {meta && (
                  <div className={styles.revealCaption}>
                    <p className={styles.revealCaptionTitle}>{meta.title}</p>
                    <p className={styles.revealCaptionSub}>{meta.subtitle}</p>
                  </div>
                )}
              </div>
              <div className={styles.revealActions}>
                <button
                  className={styles.revealBtnGhost}
                  onClick={() => { clearImageReveal(); setScreen('gallery') }}
                >
                  Ver en galería
                </button>
                <button className={styles.revealBtn} onClick={clearImageReveal}>
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
