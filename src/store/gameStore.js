import { create } from 'zustand'
import { AFFINITY_DEFAULT, AFFINITY_MIN, AFFINITY_MAX } from '../constants/affinity'
import { NPC_CHARACTERS } from '../constants/characters'

const buildAffinityMap = () =>
  Object.fromEntries(NPC_CHARACTERS.map((c) => [c.id, AFFINITY_DEFAULT]))

const buildSaveKey = (username) => `edel:${username.toLowerCase().trim()}`

export const useGameStore = create((set, get) => ({
  // ── Sesión de usuario ────────────────────────────────────────
  userId: null,
  userName: null,
  completedEpisodes: [],

  login: (username, password) => {
    const trimmed = username.trim()
    if (!trimmed || !password) return 'empty'
    const key = buildSaveKey(trimmed)
    const raw = localStorage.getItem(key)
    if (raw) {
      const save = JSON.parse(raw)
      if (save.password !== password) return 'pass_error'
      set({
        userId: key,
        userName: save.displayName ?? trimmed,
        completedEpisodes: save.completedEpisodes ?? [],
        unlockedImages: save.unlockedImages ?? [],
        affinities: { ...buildAffinityMap(), ...(save.affinities ?? {}) },
        currentScreen: 'episodeList',
      })
      return 'ok'
    }
    const newSave = { displayName: trimmed, password, completedEpisodes: [], unlockedImages: [], affinities: buildAffinityMap() }
    localStorage.setItem(key, JSON.stringify(newSave))
    set({ userId: key, userName: trimmed, completedEpisodes: [], currentScreen: 'episodeList' })
    return 'new'
  },

  logout: () => set({
    userId: null, userName: null, completedEpisodes: [],
    currentScreen: 'title',
    protagonistId: null, sceneId: null, nodeIndex: 0,
    activeCharacterId: null, backgroundId: null,
    affinities: buildAffinityMap(), characterLooks: {},
    visitedScenes: [], unlockedImages: [], imageReveal: null,
  }),

  completeEpisode: (epNum) => {
    const state = get()
    const updated = state.completedEpisodes.includes(epNum)
      ? state.completedEpisodes
      : [...state.completedEpisodes, epNum]
    set({ completedEpisodes: updated })
    if (state.userId) {
      const raw = localStorage.getItem(state.userId)
      const save = raw ? JSON.parse(raw) : {}
      localStorage.setItem(state.userId, JSON.stringify({
        ...save,
        completedEpisodes: updated,
        unlockedImages: get().unlockedImages,
        affinities: get().affinities,
      }))
    }
  },

  saveProgress: () => {
    const state = get()
    if (!state.userId) return
    const raw = localStorage.getItem(state.userId)
    const save = raw ? JSON.parse(raw) : {}
    localStorage.setItem(state.userId, JSON.stringify({
      ...save,
      completedEpisodes: state.completedEpisodes,
      unlockedImages: state.unlockedImages,
      affinities: state.affinities,
    }))
  },

  // ── Navegación ──────────────────────────────────────────────
  currentScreen: 'title',       // 'title' | 'login' | 'episodeList' | 'protagonistSelect' | 'game' | 'episodeEnd' | 'comingSoon' | 'gallery'
  setScreen: (screen) => set({ currentScreen: screen }),

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

  // ── Fondo ───────────────────────────────────────────────────
  backgroundId: null,            // nombre del PNG en /assets/backgrounds/
  setBackground: (id) => set({ backgroundId: id }),

  // ── Afinidades ──────────────────────────────────────────────
  affinities: buildAffinityMap(),
  changeAffinity: (characterId, delta) =>
    set((state) => ({
      affinities: {
        ...state.affinities,
        [characterId]: Math.min(
          AFFINITY_MAX,
          Math.max(AFFINITY_MIN, (state.affinities[characterId] ?? AFFINITY_DEFAULT) + delta),
        ),
      },
    })),
  getAffinity: (characterId) => get().affinities[characterId] ?? AFFINITY_DEFAULT,

  // ── Looks de personaje (cambian según el arco) ─────────────
  // El look 'arc1' es el predeterminado para todos
  characterLooks: {},
  setCharacterLook: (characterId, look) =>
    set((state) => ({
      characterLooks: { ...state.characterLooks, [characterId]: look },
    })),
  getCharacterLook: (characterId) => get().characterLooks[characterId] ?? 'arc1',

  // ── Historial de escenas visitadas ─────────────────────────
  visitedScenes: [],
  markSceneVisited: (sceneId) =>
    set((state) => ({
      visitedScenes: state.visitedScenes.includes(sceneId)
        ? state.visitedScenes
        : [...state.visitedScenes, sceneId],
    })),

  // ── Galería de imágenes desbloqueadas ───────────────────────
  unlockedImages: [],
  unlockImage: (imageId) =>
    set((state) => ({
      unlockedImages: state.unlockedImages.includes(imageId)
        ? state.unlockedImages
        : [...state.unlockedImages, imageId],
    })),

  // ── Imagen recién desbloqueada (muestra popup en juego) ─────
  imageReveal: null,
  setImageReveal: (imageId) => set({ imageReveal: imageId }),
  clearImageReveal: () => set({ imageReveal: null }),
}))
