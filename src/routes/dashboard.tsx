import {
  createFileRoute,
  Link,
  redirect,
} from '@tanstack/react-router'

import {
  getCurrentUser,
  isAuthenticated,
} from '#/lib/auth'

import { LogoutButton } from '#/components/auth/LogoutButton'
import { EntryTimeline } from '#/features/entries/EntryTimeline'
import { ManagementMenu } from '#/features/dashboard/ManagementMenu'


export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
      })
    }
  },

  component: DashboardPage,
})

const quickActions = [
  {
    type: 'meal',
    title: 'Essen',
    description: 'Mahlzeit dokumentieren',
    icon: '🍽️',
  },
  {
    type: 'symptom',
    title: 'Symptom',
    description: 'Beschwerden erfassen',
    icon: '🩺',
  },
  {
    type: 'activity',
    title: 'Aktivität',
    description: 'Sport oder Bewegung',
    icon: '🏃',
  },
  {
    type: 'medication',
    title: 'Medikament',
    description: 'Medikament dokumentieren',
    icon: '💊',
  },
]

function DashboardPage() {
  const user = getCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div>
            <div className="font-semibold">
              Senti
            </div>

            <div className="text-xs text-muted-foreground">
              Personal Health Journal
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user?.name || user?.email}
            </span>
            
            <ManagementMenu />

            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold">
                Guten Tag
                {user?.name
                  ? `, ${user.name}`
                  : ''}
              </h1>

              <p className="mt-1 text-muted-foreground">
                Was möchtest du dokumentieren?
              </p>
            </div>

            <Link
              to="/entry/new"
              className="inline-flex w-fit cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              + Neuer Eintrag
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.type}
              to="/entry/new"
              search={{
                type: action.type,
              }}
              className="block cursor-pointer rounded-xl border bg-card p-5 text-left no-underline transition-all hover:border-primary hover:bg-muted hover:shadow-sm"
            >
              <div className="text-2xl">
                {action.icon}
              </div>

              <div className="mt-4 font-medium text-foreground">
                {action.title}
              </div>

              <div className="mt-1 text-sm text-muted-foreground">
                {action.description}
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-lg font-semibold">
                Deine letzten Einträge
              </h2>

              <p className="text-sm text-muted-foreground">
                Was heute und zuletzt passiert ist.
              </p>
            </div>

            <Link
              to="/entry/new"
              className="text-sm text-primary hover:underline"
            >
              Neuer Eintrag
            </Link>
          </div>

          <EntryTimeline />
        </section>
      </main>
    </div>
  )
}
