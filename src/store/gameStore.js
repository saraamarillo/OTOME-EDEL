import { create } from 'zustand'
import { AFFINITY_DEFAULT, AFFINITY_MIN, AFFINITY_MAX } from '../constants/affinity'
import { NPC_CHARACTERS } from '../constants/characters'

// ── Cuenta única, sin backend: usuario y contraseña fijos ─────
const VALID_USERNAME = 'EDEL25'
const VALID_PASSWORD = 'otome1999'
const AUTH_KEY = 'edel:loggedIn'
const SAVE_KEY = 'edel:save'

function readSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null')
  } catch {
    return null
  }
}

function writeSave(save) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save))
  } catch {
    // almacenamiento no disponible (modo privado, cuota llena, etc.) — se ignora
  }
}

const buildAffinityMap = () =>
  Object.fromEntries(NPC_CHARACTERS.map((c) => [c.id, AFFINITY_DEFAULT]))

/** Affinities and encounteredNPCs are stored per protagonist route */
const buildRouteAffinities = () => ({
  soledad: buildAffinityMap(),
  ayla:    buildAffinityMap(),
  maven:   buildAffinityMap(),
})

const buildRouteEncountered = () => ({ soledad: [], ayla: [], maven: [] })

/** Episodios completados / imágenes desbloqueadas / veces jugado — por ruta */
const buildRouteEpisodes = () => ({ soledad: [], ayla: [], maven: [] })
const buildRoutePlayCounts = () => ({ soledad: {}, ayla: {}, maven: {} })

/** Migrate old flat-map saves to per-protagonist structure */
const migrateAffinities = (raw) => {
  if (!raw) return buildRouteAffinities()
  // Already per-protagonist (has 'soledad' key)
  if (raw.soledad !== undefined) return {
    soledad: { ...buildAffinityMap(), ...raw.soledad },
    ayla:    { ...buildAffinityMap(), ...raw.ayla    },
    maven:   { ...buildAffinityMap(), ...raw.maven   },
  }
  // Old flat format — discard (development stage)
  return buildRouteAffinities()
}

const migrateEncountered = (raw) => {
  if (!raw) return buildRouteEncountered()
  if (raw.soledad !== undefined) return { soledad: raw.soledad ?? [], ayla: raw.ayla ?? [], maven: raw.maven ?? [] }
  return buildRouteEncountered()
}

/** Migrate old flat-array saves (completedEpisodes/unlockedImages) to per-route structure */
const migrateEpisodeList = (raw) => {
  if (!raw) return buildRouteEpisodes()
  if (raw.soledad !== undefined) return { soledad: raw.soledad ?? [], ayla: raw.ayla ?? [], maven: raw.maven ?? [] }
  // Old flat format — discard (development stage)
  return buildRouteEpisodes()
}

const migratePlayCounts = (raw) => {
  if (!raw) return buildRoutePlayCounts()
  if (raw.soledad !== undefined) return { soledad: raw.soledad ?? {}, ayla: raw.ayla ?? {}, maven: raw.maven ?? {} }
  return buildRoutePlayCounts()
}

