import { useGameStore } from '../store/gameStore'
import { getExpressionForAffinity, affinityToHearts } from '../utils/affinityUtils'
import { NPC_CHARACTERS } from '../constants/characters'
import { AFFINITY_DEFAULT } from '../constants/affinity'

/**
 * Devuelve los datos de afinidad de un personaje concreto,
 * incluyendo la expresión y el número de corazones derivados.
 */
export function useCharacterAffinity(characterId) {
  const affinityValue = useGameStore((s) => s.affinities[characterId] ?? AFFINITY_DEFAULT)
  const expression = getExpressionForAffinity(affinityValue)
  const hearts = affinityToHearts(affinityValue)
  const character = NPC_CHARACTERS.find((c) => c.id === characterId)

  return { affinityValue, expression, hearts, character }
}

/**
 * Devuelve un mapa completo de afinidades para todos los NPCs,
 * útil para la pantalla de resumen o el panel de afinidades.
 */
export function useAllAffinities() {
  const affinities = useGameStore((s) => s.affinities)
  return NPC_CHARACTERS.map((char) => ({
    ...char,
    affinityValue: affinities[char.id] ?? AFFINITY_DEFAULT,
    expression: getExpressionForAffinity(affinities[char.id] ?? AFFINITY_DEFAULT),
    hearts: affinityToHearts(affinities[char.id] ?? AFFINITY_DEFAULT),
  }))
}
