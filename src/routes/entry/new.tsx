import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router'

import { isAuthenticated } from '#/lib/auth'
import { EntryForm } from '#/features/entries/EntryForm'

export const Route = createFileRoute('/entry/new')({
  validateSearch: (
    search: Record<string, unknown>,
  ) => ({
    type:
      typeof search.type === 'string'
        ? search.type
        : undefined,
  }),

  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
      })
    }
  },

  component: NewEntryPage,
})

function NewEntryPage() {
  const { type } = Route.useSearch()

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <EntryForm initialType={type} />
    </main>
  )
}
