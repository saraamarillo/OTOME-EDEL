import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import styles from './LoginScreen.module.css'

export default function LoginScreen() {
  const login = useGameStore((s) => s.login)
  const setScreen = useGameStore((s) => s.setScreen)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = login(username, password)
    setLoading(false)
    if (result === 'empty')     setError('Introduce tu nombre y contraseña.')
    else if (result === 'not_found')  setError('Usuario no reconocido. Comprueba el nombre.')
    else if (result === 'pass_error') setError('Contraseña incorrecta.')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.logo}>EDEL</h1>
        <p className={styles.tagline}>Entre Desvelo y Ensueño Latente</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nombre</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de jugadora"
              autoComplete="username"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? '...' : 'Entrar'}
          </button>
        </form>

        <p className={styles.hint}>
          Introduce tu nombre tal como te lo han dado y tu contraseña personal.
        </p>

        <button className={styles.back} onClick={() => setScreen('title')}>
          ← Volver
        </button>
      </div>
    </div>
  )
}
