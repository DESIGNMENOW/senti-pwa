import { useEffect, useState } from 'react'

import {
  deleteEntry,
  getEntries,
} from './api'

import type {
  EntryWithDetails,
} from './api'

import {
  getEntryTypeIcon,
  getEntryTypeLabel,
} from './entry-types'

function formatTimestamp(
  timestamp: string,
) {
  return new Intl.DateTimeFormat(
    'de-DE',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(new Date(timestamp))
}

function getMealTypeLabel(
  type?: string,
) {
  switch (type) {
    case 'breakfast':
      return 'Frühstück'

    case 'lunch':
      return 'Mittagessen'

    case 'dinner':
      return 'Abendessen'

    case 'snack':
      return 'Snack'

    case 'drink':
      return 'Getränk'

    default:
      return type ?? 'Mahlzeit'
  }
}

function getPreparationLabel(
  preparation?: string,
) {
  switch (preparation) {
    case 'raw':
      return 'Roh'

    case 'coked':
      return 'Gekocht'

    case 'fried':
      return 'Gebraten'

    case 'baked':
      return 'Gebacken'

    case 'steamed':
      return 'Gedämpft'

    case 'grilled':
      return 'Gegrillt'

    case 'other':
      return 'Sonstige'

    default:
      return preparation
  }
}

function formatQuantity(
  quantity: number,
  unit: string,
) {
  return `${quantity} ${unit}`
}

function MealDetails({
  entry,
}: {
  entry: EntryWithDetails
}) {
  const meal = entry.meal

  if (!meal) {
    return null
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Meal type */}

      <div className="text-sm font-medium">
        {getMealTypeLabel(
          meal.meal_type,
        )}
      </div>

      {/* Foods */}

      {meal.items.length > 0 && (
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="space-y-2">
            {meal.items.map(
              (item) => {
                const food =
                  item.expand?.food

                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="font-medium">
                        {food?.name ??
                          'Unbekanntes Lebensmittel'}
                      </div>

                      {food?.brand && (
                        <div className="text-xs text-muted-foreground">
                          {food.brand}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 text-right text-muted-foreground">
                      {formatQuantity(
                        item.quantity,
                        item.unit,
                      )}
                    </div>
                  </div>
                )
              },
            )}
          </div>
        </div>
      )}

      {/* Preparation */}

      {meal.items.some(
        (item) => item.preparation,
      ) && (
        <div className="flex flex-wrap gap-2">
          {meal.items
            .filter(
              (item) =>
                item.preparation,
            )
            .map((item) => (
              <span
                key={`${item.id}-preparation`}
                className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                {getPreparationLabel(
                  item.preparation,
                )}
              </span>
            ))}
        </div>
      )}

      {/* Meal notes */}

      {meal.notes && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Notiz:
          </span>{' '}
          {meal.notes}
        </div>
      )}

      {/* Individual item notes */}

      {meal.items.some(
        (item) => item.notes,
      ) && (
        <div className="space-y-1 text-sm text-muted-foreground">
          {meal.items
            .filter(
              (item) => item.notes,
            )
            .map((item) => {
              const food =
                item.expand?.food

              return (
                <div key={`${item.id}-note`}>
                  <span className="font-medium text-foreground">
                    {food?.name ??
                      'Lebensmittel'}
                    :
                  </span>{' '}
                  {item.notes}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

function GenericEntryDetails({
  entry,
}: {
  entry: EntryWithDetails
}) {
  return (
    <>
      {entry.title && (
        <h3 className="mt-1 font-medium">
          {entry.title}
        </h3>
      )}

      {entry.notes && (
        <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
          {entry.notes}
        </p>
      )}
    </>
  )
}

export function EntryTimeline() {
  const [
    entries,
    setEntries,
  ] = useState<EntryWithDetails[]>(
    [],
  )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  async function loadEntries() {
    try {
      setLoading(true)
      setError('')

      const result =
        await getEntries()

      setEntries(result)
    } catch (error) {
      console.error(error)

      setError(
        'Die Einträge konnten nicht geladen werden.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadEntries()
  }, [])

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        'Diesen Eintrag wirklich löschen?',
      )

    if (!confirmed) {
      return
    }

    try {
      await deleteEntry(id)

      setEntries((current) =>
        current.filter(
          (entry) =>
            entry.id !== id,
        ),
      )
    } catch (error) {
      console.error(error)

      setError(
        'Der Eintrag konnte nicht gelöscht werden.',
      )
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-sm text-muted-foreground">
        Einträge werden geladen …
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
      >
        {error}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <p className="font-medium">
          Noch keine Einträge
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Dokumentiere deinen ersten Eintrag.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <article
          key={entry.id}
          className="rounded-xl border bg-card p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-3">
              {/* Icon */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-2xl">
                {getEntryTypeIcon(
                  entry.type,
                )}
              </div>

              {/* Content */}

              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">
                  {getEntryTypeLabel(
                    entry.type,
                  )}
                  {' · '}
                  {formatTimestamp(
                    entry.timestamp,
                  )}
                </div>

                {entry.type ===
                'meal' ? (
                  <>
                    <h3 className="mt-1 font-medium">
                      {entry.meal
                        ?.name ||
                        entry.title ||
                        'Mahlzeit'}
                    </h3>

                    <MealDetails
                      entry={entry}
                    />
                  </>
                ) : (
                  <GenericEntryDetails
                    entry={entry}
                  />
                )}
              </div>
            </div>

            {/* Delete */}

            <button
              type="button"
              onClick={() =>
                void handleDelete(
                  entry.id,
                )
              }
              className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
            >
              Löschen
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
