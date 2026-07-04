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
]

export function getGalleryImage(id) {
  return GALLERY_IMAGES.find((img) => img.id === id) ?? null
}
