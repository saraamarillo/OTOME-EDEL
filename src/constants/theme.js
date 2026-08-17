/** Tono clarito del color de énfasis de cada protagonista (nube de pensamiento, acentos). */
export const ROUTE_TINT = {
  soledad: '#fbe7c4',
  ayla: '#cdeedb',
  maven: '#d7deec',
}

/**
 * Identidad visual de cada ruta para los menús (Landing, Personajes, Galería,
 * Episodios, selección/fin de episodio): Ayla es una cámara de fotos
 * (visor oscuro, HUD en monoespaciada), Soledad es un diario escrito a mano
 * (papel rayado cálido, tipografía manuscrita).
 */
export const ROUTE_THEME = {
  ayla: {
    mode: 'camara',
    bg: '#101314',
    surface: '#181c1d',
    surfaceSoft: 'rgba(255,255,255,0.05)',
    ink: '#f3f6f4',
    inkSoft: '#cfe6d8',
    muted: 'rgba(255,255,255,0.7)',
    border: 'rgba(255,255,255,0.3)',
    gridLine: 'rgba(255,255,255,0.14)',
    accent: '#8fe3a8',
    accentSoft: 'rgba(143,227,168,0.14)',
    fontHeading: "'Space Mono', monospace",
    fontBody: "'Gelasio', serif",
    fontUI: "'Space Mono', monospace",
  },
  soledad: {
    mode: 'diario',
    bg: 'linear-gradient(180deg,#fbf5e6,#f6ecd8)',
    surface: '#fdf8ee',
    surfaceSoft: '#fffdf8',
    ink: '#4a3620',
    inkSoft: '#6a5236',
    muted: 'rgba(122,90,52,0.6)',
    border: 'rgba(122,90,52,0.32)',
    ruledLine: 'rgba(150,110,60,0.14)',
    marginLine: 'rgba(196,90,90,0.32)',
    accent: '#e38e1f',
    accentSoft: 'rgba(224,149,46,0.14)',
    fontHeading: "'Caveat', cursive",
    fontBody: "'Gelasio', serif",
    fontUI: "'Caveat', cursive",
  },
}
