import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import styles from './LoginScreen.module.css'

export default function LoginScreen() {
  const login = useGameStore((s) => s.login)
  const signUp = useGameStore((s) => s.signUp)
  const setScreen = useGameStore((s) => s.setScreen)
  const [mode, setMode] = useState('login')   // 'login' | 'signup'
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const isSignup = mode === 'signup'

  function toggleMode() {
    setMode(isSignup ? 'login' : 'signup')
    setError('')
    setInfo('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    const result = isSignup
      ? await signUp(email, password, displayName)
      : await login(email, password)
    setLoading(false)

    if (result.status === 'empty') {
      setError(isSignup ? 'Rellena tu nombre, email y contraseña.' : 'Introduce tu email y contraseña.')
    } else if (result.status === 'error') {
      setError(traducirError(result.message))
    } else if (result.status === 'confirm_email') {
      setInfo('Te hemos enviado un correo de confirmación. Confírmalo y luego inicia sesión.')
      setMode('login')
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.logo}>EDEL</h1>
        <p className={styles.tagline}>Entre Desvelo y Ensueño Latente</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isSignup && (
            <div className={styles.field}>
              <label className={styles.label}>Nombre</label>
              <input
                className={styles.input}
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Cómo quieres que te llamemos"
                autoComplete="nickname"
              />
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
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
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {info && <p className={styles.hint}>{info}</p>}
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? '...' : isSignup ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <button className={styles.back} onClick={toggleMode}>
          {isSignup ? '¿Ya tienes cuenta? Inicia sesión' : '¿Primera vez? Crea tu cuenta'}
        </button>

        <button className={styles.back} onClick={() => setScreen('title')}>
          ← Volver
        </button>
      </div>
    </div>
  )
}

function traducirError(message) {
  if (!message) return 'Algo ha ido mal. Inténtalo de nuevo.'
  if (message.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.'
  if (message.includes('User already registered')) return 'Ya existe una cuenta con ese email.'
  if (message.includes('Password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.'
  return message
}
