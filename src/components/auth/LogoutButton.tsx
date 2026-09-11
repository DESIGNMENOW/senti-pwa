import { useNavigate } from '@tanstack/react-router'
import { logout } from '@/lib/auth'

export function LogoutButton() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()

    void navigate({
      to: '/login',
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      Abmelden
    </button>
  )
}
