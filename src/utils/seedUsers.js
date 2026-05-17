import { NPC_CHARACTERS } from '../constants/characters'
import { AFFINITY_DEFAULT } from '../constants/affinity'

const buildAffinityMap = () =>
  Object.fromEntries(NPC_CHARACTERS.map((c) => [c.id, AFFINITY_DEFAULT]))

/** Affinities stored per protagonist route */
const buildRouteAffinities = () => ({
  soledad: buildAffinityMap(),
  ayla:    buildAffinityMap(),
  maven:   buildAffinityMap(),
})

const buildRouteEncountered = () => ({ soledad: [], ayla: [], maven: [] })

const SEED_USERS = [
  { username: 'sara',      displayName: 'Sara',      password: 's0299',  guest: false },
  { username: 'isa',       displayName: 'Isa',       password: 'i1199',  guest: false },
  { username: 'clau',      displayName: 'Clau',      password: 'c1999',  guest: false },
  { username: 'alien',     displayName: 'Alien',     password: 'a0326',  guest: false },
  { username: 'invitado',  displayName: 'Invitado',  password: 'i1234',  guest: true  },
]

/**
 * Inicializa los usuarios predefinidos en localStorage.
 * - Si el usuario no existe → lo crea desde cero con estructura per-ruta.
 * - Si ya existe → actualiza credenciales y migra affinities al formato per-ruta
 *   si estaban en el formato plano antiguo, SIN borrar el progreso ya guardado.
 */
export function seedUsers() {
  for (const u of SEED_USERS) {
    const key = `edel:${u.username}`
    const raw = localStorage.getItem(key)
    if (raw) {
      const existing = JSON.parse(raw)
      // Migrar affinities al formato per-ruta si están en formato plano
      let affinities = existing.affinities
      if (!affinities?.soledad) affinities = buildRouteAffinities()
      let encounteredNPCs = existing.encounteredNPCs
      if (!encounteredNPCs?.soledad) encounteredNPCs = buildRouteEncountered()

      localStorage.setItem(key, JSON.stringify({
        ...existing,
        displayName: u.displayName,
        password: u.password,
        guest: u.guest,
        affinities,
        encounteredNPCs,
      }))
    } else {
      localStorage.setItem(key, JSON.stringify({
        displayName:    u.displayName,
        password:       u.password,
        guest:          u.guest,
        completedEpisodes: [],
        unlockedImages:    [],
        affinities:        buildRouteAffinities(),
        encounteredNPCs:   buildRouteEncountered(),
      }))
    }
  }
}
