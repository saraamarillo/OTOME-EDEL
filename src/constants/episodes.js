export const TOTAL_EPISODES = 20
export const AVAILABLE_EPISODES = [1, 2]

/** Metadata y escena de inicio por episodio, por protagonista. */
export const EPISODES = {
  1: {
    title: 'Nueva Etapa Universitaria',
    synopsis: {
      soledad: 'He vuelto a la Universidad Somnia decidida a pasar desapercibida. En secretaría me han apuntado, sin preguntar, al único club que quedaba libre. Al menos no voy sola.',
      ayla: 'Nuevo campus, nueva ciudad, otra oportunidad para pasar desapercibida. El club de fotografía tenía lista de espera, y en secretaría no me han dejado elegir: el único con plazas es el Club Paranormal. Allí he conocido a Soledad, y a Ethan, que se ha alegrado más de lo esperado de tenernos cerca.',
    },
    firstScene: {
      soledad: 'sol_scene_01_campus',
      ayla:    'ayla_scene_01_campus',
      maven:   'scene_01_campus',
    },
  },
  2: {
    title: 'Todo se complica',
    synopsis: {
      soledad: 'Me quedé sin luz, sin llaves y sin batería… y acabé durmiendo en casa de un desconocido que resultó no serlo tanto. Lo que debía ser un día tranquilo se torció rápido, y antes de anochecer ya estaba metida en algo que no esperaba.',
      ayla: 'Debía ser un día de visitas guiadas y té con Lydia, pero encontré un artículo sobre unos accidentes que nadie en el Club Paranormal quiere explicar. Después seguí a una chica que nadie más parecía ver, hasta quedarme encerrada sola en una fábrica abandonada. Y entonces apareció Frey, de un sitio que no debería existir, con un secreto que ahora también es mío.',
    },
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

export function getSynopsis(epNum, protagonistId) {
  return EPISODES[epNum]?.synopsis?.[protagonistId] ?? ''
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
