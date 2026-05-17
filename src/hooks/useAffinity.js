import { useGameStore } from '../store/gameStore'
import { getExpressionForAffinity, affinityToHearts } from '../utils/affinityUtils'
import { NPC_CHARACTERS, PROTAGONISTS } from '../constants/characters'
import { AFFINITY_DEFAULT } from '../constants/affinity'

/**
 * Devuelve los datos de afinidad de un personaje concreto
 * dentro de la ruta de la protagonista activa.
 * Funciona tanto para NPCs como para protagonistas que aparecen como NPC.
 */
export function useCharacterAffinity(characterId) {
  const affinityValue = useGameStore((s) => {
    const pid = s.protagonistId
    return s.affinities[pid]?.[characterId] ?? AFFINITY_DEFAULT
  })
  const expression = getExpressionForAffinity(affinityValue)
  const hearts = affinityToHearts(affinityValue)

  // Buscar en NPCs primero; si no, en protagonistas (aparecen como NPC en la ruta contraria)
  const character =
    NPC_CHARACTERS.find((c) => c.id === characterId) ??
    PROTAGONISTS.find((p) => p.id === characterId) ??
    null

  return { affinityValue, expression, hearts, character }
}

/**
 * Devuelve un mapa completo de afinidades para todos los NPCs
 * de la ruta activa de la protagonista.
 */
export function useAllAffinities() {
  const affinities    = useGameStore((s) => s.affinities)
  const protagonistId = useGameStore((s) => s.protagonistId)
  const routeMap      = affinities[protagonistId] ?? {}

  return NPC_CHARACTERS.map((char) => ({
    ...char,
    affinityValue: routeMap[char.id] ?? AFFINITY_DEFAULT,
    expression:    getExpressionForAffinity(routeMap[char.id] ?? AFFINITY_DEFAULT),
    hearts:        affinityToHearts(routeMap[char.id] ?? AFFINITY_DEFAULT),
  }))
}
