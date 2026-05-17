import { NPC_CHARACTERS } from '../constants/characters'
import { AFFINITY_DEFAULT } from '../constants/affinity'

const buildAffinityMap = () =>
  Object.fromEntries(NPC_CHARACTERS.map((c) => [c.id, AFFINITY_DEFAULT]))

const SEED_USERS = [
  { username: 'sara',      displayName: 'Sara',      password: 's0299',  guest: false },
  { username: 'isa',       displayName: 'Isa',       password: 'i1199',  guest: false },
  { username: 'clau',      displayName: 'Clau',      password: 'c1999',  guest: false },
  { username: 'alien',     displayName: 'Alien',     password: 'a0326',  guest: false },
  { username: 'invitado',  displayName: 'Invitado',  password: 'i1234',  guest: true  },
]

/**
 * Inicializa los usuarios predefinidos en localStorage.
 * - Si el usuario no existe → lo crea desde cero.
 * - Si ya existe → actualiza displayName, password y guest
 *   pero CONSERVA el progreso (completedEpisodes, affinities, etc.)
 */
export function seedUsers() {
  for (const u of SEED_USERS) {
    const key = `edel:${u.username}`
    const raw = localStorage.getItem(key)
    if (raw) {
      // Actualizar credenciales sin borrar progreso
      const existing = JSON.parse(raw)
      localStorage.setItem(key, JSON.stringify({
        ...existing,
        displayName: u.displayName,
        password: u.password,
        guest: u.guest,
      }))
    } else {
      // Crear cuenta nueva
      localStorage.setItem(key, JSON.stringify({
        displayName: u.displayName,
        password: u.password,
        guest: u.guest,
        completedEpisodes: [],
        unlockedImages: [],
        affinities: buildAffinityMap(),
      }))
    }
  }
}
