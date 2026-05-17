import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { loadScene, findNode } from '../utils/sceneLoader'

export function useScene(sceneId) {
  const [scene, setScene] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const setBackground      = useGameStore((s) => s.setBackground)
  const setActiveCharacter = useGameStore((s) => s.setActiveCharacter)
  const changeAffinity     = useGameStore((s) => s.changeAffinity)
  const setCharacterLook   = useGameStore((s) => s.setCharacterLook)
  const markSceneVisited   = useGameStore((s) => s.markSceneVisited)
  const markNpcEncountered = useGameStore((s) => s.markNpcEncountered)
  const setSceneId         = useGameStore((s) => s.setScene)
  const protagonistId      = useGameStore((s) => s.protagonistId)
  const unlockImage        = useGameStore((s) => s.unlockImage)
  const setImageReveal     = useGameStore((s) => s.setImageReveal)
  const setScreen          = useGameStore((s) => s.setScreen)

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
    setActiveCharacter(spriteChar ?? dialogueChar ?? null)

    // Registrar encuentro: sprite y/o personaje del diálogo
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

      // Nodo de bifurcación por protagonista: saltar directamente al ramal correcto
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
