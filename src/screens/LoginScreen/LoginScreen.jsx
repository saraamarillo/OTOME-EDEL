import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import styles from './LoginScreen.module.css'

export default function LoginScreen() {
  const login = useGameStore((s) => s.login)
  const loginAsGuest = useGameStore((s) => s.loginAsGuest)
  const setScreen = useGameStore((s) => s.setScreen)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = login(username, password)

    if (result.status === 'empty') {
      setError('Introduce tu nombre de usuario y contraseña.')
    } else if (result.status === 'error') {
      setError(result.message)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.logo}>EDEL</h1>
        <p className={styles.tagline}>Entre Desvelo y Ensueño Latente</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nombre de usuario</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
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
          <button className={styles.btn} type="submit">
            Entrar
          </button>
        </form>

        <button className={styles.back} onClick={loginAsGuest}>
          Jugar como invitada
        </button>

        <button className={styles.back} onClick={() => setScreen('title')}>
          ← Volver
        </button>
      </div>
    </div>
  )
}
