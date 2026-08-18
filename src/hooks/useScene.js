import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { loadScene, findNode } from '../utils/sceneLoader'

export function useScene(sceneId) {
  const [scene, setScene] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const setBackground            = useGameStore((s) => s.setBackground)
  const setActiveCharacter       = useGameStore((s) => s.setActiveCharacter)
  const changeAffinity           = useGameStore((s) => s.changeAffinity)
  const setCharacterLook         = useGameStore((s) => s.setCharacterLook)
  const setCharacterExpression   = useGameStore((s) => s.setCharacterExpression)
  const setProtagonistExpression = useGameStore((s) => s.setProtagonistExpression)
  const markSceneVisited         = useGameStore((s) => s.markSceneVisited)
  const markNpcEncountered       = useGameStore((s) => s.markNpcEncountered)
  const setSceneId               = useGameStore((s) => s.setScene)
  const protagonistId            = useGameStore((s) => s.protagonistId)
  const unlockImage              = useGameStore((s) => s.unlockImage)
  const setImageReveal           = useGameStore((s) => s.setImageReveal)
  const setScreen                = useGameStore((s) => s.setScreen)
  const setPhoneCallActive       = useGameStore((s) => s.setPhoneCallActive)
  const setRingtonePlayed        = useGameStore((s) => s.setRingtonePlayed)
  const setChatActive            = useGameStore((s) => s.setChatActive)
  const setCallFrozenExpression  = useGameStore((s) => s.setCallFrozenExpression)

  useEffect(() => {
    if (!sceneId) return
    setLoading(true)
    setError(null)

    loadScene(sceneId)
      .then((data) => {
        setScene(data)
        setCurrentNode(data.nodes[0] ?? null)
        setBackground(data.background ?? null)
        markSceneVisited(sceneId)
        setPhoneCallActive(false)
        setRingtonePlayed(false)
        setChatActive(false)
        setCallFrozenExpression(null)
        setLoading(false)
      })
      .catch((err) => {
        console.error(`[useScene] Error cargando escena "${sceneId}":`, err)
        setError(err)
        setLoading(false)
      })
  }, [sceneId])

  useEffect(() => {
    const spriteChar   = currentNode?.activeCharacter ?? null
    const dialogueChar = currentNode?.character ?? null
    // hideSprite: el personaje habla (nombre y bocadillo normales) pero su
    // sprite no se muestra todavía (voz sin cuerpo en pantalla, p. ej. Frey
    // hablando a través de la grieta antes de aparecer).
    setActiveCharacter(currentNode?.hideSprite ? null : (spriteChar ?? dialogueChar ?? null))

    if (spriteChar)   markNpcEncountered(spriteChar)
    if (dialogueChar) markNpcEncountered(dialogueChar)

    if (currentNode?.background) setBackground(currentNode.background)
    if (currentNode?.unlockImage) {
      unlockImage(currentNode.unlockImage)
      setImageReveal(currentNode.unlockImage)
    }
    if (currentNode?.lookChanges) {
      for (const [charId, look] of Object.entries(currentNode.lookChanges)) {
        setCharacterLook(charId, look)
      }
    }

    // Expresión manual de NPC (sobreescribe la afinidad en este nodo)
    if (currentNode?.expression !== undefined) {
      const targetChar = currentNode.activeCharacter ?? currentNode.character
      if (targetChar) setCharacterExpression(targetChar, currentNode.expression)
    }

    // Emoción de la protagonista (cara en burbujas de llamada/chat)
    if (currentNode?.protagonistExpression !== undefined) {
      setProtagonistExpression(currentNode.protagonistExpression)
    }

    // Llamada / chat en curso: un nodo "phone" o "chat" los activa; los
    // propios diálogos/pensamientos de la protagonista los mantienen;
    // cualquier otro tipo (narración, elección) los da por terminados.
    const state = useGameStore.getState()
    const wasPhoneActive = state.phoneCallActive
    const wasChatActive = state.chatActive
    let nextPhoneActive = wasPhoneActive
    let nextChatActive = wasChatActive

    if (currentNode?.type === 'phone') {
      nextPhoneActive = true
      nextChatActive = false
    } else if (currentNode?.type === 'chat') {
      nextChatActive = true
      nextPhoneActive = false
    } else if (currentNode?.type !== 'dialogue' && currentNode?.type !== 'thought') {
      nextPhoneActive = false
      nextChatActive = false
    }

    if (nextPhoneActive && !wasPhoneActive) {
      setRingtonePlayed(false)
      setCallFrozenExpression(useGameStore.getState().protagonistExpression)
    }

    setPhoneCallActive(nextPhoneActive)
    setChatActive(nextChatActive)
  }, [currentNode])

  const advanceTo = useCallback(
    (nodeId) => {
      if (!scene) return
      if (nodeId === null) {
        if (currentNode?.endEpisode) { setScreen('episodeEnd'); return }
        if (currentNode?.nextScene) setSceneId(currentNode.nextScene)
        return
      }
      const next = findNode(scene, nodeId)
      if (!next) return

      if (next.type === 'protagonistBranch') {
        const branchId = next.branches?.[protagonistId]
        if (branchId) {
          const branch = findNode(scene, branchId)
          if (branch) setCurrentNode(branch)
        }
        return
      }

      setCurrentNode(next)
    },
    [scene, currentNode, setSceneId, protagonistId],
  )

  const makeChoice = useCallback(
    (choice) => {
      if (choice.affinityChanges) {
        for (const [charId, delta] of Object.entries(choice.affinityChanges)) {
          changeAffinity(charId, delta)
        }
      }
      if (choice.next) advanceTo(choice.next)
      else advanceTo(null)
    },
    [changeAffinity, advanceTo],
  )

  return { scene, currentNode, loading, error, advanceTo, makeChoice }
}
