/**
 * Localizaciones del juego con sus backgrounds disponibles.
 * El campo `background` es el nombre sin extensión de /assets/backgrounds/.
 */
export const LOCATIONS = [
  // ── Lote 1 — disponibles ──────────────────────────────────
  {
    id: 'campus',
    name: 'Universidad Somnia — Campus',
    backgrounds: {
      dia:   'campus_dia',
      noche: 'campus_noche',
    },
  },
  {
    id: 'piso',
    name: 'Piso franco — Salón',
    backgrounds: {
      noche: 'piso_salon',
    },
  },
  {
    id: 'residencia',
    name: 'Residencia universitaria — Habitación',
    backgrounds: {
      dia:   'residencia_habitacion_dia',
      noche: 'residencia_habitacion_noche',
    },
  },
  {
    id: 'club_paranormal',
    name: 'Club Paranormal',
    backgrounds: {
      noche: 'club_paranormal',
    },
  },
  {
    id: 'cafeteria_universidad',
    name: 'Cafetería Somnia',
    backgrounds: {
      dia: 'cafeteria_universidad',
    },
  },
  {
    id: 'cafe_lotus',
    name: 'Café Lotus',
    note: 'Regentado por Lucas',
    backgrounds: {
      dia: 'cafe_lotus',
    },
  },
  {
    id: 'bar_ryan',
    name: 'Bar de Ryan',
    backgrounds: {
      noche: 'bar_ryan',
    },
  },
  {
    id: 'secretaria',
    name: 'Secretaría — Universidad Somnia',
    backgrounds: {
      dia: 'secretaria',
    },
  },

  // ── Lote 2 — disponibles ─────────────────────────────────
  {
    id: 'astraea_pasillo',
    name: 'Astraea — Pasillo',
    backgrounds: { noche: 'astraea_pasillo' },
  },
  {
    id: 'astraea_hall',
    name: 'Astraea — Hall central',
    backgrounds: { noche: 'astraea_hall' },
  },
  {
    id: 'casino_xavier',
    name: 'Casino de Xavier',
    backgrounds: { noche: 'casino_xavier' },
  },
  {
    id: 'discoteca',
    name: 'Discoteca',
    backgrounds: { noche: 'discoteca' },
  },
  {
    id: 'disonancia',
    name: 'Disonancia — Calle Guadalajara',
    note: 'Dimensión alternativa con glitch violeta',
    backgrounds: { noche: 'disonancia' },
  },

  {
    id: 'azotea',
    name: 'Azotea — Edificio',
    note: 'Persecución Maven/Ryan',
    backgrounds: { noche: 'azotea_noche' },
  },
  {
    id: 'fabrica',
    name: 'Fábrica de harina abandonada',
    backgrounds: {
      dia:   'fabrica_exterior_dia',
    },
  },
  {
    id: 'fuerte',
    name: 'Fuerte de San Francisco',
    backgrounds: { noche: 'fuerte_san_francisco' },
  },
  {
    id: 'astraea_gimnasio',
    name: 'Astraea — Gimnasio',
    backgrounds: { dia: 'astraea_gimnasio' },
  },
  {
    id: 'astraea_habitacion',
    name: 'Astraea — Habitación (D4)',
    backgrounds: { noche: 'astraea_habitacion' },
  },

  {
    id: 'astraea_laboratorio',
    name: 'Astraea — Laboratorio',
    note: 'Esfera de estabilidad dimensional',
    backgrounds: { noche: 'astraea_laboratorio' },
  },
  {
    id: 'mansion_mendoza',
    name: 'Mansión Mendoza — Disonancia',
    note: 'Versión alternativa gótica, cielo rojo',
    backgrounds: { noche: 'mansion_mendoza' },
  },
  {
    id: 'oraculo',
    name: 'Oráculo de Delfos',
    backgrounds: { dia: 'oraculo_delfos' },
  },
  {
    id: 'palacio_infantado',
    name: 'Palacio del Infantado',
    backgrounds: { dia: 'palacio_infantado' },
  },
  {
    id: 'astraea_enfermeria',
    name: 'Astraea — Enfermería',
    backgrounds: { dia: 'astraea_enfermeria' },
  },

  {
    id: 'astraea_cafeteria',
    name: 'Astraea — Cafetería',
    backgrounds: { dia: 'astraea_cafeteria' },
  },
  {
    id: 'comisaria',
    name: 'Comisaría — Policía Nacional',
    backgrounds: { dia: 'comisaria' },
  },

  // ── Lote 3 — disponibles ─────────────────────────────────
  {
    id: 'casa_ryan',
    name: 'Casa de Ryan',
    backgrounds: { dia: 'casa_ryan' },
  },
  {
    id: 'casa_soledad',
    name: 'Casa de Soledad',
    backgrounds: { dia: 'casa_soledad' },
  },
  {
    id: 'casa_maven',
    name: 'Casa de Maven',
    backgrounds: { dia: 'casa_maven' },
  },
  {
    id: 'mirador',
    name: 'Mirador',
    backgrounds: { dia: 'mirador' },
  },
  {
    id: 'fabrica_interior',
    name: 'Fábrica de harina — Interior',
    backgrounds: { dia: 'fabrica_interior' },
  },

  {
    id: 'sosiego_alcantarilla',
    name: 'El Sosiego — Alcantarilla',
    note: 'Plano alternativo, tiempo congelado',
    backgrounds: { noche: 'sosiego_alcantarilla' },
  },
  {
    id: 'sosiego_arbol',
    name: 'El Sosiego — Sala del Árbol',
    note: 'Ethan y Soledad quedan moribundos aquí — sesión 17',
    backgrounds: { noche: 'sosiego_arbol' },
  },
]

/** Devuelve el background id para una localización y momento del día. */
export function getBackground(locationId, time = 'dia') {
  const loc = LOCATIONS.find((l) => l.id === locationId)
  if (!loc) return null
  return loc.backgrounds[time] ?? Object.values(loc.backgrounds)[0] ?? null
}
