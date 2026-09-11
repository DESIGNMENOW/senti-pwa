import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { login } from '@/lib/auth'

export function LoginForm() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await login(email, password)

      await navigate({
        to: '/dashboard',
      })
    } catch {
      setError('E-Mail oder Passwort ist nicht korrekt.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-5"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Willkommen bei Senti
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Melde dich an, um deine persönlichen Daten zu verwalten.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          E-Mail
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium"
        >
          Passwort
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {loading ? 'Anmelden …' : 'Anmelden'}
      </button>
    </form>
  )
}
