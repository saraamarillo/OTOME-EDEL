/**
 * Personajes jugables (protagonistas).
 * Cada uno tiene un id, nombre, descripción y ruta a su avatar.
 */
export const PROTAGONISTS = [
  {
    id: 'soledad',
    name: 'Soledad Ramírez',
    description: 'Joven de apariencia tranquila que retoma sus estudios en la Universidad Somnia. Observa más de lo que deja ver.',
    avatar: '/assets/avatars/soledad_avatar.png',
    color: 'var(--color-soledad)',
    available: true,
    looks: [
      { id: 'arc1', description: 'Pelo largo castaño', episodes: '1–13' },
      { id: 'arc2', description: 'Pelo corto (se lo corta en ep. 14)', episodes: '14+' },
    ],
  },
  {
    id: 'ayla',
    name: 'Ayla Solberg',
    description: 'Estudiante de arte y arqueología. Porte elegante, mirada serena y un ligero acento nórdico.',
    avatar: '/assets/avatars/ayla_avatar.png',
    color: 'var(--color-ayla)',
    available: true,
  },
  {
    id: 'maven',
    name: 'Maven',
    description: '???',
    avatar: '/assets/avatars/maven_avarar.png',
    color: 'var(--color-maven)',
    available: false,
  },
]

/**
 * Personajes NPC con los que se puede subir afinidad.
 * Las expresiones disponibles por personaje se listan en sus
 * carpetas de sprites: /assets/sprites/<id>/<expression>.png
 */
export const NPC_CHARACTERS = [
  {
    id: 'ethan',
    name: 'Ethan',
    role: 'Líder del Club Paranormal',
    color: 'var(--color-ethan)',
    expressions: ['neutral', 'happy', 'serious', 'surprised', 'cold'],
    looks: [
      { id: 'arc1', description: 'Pelo azul azabache', episodes: '1–12' },
      { id: 'arc2', description: 'Pelo negro (cambio de look ep. 13)', episodes: '13+' },
    ],
  },
  {
    id: 'ryan',
    name: 'Ryan',
    role: 'Trabajador de bar',
    color: 'var(--color-ryan)',
    expressions: ['neutral', 'happy', 'shy', 'worried', 'amused'],
  },
  {
    id: 'lydia',
    name: 'Lydia',
    role: 'Compañera de cuarto de Ayla',
    color: 'var(--color-lydia)',
    expressions: ['neutral', 'happy', 'curious', 'annoyed'],
  },
  {
    id: 'frey',
    name: 'Frey',
    role: 'Policía',
    color: 'var(--color-frey)',
    expressions: ['neutral', 'happy', 'serious', 'suspicious', 'distant'],
  },
  {
    id: 'grace',
    name: 'Grace',
    role: 'Miembro del Club Paranormal',
    color: 'var(--color-grace)',
    expressions: ['neutral', 'happy', 'worried', 'cheerful'],
  },
  {
    id: 'sappire',
    name: 'Sappire',
    role: 'Compañera de cuarto de Maven',
    color: 'var(--color-sappire)',
    expressions: ['neutral', 'happy', 'curious', 'worried'],
  },
  {
    id: 'xavier',
    name: 'Xavier de Crimson',
    role: '???',
    color: 'var(--color-xavier)',
    expressions: ['neutral', 'cold', 'serious', 'threatening'],
  },
  {
    id: 'luna',
    name: 'Luna',
    role: 'Astraea',
    color: 'var(--color-luna)',
    expressions: ['neutral', 'cold', 'serious', 'commanding'],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    role: '???',
    color: 'var(--color-aurora)',
    expressions: ['neutral', 'cold', 'serious', 'distant'],
  },
  {
    id: 'dani',
    name: 'Dani',
    role: '???',
    color: 'var(--color-dani)',
    expressions: ['neutral', 'happy', 'surprised', 'calm'],
  },
  {
    id: 'estrella',
    name: 'Estrella',
    role: '???',
    color: 'var(--color-estrella)',
    expressions: ['neutral', 'happy', 'flirty', 'serious'],
  },
  {
    id: 'leo',
    name: 'Leo',
    role: '???',
    color: 'var(--color-leo)',
    expressions: ['neutral', 'amused', 'smug', 'serious'],
  },
  {
    id: 'noa',
    name: 'Noa',
    role: 'Abre portales — compañero de Frey',
    color: 'var(--color-noa)',
    expressions: ['neutral', 'serious', 'focused', 'scared'],
    isChild: true,
  },
  {
    id: 'ona',
    name: 'Ona',
    role: 'Facción de Erebo',
    color: 'var(--color-ona)',
    expressions: ['neutral', 'cold', 'threatening', 'amused'],
  },
  {
    id: 'apolo',
    name: 'Apolo',
    role: 'Dios — solo perceptible por Soledad',
    color: 'var(--color-apolo)',
    expressions: ['neutral', 'wise', 'amused', 'serious'],
    protagonistOnly: 'soledad',  // no aparece en rutas de Ayla ni Maven
    spriteSize: 'small',         // criatura pequeña, escala reducida en pantalla
  },
]
