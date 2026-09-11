import { Link } from '@tanstack/react-router'

interface BackToDashboardProps {
  label?: string
}

export function BackToDashboard({
  label = 'Dashboard',
}: BackToDashboardProps) {
  return (
    <Link
      to="/dashboard"
      className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
    >
      <span aria-hidden="true">
        ←
      </span>

      {label}
    </Link>
  )
}
