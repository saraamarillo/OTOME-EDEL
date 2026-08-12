export const TOTAL_EPISODES = 20
export const AVAILABLE_EPISODES = [1, 2]

/** Metadata y escena de inicio por episodio, por protagonista. */
export const EPISODES = {
  1: {
    title: 'Nueva Etapa Universitaria',
    synopsis: 'Has vuelto a la ciudad en tu último año de facultad y te reencuentras con viejos rostros. No todos te alegran por igual… y una vieja historia parece haber vuelto contigo.',
    firstScene: {
      soledad: 'sol_scene_01_campus',
      ayla:    'ayla_scene_01_campus',
      maven:   'scene_01_campus',
    },
  },
  2: {
    title: 'Todo se complica',
    synopsis: 'Os habéis separado deprisa después de esa conversación… pero esta noche vuelve a aparecer en el umbral de tu puerta. ¿Preparada para revivir la emoción de empezar otra vez?',
    firstScene: {
      soledad: 'sol_ep2',
      ayla:    'ayla_ep2',
      maven:   'maven_ep2',     // pendiente de crear
    },
  },
}

export function getFirstScene(epNum, protagonistId) {
  return EPISODES[epNum]?.firstScene?.[protagonistId] ?? 'scene_01_campus'
}

/** Portada de cada episodio: el fondo que más aparece en las escenas de esa ruta. */
export const EPISODE_COVERS = {
  default: {
    1: '/assets/backgrounds/campus_dia.png',
    2: '/assets/backgrounds/residencia_habitacion_noche.png',
  },
  soledad: {
    1: '/assets/backgrounds/campus_dia.png',
    2: '/assets/backgrounds/comisaria_tarde.png',
  },
  ayla: {
    1: '/assets/backgrounds/campus_dia.png',
    2: '/assets/backgrounds/interior_fabrica_harina.png',
  },
}
