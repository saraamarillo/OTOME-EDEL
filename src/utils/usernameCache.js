const KEY = 'edel:usernameEmailMap'

const normalize = (username) => username.toLowerCase().trim()

function readMap() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

/** Email recordado en este dispositivo para ese nombre de usuario, si lo hay. */
export function getCachedEmail(username) {
  return readMap()[normalize(username)] ?? null
}

/** Recuerda en este dispositivo qué email corresponde a ese nombre de usuario. */
export function cacheEmail(username, email) {
  const map = readMap()
  map[normalize(username)] = email
  localStorage.setItem(KEY, JSON.stringify(map))
}
