import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import { useNavigate } from '@tanstack/react-router'

import {
  createFood,
  getFood,
  updateFood,
  type FoodCategory,
  type FoodUnit,
} from './api'

import {
  FOOD_CATEGORIES,
  FOOD_UNITS,
} from './food-types'

interface FoodFormProps {
  foodId?: string
}

export function FoodForm({
  foodId,
}: FoodFormProps) {
  const navigate = useNavigate()

  const isEditMode = Boolean(foodId)

  const [name, setName] =
    useState('')

  const [brand, setBrand] =
    useState('')

  const [barcode, setBarcode] =
    useState('')

  const [category, setCategory] =
    useState<FoodCategory>('other')

  const [defaultUnit, setDefaultUnit] =
    useState<FoodUnit>('g')

  const [notes, setNotes] =
    useState('')

  const [active, setActive] =
    useState(true)

  const [loading, setLoading] =
    useState(isEditMode)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
  if (!foodId) {
    return
  }

  const id = foodId

  let cancelled = false

  async function loadFood() {
    try {
      setLoading(true)
      setError('')

      const food = await getFood(id)

      if (cancelled) {
        return
      }

      setName(food.name)
      setBrand(food.brand ?? '')
      setBarcode(food.barcode ?? '')
      setCategory(food.category)
      setDefaultUnit(food.default_unit)
      setNotes(food.notes ?? '')
      setActive(food.active)
    } catch (error) {
      console.error(
        '[FoodForm] Laden fehlgeschlagen:',
        error,
      )

      if (!cancelled) {
        setError(
          'Das Lebensmittel konnte nicht geladen werden.',
        )
      }
    } finally {
      if (!cancelled) {
        setLoading(false)
      }
    }
  }

  void loadFood()

  return () => {
    cancelled = true
  }
}, [foodId])


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')

    if (!name.trim()) {
      setError(
        'Bitte einen Namen eingeben.',
      )
      return
    }

    setSaving(true)

    try {
      const input = {
        name,
        brand,
        barcode,
        category,
        default_unit: defaultUnit,
        notes,
        active,
      }

      if (foodId) {
        await updateFood(
          foodId,
          input,
        )
      } else {
        await createFood(input)
      }

      await navigate({
        to: '/foods',
      })
    } catch (error) {
      console.error(
        '[FoodForm] Speichern fehlgeschlagen:',
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : isEditMode
            ? 'Das Lebensmittel konnte nicht geändert werden.'
            : 'Das Lebensmittel konnte nicht gespeichert werden.',
      )
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    void navigate({
      to: '/foods',
    })
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="py-12 text-center text-sm text-muted-foreground">
          Lebensmittel wird geladen …
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold">
          {isEditMode
            ? 'Lebensmittel bearbeiten'
            : 'Lebensmittel anlegen'}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {isEditMode
            ? 'Ändere die Angaben zu diesem Lebensmittel.'
            : 'Lege ein Lebensmittel für die spätere Erfassung von Mahlzeiten an.'}
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

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">
          Grunddaten
        </h2>

        <div className="space-y-2">
          <label
            htmlFor="food-name"
            className="text-sm font-medium"
          >
            Name
          </label>

          <input
            id="food-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="z. B. Haferflocken"
            required
            autoFocus
            disabled={saving}
            className="w-full rounded-md border bg-background px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="food-brand"
            className="text-sm font-medium"
          >
            Marke
          </label>

          <input
            id="food-brand"
            type="text"
            value={brand}
            onChange={(event) =>
              setBrand(event.target.value)
            }
            placeholder="optional"
            disabled={saving}
            className="w-full rounded-md border bg-background px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="food-barcode"
            className="text-sm font-medium"
          >
            Barcode / EAN
          </label>

          <input
            id="food-barcode"
            type="text"
            inputMode="numeric"
            value={barcode}
            onChange={(event) =>
              setBarcode(event.target.value)
            }
            placeholder="optional"
            disabled={saving}
            className="w-full rounded-md border bg-background px-3 py-2"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">
          Einordnung
        </h2>

        <div className="space-y-2">
          <label
            htmlFor="food-category"
            className="text-sm font-medium"
          >
            Kategorie
          </label>

          <select
            id="food-category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target
                  .value as FoodCategory,
              )
            }
            disabled={saving}
            className="w-full rounded-md border bg-background px-3 py-2"
          >
            {FOOD_CATEGORIES.map(
              (item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="food-unit"
            className="text-sm font-medium"
          >
            Standard-Einheit
          </label>

          <select
            id="food-unit"
            value={defaultUnit}
            onChange={(event) =>
              setDefaultUnit(
                event.target
                  .value as FoodUnit,
              )
            }
            disabled={saving}
            className="w-full rounded-md border bg-background px-3 py-2"
          >
            {FOOD_UNITS.map(
              (item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ),
            )}
          </select>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">
          Weitere Angaben
        </h2>

        <div className="space-y-2">
          <label
            htmlFor="food-notes"
            className="text-sm font-medium"
          >
            Notizen
          </label>

          <textarea
            id="food-notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={4}
            placeholder="z. B. Bio, besondere Sorte, weitere Informationen …"
            disabled={saving}
            className="w-full resize-none rounded-md border bg-background px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) =>
              setActive(
                event.target.checked,
              )
            }
            disabled={saving}
            className="h-4 w-4"
          />

          <span>
            Lebensmittel ist aktiv
          </span>
        </label>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? 'Speichern …'
            : isEditMode
              ? 'Änderungen speichern'
              : 'Lebensmittel speichern'}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={handleCancel}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          Abbrechen
        </button>
      </div>
    </form>
  )
}
