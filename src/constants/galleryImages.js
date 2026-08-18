export const GALLERY_IMAGES = [
  {
    id: 'ethan_cafeteria_soledad',
    file: 'gallery_soledad/gallery_Soledad_1-1.png',
    title: 'La cafetería',
    subtitle: 'con Ethan',
    routes: ['soledad'],
    episode: 1,
  },
  {
    id: 'ryan_crucigrama',
    file: 'gallery_soledad/gallery_Soledad_1-2.png',
    title: 'El crucigrama',
    subtitle: 'con Ryan',
    routes: ['soledad'],
    episode: 1,
  },
  {
    id: 'ryan_cafe_soledad',
    file: 'gallery_soledad/gallery_Soledad_2-1.png',
    title: 'El café',
    subtitle: 'con Ryan',
    routes: ['soledad'],
    episode: 2,
  },
  {
    id: 'ryan_moto_parada',
    file: 'gallery_soledad/gallery_Soledad_2-2.png',
    title: 'Parada en moto',
    subtitle: 'con Ryan',
    routes: ['soledad'],
    episode: 2,
  },
  {
    id: 'ethan_cafeteria_ayla',
    file: 'gallery_ayla/gallery_Ayla_1-1.png',
    title: 'La cafetería',
    subtitle: 'con Ethan',
    routes: ['ayla'],
    episode: 1,
  },
  {
    id: 'lydia_plantas',
    file: 'gallery_ayla/gallery_Ayla_1-2.png',
    title: 'Las plantas',
    subtitle: 'con Lydia',
    routes: ['ayla'],
    episode: 1,
  },
  {
    id: 'lydia_ayla_desayuno',
    file: 'gallery_ayla/gallery_Ayla_2-1.png',
    title: 'Desayuno con Lydia',
    subtitle: 'en la residencia',
    routes: ['ayla'],
    episode: 2,
  },
  {
    id: 'frey_ayla_rescate',
    file: 'gallery_ayla/gallery_Ayla_2-2.png',
    title: 'El rescate',
    subtitle: 'con Frey',
    routes: ['ayla'],
    episode: 2,
  },
]

export function getGalleryImage(id) {
  return GALLERY_IMAGES.find((img) => img.id === id) ?? null
}
