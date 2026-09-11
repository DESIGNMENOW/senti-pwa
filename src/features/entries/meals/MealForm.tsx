import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import { useNavigate } from '@tanstack/react-router'

import { createMeal } from './api'
import { searchFoods } from './food-api'

import type { Food } from './food-types'

import {
  MEAL_PREPARATION_LABELS,
  MEAL_PREPARATIONS,
  MEAL_TYPES,
  MEAL_UNITS,
  MEAL_UNIT_LABELS,
  type MealPreparation,
  type MealType,
  type MealUnit,
} from './meal-types'

interface MealFormProps {
  initialType?: string
}

interface MealItemForm {
  id: string
  foodId: string
  foodName: string
  quantity: string
  unit: MealUnit
  preparation: MealPreparation
  notes: string
}

function getCurrentDateTime(): string {
  const now = new Date()

  const offset =
    now.getTimezoneOffset() * 60000

  return new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, 16)
}

function isMealType(
  value?: string,
): value is MealType {
  return MEAL_TYPES.some(
    (item) => item.value === value,
  )
}

function createEmptyItem(): MealItemForm {
  return {
    id: crypto.randomUUID(),
    foodId: '',
    foodName: '',
    quantity: '',
    unit: 'g',
    preparation: 'raw',
    notes: '',
  }
}

function getMealTitle(
  mealType: MealType,
): string {
  const type = MEAL_TYPES.find(
    (item) => item.value === mealType,
  )

  return type?.label ?? 'Mahlzeit'
}

interface FoodPickerProps {
  foods: Food[]
  selectedFoodId: string
  onSelect: (food: Food) => void
}

function FoodPicker({
  foods,
  selectedFoodId,
  onSelect,
}: FoodPickerProps) {
  return (
    <select
      value={selectedFoodId}
      onChange={(event) => {
        const food = foods.find(
          (item) =>
            item.id === event.target.value,
        )

        if (food) {
          onSelect(food)
        }
      }}
      required
      className="w-full rounded-md border bg-background px-3 py-2"
    >
      <option value="">
        Lebensmittel auswählen …
      </option>

      {foods.map((food) => (
        <option
          key={food.id}
          value={food.id}
        >
          {food.name}
          {food.brand
            ? ` – ${food.brand}`
            : ''}
        </option>
      ))}
    </select>
  )
}

