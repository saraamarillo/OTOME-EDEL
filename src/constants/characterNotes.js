/**
 * Notas del diario de Soledad sobre cada personaje: una frase en primera
 * persona de cómo lo ve o qué significa para ella, que evoluciona con la
 * afinidad (0–100). Se muestra en su pantalla de Personajes.
 */
export const SOLEDAD_NOTES = {
  ayla: [
    { min: 0,  text: 'Tranquila hasta un punto sospechoso. No la conozco de nada y ya me ha metido en más líos que cualquiera en mucho tiempo.' },
    { min: 40, text: 'Puede que persiga misterios sin pensarlo dos veces, pero cuando las cosas se complican, ninguna de las dos suelta a la otra.' },
    { min: 70, text: 'La conozco desde hace apenas unos días y ya la siento como una compañera de verdad — de las que no se van aunque todo se ponga raro.' },
  ],
  ethan: [
    { min: 0,  text: 'Demasiado entusiasta para mi gusto. Todavía no sé si lo que me da es ternura o cansancio.' },
    { min: 40, text: 'Es más sincero de lo que parece. Ese entusiasmo no es un acto, y eso, aunque me cueste admitirlo, empieza a gustarme.' },
    { min: 70, text: 'Ha dejado de ser «el chico raro del club». Ahora es alguien por quien me preocupo de verdad, aunque él no lo sepa.' },
  ],
  ryan: [
    { min: 0,  text: 'Un desconocido que me dejó su cama sin pedir nada a cambio. No sé todavía qué hacer con eso.' },
    { min: 40, text: 'Cada vez que aparece, las cosas se sienten menos solas. No sé si fiarme tan rápido es sensato, pero con él me sale sin pensarlo.' },
    { min: 70, text: 'Se quedó esperando a que subiera al autobús sin decírmelo. Creo que ya no puedo fingir que esto es solo gratitud.' },
  ],
}

/** Devuelve la frase que corresponde al nivel de afinidad actual (0–100), o null si no hay notas para ese personaje. */
export function getSoledadNote(characterId, affinityPct) {
  const tiers = SOLEDAD_NOTES[characterId]
  if (!tiers) return null
  let note = tiers[0].text
  for (const tier of tiers) {
    if (affinityPct >= tier.min) note = tier.text
  }
  return note
}
