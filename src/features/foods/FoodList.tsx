import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BackToDashboard } from '#/components/BackToDashboard'


import {
  deleteFood,
  getFoods,
  type Food,
} from './api'

import {
  FOOD_CATEGORIES,
  FOOD_UNITS,
} from './food-types'

function getCategoryLabel(
  value: string,
) {
  return (
    FOOD_CATEGORIES.find(
      (item) => item.value === value,
    )?.label ?? value
  )
}

function getUnitLabel(
  value: string,
) {
  return (
    FOOD_UNITS.find(
      (item) => item.value === value,
    )?.label ?? value
  )
}

export function FoodList() {
  const [foods, setFoods] =
    useState<Food[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  async function loadFoods() {
    try {
      setLoading(true)
      setError('')

      const result =
        await getFoods()

      setFoods(result)
    } catch (error) {
      console.error(error)

      setError(
        'Die Lebensmittel konnten nicht geladen werden.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFoods()
  }, [])

  async function handleDelete(
    food: Food,
  ) {
    const confirmed =
      window.confirm(
        `„${food.name}“ wirklich löschen?`,
      )

    if (!confirmed) {
      return
    }

    try {
      await deleteFood(food.id)

      setFoods((current) =>
        current.filter(
          (item) =>
            item.id !== food.id,
        ),
      )
    } catch (error) {
      console.error(error)

      setError(
        'Das Lebensmittel konnte nicht gelöscht werden.',
      )
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-sm text-muted-foreground">
        Lebensmittel werden geladen …
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
            <h1 className="text-2xl font-semibold">
            Lebensmittel
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
            {foods.length}{' '}
            {foods.length === 1
                ? 'Lebensmittel'
                : 'Lebensmittel'}{' '}
            vorhanden
            </p>
        </div>

        <div className="flex flex-wrap gap-2">
            <BackToDashboard />

            <Link
            to="/food/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
            + Neues Lebensmittel
            </Link>
        </div>
        </div>


      {foods.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">
            Noch keine Lebensmittel
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Lege dein erstes Lebensmittel an.
          </p>

          <Link
            to="/food/new"
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Neues Lebensmittel
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">
                  Name
                </th>

                <th className="px-4 py-3 font-medium">
                  Marke
                </th>

                <th className="px-4 py-3 font-medium">
                  Kategorie
                </th>

                <th className="px-4 py-3 font-medium">
                  Einheit
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Aktionen
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {foods.map((food) => (
                <tr
                  key={food.id}
                  className="hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {food.name}
                    </div>

                    {food.barcode && (
                      <div className="text-xs text-muted-foreground">
                        EAN: {food.barcode}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {food.brand || '—'}
                  </td>

                  <td className="px-4 py-3">
                    {getCategoryLabel(
                      food.category,
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {getUnitLabel(
                      food.default_unit,
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {food.active ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        Aktiv
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                        Inaktiv
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to="/food/$id/edit"
                        params={{
                          id: food.id,
                        }}
                        className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        Bearbeiten
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          void handleDelete(
                            food,
                          )
                        }
                        className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