export const useGameStore = create((set, get) => ({
  // ── Sesión de usuario (cuenta única fija, guardado en localStorage) ─
  userId: null,
  userName: null,
  authLoading: true,          // true mientras se comprueba si ya hay sesión activa
  completedEpisodes: buildRouteEpisodes(),
  episodePlayCounts: buildRoutePlayCounts(),

  /** Aplica un guardado local al estado. */
  _hydrateFromSave: (save) => {
    set({
      userId: 'edel25',
      userName: VALID_USERNAME,
      completedEpisodes: migrateEpisodeList(save?.completedEpisodes),
      unlockedImages:    migrateEpisodeList(save?.unlockedImages),
      episodePlayCounts: migratePlayCounts(save?.episodePlayCounts),
      affinities:      migrateAffinities(save?.affinities),
      encounteredNPCs: migrateEncountered(save?.encounteredNPCs),
    })
  },

  /** Comprueba al arrancar la app si ya había una sesión guardada en este dispositivo. */
  initSession: () => {
    const loggedIn = localStorage.getItem(AUTH_KEY) === '1'
    if (!loggedIn) { set({ authLoading: false }); return }
    get()._hydrateFromSave(readSave())
    set({ authLoading: false, currentScreen: 'protagonistSelect' })
  },

  login: (username, password) => {
    const trimmedUsername = username.trim()
    if (!trimmedUsername || !password) return { status: 'empty' }
    if (trimmedUsername !== VALID_USERNAME || password !== VALID_PASSWORD) {
      return { status: 'error', message: 'Usuario o contraseña incorrectos.' }
    }
    localStorage.setItem(AUTH_KEY, '1')
    get()._hydrateFromSave(readSave())
    set({ currentScreen: 'protagonistSelect' })
    return { status: 'ok' }
  },

  /** Modo invitado: juega sin guardar el progreso. */
  loginAsGuest: () => set({
    userId: null,
    userName: 'Invitada',
    completedEpisodes: buildRouteEpisodes(),
    episodePlayCounts: buildRoutePlayCounts(),
    unlockedImages: buildRouteEpisodes(),
    affinities: buildRouteAffinities(),
    encounteredNPCs: buildRouteEncountered(),
    currentScreen: 'protagonistSelect',
  }),

  logout: () => {
    localStorage.removeItem(AUTH_KEY)
    set({
      userId: null, userName: null, completedEpisodes: buildRouteEpisodes(),
      episodePlayCounts: buildRoutePlayCounts(),
      currentScreen: 'title',
      protagonistId: null, sceneId: null, nodeIndex: 0,
      activeCharacterId: null, backgroundId: null,
      affinities: buildRouteAffinities(), characterLooks: {},
      visitedScenes: [], unlockedImages: buildRouteEpisodes(), imageReveal: null,
      encounteredNPCs: buildRouteEncountered(),
    })
  },

  completeEpisode: (epNum) => {
    const state = get()
    const pid = state.protagonistId
    if (!pid) return
    const routeList = state.completedEpisodes[pid] ?? []
    const updatedList = routeList.includes(epNum) ? routeList : [...routeList, epNum]
    const routeCounts = state.episodePlayCounts[pid] ?? {}
    const updatedCounts = { ...routeCounts, [epNum]: (routeCounts[epNum] ?? 0) + 1 }
    set({
      completedEpisodes: { ...state.completedEpisodes, [pid]: updatedList },
      episodePlayCounts: { ...state.episodePlayCounts, [pid]: updatedCounts },
    })
    get().saveProgress()
  },

  saveProgress: () => {
    const state = get()
    if (!state.userId) return
    writeSave({
      completedEpisodes: state.completedEpisodes,
      episodePlayCounts: state.episodePlayCounts,
      unlockedImages: state.unlockedImages,
      affinities: state.affinities,
      encounteredNPCs: state.encounteredNPCs,
    })
  },

  // ── Audio ───────────────────────────────────────────────────
  volume: 0.45,
  setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),

  // ── Navegación ──────────────────────────────────────────────
  currentScreen: 'title',       // 'title' | 'login' | 'protagonistSelect' | 'landing' | 'episodeList' | 'characters' | 'game' | 'episodeEnd' | 'comingSoon' | 'gallery'
  setScreen: (screen) => set({ currentScreen: screen }),

  // ── Episodio seleccionado ───────────────────────────────────
  selectedEpisode: 1,
  setSelectedEpisode: (ep) => set({ selectedEpisode: ep }),

  // ── Protagonista ────────────────────────────────────────────
  protagonistId: null,           // 'soledad' | 'ayla'
  selectProtagonist: (id) => set({ protagonistId: id }),

  // ── Escena activa ───────────────────────────────────────────
  sceneId: null,                 // id del JSON de escena cargado
  nodeIndex: 0,                  // nodo actual dentro del árbol
  setScene: (sceneId) => set({ sceneId, nodeIndex: 0 }),
  setNodeIndex: (idx) => set({ nodeIndex: idx }),

  // ── Personaje en pantalla ───────────────────────────────────
  activeCharacterId: null,       // qué NPC está visible ahora
  setActiveCharacter: (id) => set({ activeCharacterId: id }),

  // ── NPCs conocidos (por ruta/protagonista) ─────────────────
  encounteredNPCs: buildRouteEncountered(),
  markNpcEncountered: (id) => {
    if (!id) return
    const pid = get().protagonistId
    if (!pid) return
    set((state) => {
      const current = state.encounteredNPCs[pid] ?? []
      if (current.includes(id)) return state
      return {
        encounteredNPCs: {
          ...state.encounteredNPCs,
          [pid]: [...current, id],
        },
      }
    })
  },

  // ── Fondo ───────────────────────────────────────────────────
  backgroundId: null,            // nombre del PNG en /assets/backgrounds/
  setBackground: (id) => set({ backgroundId: id }),

  // ── Afinidades (por ruta/protagonista) ─────────────────────
  // Estructura: { soledad: { ethan: 5, ... }, ayla: { ethan: 0, ... }, maven: {...} }
  affinities: buildRouteAffinities(),
  changeAffinity: (characterId, delta) => {
    const pid = get().protagonistId
    if (!pid) return
    set((state) => {
      const routeMap = state.affinities[pid] ?? {}
      return {
        affinities: {
          ...state.affinities,
          [pid]: {
            ...routeMap,
            [characterId]: Math.min(
              AFFINITY_MAX,
              Math.max(AFFINITY_MIN, (routeMap[characterId] ?? AFFINITY_DEFAULT) + delta),
            ),
          },
        },
      }
    })
    get().saveProgress()
  },
  getAffinity: (characterId) => {
    const { protagonistId, affinities } = get()
    return affinities[protagonistId]?.[characterId] ?? AFFINITY_DEFAULT
  },

  // ── Looks de personaje (cambian según el arco) ─────────────
  // El look 'arc1' es el predeterminado para todos
  characterLooks: {},
  setCharacterLook: (characterId, look) =>
    set((state) => ({
      characterLooks: { ...state.characterLooks, [characterId]: look },
    })),
  getCharacterLook: (characterId) => get().characterLooks[characterId] ?? 'arc1',

  // ── Expresión manual de NPC (sobreescribe la de afinidad) ──
  // Se establece por nodo; null = usar la de afinidad
  characterExpressions: {},
  setCharacterExpression: (characterId, expression) =>
    set((state) => ({
      characterExpressions: { ...state.characterExpressions, [characterId]: expression },
    })),

  // ── Expresión de la protagonista (para burbujas y reacciones) ─
  protagonistExpression: 'neutral',
  setProtagonistExpression: (expression) => set({ protagonistExpression: expression }),

  // ── Historial de escenas visitadas ─────────────────────────
  visitedScenes: [],
  markSceneVisited: (sceneId) =>
    set((state) => ({
      visitedScenes: state.visitedScenes.includes(sceneId)
        ? state.visitedScenes
        : [...state.visitedScenes, sceneId],
    })),

  // ── Galería de imágenes desbloqueadas (por ruta) ────────────
  unlockedImages: buildRouteEpisodes(),
  unlockImage: (imageId) => {
    const pid = get().protagonistId
    if (!pid) return
    set((state) => {
      const routeList = state.unlockedImages[pid] ?? []
      if (routeList.includes(imageId)) return state
      return { unlockedImages: { ...state.unlockedImages, [pid]: [...routeList, imageId] } }
    })
    get().saveProgress()
  },

  // ── Imagen recién desbloqueada (muestra popup en juego) ─────
  imageReveal: null,
  setImageReveal: (imageId) => set({ imageReveal: imageId }),
  clearImageReveal: () => set({ imageReveal: null }),

  // ── Última elección tomada (para HUD, no se persiste) ───────
  lastChoice: null,
  setLastChoice: (choice) => set({ lastChoice: choice }),

  // ── Llamada telefónica en curso (persiste durante las réplicas
  // propias de la protagonista entre nodos "phone") ──────────
  phoneCallActive: false,
  setPhoneCallActive: (active) => set({ phoneCallActive: active }),
  ringtonePlayed: false,
  setRingtonePlayed: (played) => set({ ringtonePlayed: played }),

  // ── Chat en curso (misma idea que la llamada, para el icono) ─
  chatActive: false,
  setChatActive: (active) => set({ chatActive: active }),

  // ── Expresión de la protagonista congelada al inicio de la
  // llamada, para que su círculo no cambie de cara mientras dura ─
  callFrozenExpression: null,
  setCallFrozenExpression: (expression) => set({ callFrozenExpression: expression }),
}))
