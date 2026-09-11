import { pb } from '#/lib/pocketbase'

import type {
  MealType,
  MealUnit,
  MealPreparation,
} from './meal-types'

import type {
  Meal,
  MealItem,
} from './types'

export interface CreateMealItemInput {
  foodId: string
  quantity?: number
  unit?: MealUnit
  preparation?: MealPreparation
  notes?: string
}

export interface CreateMealInput {
  timestamp: string
  mealType: MealType
  notes?: string
  items: CreateMealItemInput[]
}

export async function createMeal(
  input: CreateMealInput,
): Promise<Meal> {
  const user = pb.authStore.record

  if (!user) {
    throw new Error('Nicht authentifiziert.')
  }

  let entryId: string | undefined
  let mealId: string | undefined

  try {
    // --------------------------------------------------
    // 1. Entry
    // --------------------------------------------------

    const entry = await pb
      .collection('entries')
      .create({
        user: user.id,
        entry_type: 'meal',
        timestamp: input.timestamp,
        title: getMealTitle(input.mealType),
        notes: input.notes ?? '',
      })

    entryId = entry.id

    // --------------------------------------------------
    // 2. Meal
    // --------------------------------------------------

    const meal = await pb
      .collection('meals')
      .create<Meal>({
        user: user.id,
        entry: entry.id,
        meal_type: input.mealType,
        name: getMealTitle(input.mealType),
        started_at: input.timestamp,
        notes: input.notes ?? '',
      })

    mealId = meal.id

    // --------------------------------------------------
    // 3. Meal Items
    // --------------------------------------------------

    for (
      let index = 0;
      index < input.items.length;
      index++
    ) {
      const item = input.items[index]

      await pb
        .collection('meal_items')
        .create({
          user: user.id,
          meal: meal.id,
          food: item.foodId,
          quantity: item.quantity ?? 0,
          unit: item.unit ?? 'g',
          consumed_at: input.timestamp,
          preparation:
            item.preparation ?? 'raw',
          position: index,
          notes: item.notes ?? '',
        })
    }

    return meal
  } catch (error: any) {
    console.error(
      '[Meal] Speicherung fehlgeschlagen:',
      error,
    )

    console.error(
      '[Meal] PocketBase response:',
      error?.response,
    )

    // Cleanup meal
    if (mealId) {
      try {
        await pb
          .collection('meals')
          .delete(mealId)
      } catch (cleanupError) {
        console.error(
          '[Meal] Meal Cleanup fehlgeschlagen:',
          cleanupError,
        )
      }
    }

    // Cleanup entry
    if (entryId) {
      try {
        await pb
          .collection('entries')
          .delete(entryId)
      } catch (cleanupError) {
        console.error(
          '[Meal] Entry Cleanup fehlgeschlagen:',
          cleanupError,
        )
      }
    }

    throw new Error(
      getPocketBaseErrorMessage(error),
    )
  }
}

export async function getMeal(
  id: string,
): Promise<Meal> {
  return pb
    .collection('meals')
    .getOne<Meal>(id, {
      expand: 'entry',
    })
}

export async function getMealItems(
  mealId: string,
): Promise<MealItem[]> {
  return pb
    .collection('meal_items')
    .getFullList<MealItem>({
      filter: `meal = "${mealId}"`,
      sort: 'position',
      expand: 'food',
    })
}

function getMealTitle(
  mealType: MealType,
): string {
  switch (mealType) {
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
  }
}

function getPocketBaseErrorMessage(
  error: any,
): string {
  const response = error?.response

  if (response?.data) {
    const details = Object.entries(
      response.data,
    )
      .map(
        ([field, value]: [
          string,
          any,
        ]) => {
          const message =
            value?.message ??
            value?.code ??
            JSON.stringify(value)

          return `${field}: ${message}`
        },
      )
      .join('; ')

    if (details) {
      return `PocketBase: ${details}`
    }
  }

  return (
    response?.message ??
    error?.message ??
    'Fehler beim Speichern.'
  )
}