export function MealForm({
  initialType,
}: MealFormProps) {
  const navigate = useNavigate()

  const [mealType, setMealType] =
    useState<MealType>(
      isMealType(initialType)
        ? initialType
        : 'breakfast',
    )

  const [timestamp, setTimestamp] =
    useState(getCurrentDateTime())

  const [foods, setFoods] =
    useState<Food[]>([])

  const [foodsLoading, setFoodsLoading] =
    useState(true)

  const [foodsError, setFoodsError] =
    useState('')

  const [items, setItems] = useState<
    MealItemForm[]
  >([createEmptyItem()])

  const [notes, setNotes] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let cancelled = false

    async function loadFoods() {
      setFoodsLoading(true)
      setFoodsError('')

      try {
        const result =
          await searchFoods()

        if (!cancelled) {
          setFoods(result)
        }
      } catch (error) {
        console.error(
          '[MealForm] Foods konnten nicht geladen werden:',
          error,
        )

        if (!cancelled) {
          setFoodsError(
            'Die Lebensmittel konnten nicht geladen werden.',
          )
        }
      } finally {
        if (!cancelled) {
          setFoodsLoading(false)
        }
      }
    }

    void loadFoods()

    return () => {
      cancelled = true
    }
  }, [])

  function updateItem(
    id: string,
    changes: Partial<MealItemForm>,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...changes,
            }
          : item,
      ),
    )
  }

  function addItem() {
    setItems((current) => [
      ...current,
      createEmptyItem(),
    ])
  }

  function removeItem(id: string) {
    setItems((current) =>
      current.length === 1
        ? current
        : current.filter(
            (item) => item.id !== id,
          ),
    )
  }

  function selectFood(
    itemId: string,
    food: Food,
  ) {
    updateItem(itemId, {
      foodId: food.id,
      foodName: food.name,
      unit: food.default_unit,
    })
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')

    if (!timestamp) {
      setError(
        'Bitte einen Zeitpunkt angeben.',
      )
      return
    }

    const invalidItem = items.find(
      (item) => !item.foodId,
    )

    if (invalidItem) {
      setError(
        'Bitte für jedes Lebensmittel einen Eintrag auswählen.',
      )
      return
    }

    const validItems = items.filter(
      (item) => item.foodId,
    )

    if (validItems.length === 0) {
      setError(
        'Bitte mindestens ein Lebensmittel hinzufügen.',
      )
      return
    }

    const invalidQuantity =
      validItems.find(
        (item) =>
          !item.quantity ||
          Number(item.quantity) <= 0,
      )

    if (invalidQuantity) {
      setError(
        'Bitte für jedes Lebensmittel eine Menge größer als 0 angeben.',
      )
      return
    }

    setLoading(true)

    try {
      await createMeal({
        timestamp: new Date(
          timestamp,
        ).toISOString(),

        mealType,

        notes: notes.trim(),

        items: validItems.map(
          (item) => ({
            foodId: item.foodId,
            quantity: Number(
              item.quantity,
            ),
            unit: item.unit,
            preparation:
              item.preparation,
            notes: item.notes.trim(),
          }),
        ),
      })

      await navigate({
        to: '/dashboard',
      })
    } catch (error) {
      console.error(
        '[MealForm] Speichern fehlgeschlagen:',
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : 'Die Mahlzeit konnte nicht gespeichert werden.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl space-y-6"
    >
      {/* Header */}

      <div>
        <h1 className="text-2xl font-semibold">
          Mahlzeit dokumentieren
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Erfasse Lebensmittel, Menge,
          Zubereitung und Zeitpunkt.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Meal information */}

      <section className="rounded-xl border p-4">
        <h2 className="mb-4 font-medium">
          Mahlzeit
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="meal-type"
              className="text-sm font-medium"
            >
              Art
            </label>

            <select
              id="meal-type"
              value={mealType}
              onChange={(event) =>
                setMealType(
                  event.target.value as MealType,
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              {MEAL_TYPES.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="timestamp"
              className="text-sm font-medium"
            >
              Zeitpunkt
            </label>

            <input
              id="timestamp"
              type="datetime-local"
              value={timestamp}
              onChange={(event) =>
                setTimestamp(
                  event.target.value,
                )
              }
              required
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>
        </div>
      </section>

      {/* Foods */}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium">
              Lebensmittel
            </h2>

            <p className="text-sm text-muted-foreground">
              Wähle die Lebensmittel aus der
              Datenbank.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            disabled={foodsLoading}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Lebensmittel
          </button>
        </div>

        {foodsLoading && (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            Lebensmittel werden geladen …
          </div>
        )}

        {foodsError && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {foodsError}
          </div>
        )}

        {!foodsLoading &&
          !foodsError &&
          foods.length === 0 && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
              Es sind noch keine aktiven
              Lebensmittel vorhanden.
            </div>
          )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl border p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">
                  Lebensmittel {index + 1}
                </span>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="text-sm text-muted-foreground hover:text-destructive"
                  >
                    Entfernen
                  </button>
                )}
              </div>

              {/* Food dropdown */}

              <div className="space-y-2">
                <label
                  htmlFor={`food-${item.id}`}
                  className="text-sm font-medium"
                >
                  Lebensmittel
                </label>

                <FoodPicker
                  foods={foods}
                  selectedFoodId={
                    item.foodId
                  }
                  onSelect={(food) =>
                    selectFood(
                      item.id,
                      food,
                    )
                  }
                />

                {item.foodId && (
                  <p className="text-xs text-muted-foreground">
                    {item.foodName}
                  </p>
                )}
              </div>

              {/* Quantity / unit */}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor={`quantity-${item.id}`}
                    className="text-sm font-medium"
                  >
                    Menge
                  </label>

                  <input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        {
                          quantity:
                            event.target
                              .value,
                        },
                      )
                    }
                    placeholder="z. B. 80"
                    required
                    className="w-full rounded-md border bg-background px-3 py-2"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`unit-${item.id}`}
                    className="text-sm font-medium"
                  >
                    Einheit
                  </label>

                  <select
                    id={`unit-${item.id}`}
                    value={item.unit}
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        {
                          unit: event.target
                            .value as MealUnit,
                        },
                      )
                    }
                    className="w-full rounded-md border bg-background px-3 py-2"
                  >
                    {MEAL_UNITS.map(
                      (unit) => (
                        <option
                          key={unit}
                          value={unit}
                        >
                          {
                            MEAL_UNIT_LABELS[
                              unit
                            ]
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* Preparation */}

              <div className="mt-4 space-y-2">
                <label
                  htmlFor={`preparation-${item.id}`}
                  className="text-sm font-medium"
                >
                  Zubereitung
                </label>

                <select
                  id={`preparation-${item.id}`}
                  value={item.preparation}
                  onChange={(event) =>
                    updateItem(
                      item.id,
                      {
                        preparation:
                          event.target
                            .value as MealPreparation,
                      },
                    )
                  }
                  className="w-full rounded-md border bg-background px-3 py-2"
                >
                  {MEAL_PREPARATIONS.map(
                    (preparation) => (
                      <option
                        key={preparation}
                        value={preparation}
                      >
                        {
                          MEAL_PREPARATION_LABELS[
                            preparation
                          ]
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Item notes */}

              <div className="mt-4 space-y-2">
                <label
                  htmlFor={`item-notes-${item.id}`}
                  className="text-sm font-medium"
                >
                  Notiz zum Lebensmittel
                </label>

                <input
                  id={`item-notes-${item.id}`}
                  type="text"
                  value={item.notes}
                  onChange={(event) =>
                    updateItem(
                      item.id,
                      {
                        notes:
                          event.target
                            .value,
                      },
                    )
                  }
                  placeholder="optional"
                  className="w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meal notes */}

      <section className="space-y-2">
        <label
          htmlFor="meal-notes"
          className="text-sm font-medium"
        >
          Notizen zur Mahlzeit
        </label>

        <textarea
          id="meal-notes"
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          rows={4}
          placeholder="z. B. Restaurant, besondere Umstände, ungewohnte Zutaten …"
          className="w-full resize-none rounded-md border bg-background px-3 py-2"
        />
      </section>

      {/* Actions */}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={
            loading ||
            foodsLoading ||
            foods.length === 0
          }
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Speichern …'
            : `${getMealTitle(mealType)} speichern`}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            void navigate({
              to: '/dashboard',
            })
          }
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          Abbrechen
        </button>
      </div>
    </form>
  )
}
