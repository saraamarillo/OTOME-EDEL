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
  const sceneId = useGameStore((s) => s.sceneId)
  const activeCharacterId = useGameStore((s) => s.activeCharacterId)
  const imageReveal = useGameStore((s) => s.imageReveal)
  const clearImageReveal = useGameStore((s) => s.clearImageReveal)
  const setScreen = useGameStore((s) => s.setScreen)
  const saveProgress = useGameStore((s) => s.saveProgress)
  const userId = useGameStore((s) => s.userId)
  const [confirmMenu, setConfirmMenu] = useState(null) // 'title' | 'episodeList'
  const { currentNode, loading, error, advanceTo, makeChoice } = useScene(sceneId)

  const isChoice = !loading && !error && currentNode?.type === 'choice'

  useEffect(() => {
    function onKey(e) {
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
    if (!currentNode || isChoice || confirmMenu) return
    advanceTo(currentNode.next ?? null)
  }

  function handleNavClick(dest) {
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
        {/* Botones de navegación — top left */}
        <div className={styles.navBar} onClick={(e) => e.stopPropagation()}>
          <button
            className={styles.navBtn}
            title="Elegir protagonista"
            onClick={() => handleNavClick('protagonistSelect')}
          >
            🏠
          </button>
          <button
            className={styles.navBtn}
            title="Lista de episodios"
            onClick={() => handleNavClick('episodeList')}
          >
            ←
          </button>
        </div>

        {/* Diálogo y narración */}
        <DialogueBox node={currentNode} />

        {/* Avatar de protagonista (siempre) + burbuja de pensamiento (solo en thought) */}
        <ThoughtBox node={currentNode} />

        {/* Panel de elecciones — bloquea el click del screen */}
        {isChoice && (
          <div onClick={(e) => e.stopPropagation()}>
            <ChoicePanel choices={currentNode.choices} text={currentNode.text} onChoice={makeChoice} />
          </div>
        )}

        {/* Medidor de afinidad — solo cuando hay NPC en pantalla */}
        {activeCharacterId && (
          <div className={styles.affinityPanel}>
            <AffinityMeter characterId={activeCharacterId} />
          </div>
        )}
      </div>

      {/* Diálogo de confirmación de salida */}
      {confirmMenu && (
        <div className={styles.confirmOverlay} onClick={(e) => e.stopPropagation()}>
          <div className={styles.confirmBox}>
            <p className={styles.confirmText}>
              {confirmMenu === 'protagonistSelect'
                ? '¿Volver a elegir protagonista?'
                : '¿Volver a la lista de episodios?'}
            </p>
            {userId && (
              <p className={styles.confirmSub}>Tu progreso se guardará.</p>
            )}
            <div className={styles.confirmBtns}>
              <button className={styles.confirmYes} onClick={handleConfirmNav}>Sí, salir</button>
              <button className={styles.confirmNo} onClick={() => setConfirmMenu(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

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
