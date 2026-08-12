export const GALLERY_IMAGES = [
  {
    id: 'ethan_cafeteria',
    title: 'La cafetería',
    subtitle: 'con Ethan',
    routes: ['soledad', 'ayla'],
    episode: 1,
  },
  {
    id: 'ryan_crucigrama',
    title: 'El crucigrama',
    subtitle: 'con Ryan',
    routes: ['soledad'],
    episode: 1,
  },
  {
    id: 'lydia_plantas',
    title: 'Las plantas',
    subtitle: 'con Lydia',
    routes: ['ayla'],
    episode: 1,
  },
  {
    id: 'lydia_ayla_desayuno',
    title: 'Desayuno con Lydia',
    subtitle: 'en la residencia',
    routes: ['ayla'],
    episode: 2,
  },
  {
    id: 'frey_ayla_rescate',
    title: 'El rescate',
    subtitle: 'con Frey',
    routes: ['ayla'],
    episode: 2,
  },
  {
    id: 'ryan_cafe_soledad',
    title: 'El café',
    subtitle: 'con Ryan',
    routes: ['soledad'],
    episode: 2,
  },
  {
    id: 'ryan_moto_parada',
    title: 'Parada en moto',
    subtitle: 'con Ryan',
    routes: ['soledad'],
    episode: 2,
  },
]

export function getGalleryImage(id) {
  return GALLERY_IMAGES.find((img) => img.id === id) ?? null
}
