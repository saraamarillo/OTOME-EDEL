import { create } from 'zustand'
import { AFFINITY_DEFAULT, AFFINITY_MIN, AFFINITY_MAX } from '../constants/affinity'
import { NPC_CHARACTERS } from '../constants/characters'
import { supabase } from '../lib/supabaseClient'
import { getCachedEmail, cacheEmail } from '../utils/usernameCache'

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
  // ── Sesión de usuario (Supabase Auth + tabla game_saves) ──────
  userId: null,
  userName: null,
  authLoading: true,          // true mientras se comprueba si ya hay sesión activa
  completedEpisodes: buildRouteEpisodes(),
  episodePlayCounts: buildRoutePlayCounts(),

  /** Aplica una fila de game_saves + sesión de Supabase al estado local. */
  _hydrateFromSave: (session, save) => {
    set({
      userId: session.user.id,
      userName: save?.display_name ?? session.user.email,
      completedEpisodes: migrateEpisodeList(save?.completed_episodes),
      unlockedImages:    migrateEpisodeList(save?.unlocked_images),
      episodePlayCounts: migratePlayCounts(save?.episode_play_counts),
      affinities:      migrateAffinities(save?.affinities),
      encounteredNPCs: migrateEncountered(save?.encountered_npcs),
    })
  },

  /** Comprueba al arrancar la app si ya hay una sesión guardada (Supabase la persiste sola). */
  initSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { set({ authLoading: false }); return }
    const { data: save } = await supabase
      .from('game_saves')
      .select('*')
      .eq('user_id', session.user.id)
      .single()
    get()._hydrateFromSave(session, save)
    set({ authLoading: false, currentScreen: 'protagonistSelect' })
  },

  signUp: async (username, email, password) => {
    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()
    if (!trimmedUsername || !trimmedEmail || !password) return { status: 'empty' }

    const { data: available, error: checkError } = await supabase.rpc('username_available', {
      p_username: trimmedUsername,
    })
    if (checkError) return { status: 'error', message: checkError.message }
    if (!available) return { status: 'username_taken' }

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: { data: { username: trimmedUsername, display_name: trimmedUsername } },
    })
    if (error) return { status: 'error', message: error.message }
    cacheEmail(trimmedUsername, trimmedEmail)
    if (!data.session) return { status: 'confirm_email' }
    // Confirmación de email desactivada: entra directamente
    const { data: save } = await supabase
      .from('game_saves')
      .select('*')
      .eq('user_id', data.session.user.id)
      .single()
    get()._hydrateFromSave(data.session, save)
    set({ currentScreen: 'protagonistSelect' })
    return { status: 'ok' }
  },

  login: async (username, password, emailHint) => {
    const trimmedUsername = username.trim()
    if (!trimmedUsername || !password) return { status: 'empty' }

    const email = emailHint?.trim() || getCachedEmail(trimmedUsername)
    if (!email) return { status: 'need_email' }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { status: 'error', message: error.message }
    cacheEmail(trimmedUsername, email)
    const { data: save } = await supabase
      .from('game_saves')
      .select('*')
      .eq('user_id', data.session.user.id)
      .single()
    get()._hydrateFromSave(data.session, save)
    set({ currentScreen: 'protagonistSelect' })
    return { status: 'ok' }
  },

  /** Modo invitado: juega sin cuenta ni guardado (nada se persiste). */
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

  logout: async () => {
    if (get().userId) await supabase.auth.signOut()
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

  saveProgress: async () => {
    const state = get()
    if (!state.userId) return
    await supabase.from('game_saves').update({
      completed_episodes: state.completedEpisodes,
      episode_play_counts: state.episodePlayCounts,
      unlocked_images: state.unlockedImages,
      affinities: state.affinities,
      encountered_npcs: state.encounteredNPCs,
    }).eq('user_id', state.userId)
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
