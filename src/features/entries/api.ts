import { pb } from '#/lib/pocketbase'

import type { Entry } from './types'
import type { EntryType } from './entry-types'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface MealFood {
  id: string
  name: string
  name_normalized?: string
  brand?: string
  barcode?: string
  category?: string
  default_unit?: string
  notes?: string
  active?: boolean
}

export interface MealItem {
  id: string
  user: string
  meal: string
  food: string
  quantity: number
  unit: string
  consumed_at?: string
  preparation?: string
  position?: number
  notes?: string

  expand?: {
    food?: MealFood
  }
}

export interface Meal {
  id: string
  user: string
  entry: string
  meal_type: string
  name: string
  started_at?: string
  ended_at?: string
  notes?: string

  items: MealItem[]
}

export interface EntryWithDetails
  extends Entry {
  meal?: Meal
}

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

export interface CreateEntryInput {
  type: EntryType
  timestamp: string
  title: string
  notes?: string
}

export async function createEntry(
  input: CreateEntryInput,
): Promise<Entry> {
  const user = pb.authStore.record

  if (!user) {
    throw new Error('Nicht authentifiziert.')
  }

  const record =
    await pb.collection('entries').create({
      user: user.id,

      // PocketBase-Feld heißt entry_type.
      entry_type: input.type,

      timestamp: input.timestamp,

      title: input.title,

      notes: input.notes ?? '',
    })

  /*
   * Der restliche Code verwendet weiterhin
   * entry.type. Deshalb normalisieren wir hier
   * das PocketBase-Feld auf die UI-Struktur.
   */
  return {
    ...record,
    type: record.entry_type,
  } as Entry
}

/* -------------------------------------------------------------------------- */
/* Get entries                                                                */
/* -------------------------------------------------------------------------- */

export async function getEntries(): Promise<
  EntryWithDetails[]
> {
  const user = pb.authStore.record

  if (!user) {
    throw new Error('Nicht authentifiziert.')
  }

  /*
   * Zuerst die normalen Entries laden.
   *
   * Wichtig:
   * Wir filtern explizit nach dem aktuellen User.
   */
  const records =
    await pb
      .collection('entries')
      .getFullList({
        filter: `user = "${user.id}"`,
        sort: '-timestamp',
      })

  const entries = records.map(
    (record) =>
      ({
        ...record,
        type: record.entry_type,
      }) as EntryWithDetails,
  )

  /*
   * Es gibt möglicherweise noch keine Mahlzeiten.
   * Trotzdem laden wir die Collections separat.
   *
   * Das ist zunächst einfacher und robuster als
   * verschachtelte PocketBase-Expands.
   */

  const meals =
    await pb
      .collection('meals')
      .getFullList<Meal>({
        filter: `user = "${user.id}"`,
      })

  const mealIds = new Set(
    meals.map((meal) => meal.id),
  )

  let mealItems: MealItem[] = []

  if (mealIds.size > 0) {
    /*
     * Alle meal_items des Users laden.
     *
     * expand=food sorgt dafür, dass wir direkt
     * den Namen des Lebensmittels bekommen.
     */
    mealItems =
      await pb
        .collection('meal_items')
        .getFullList<MealItem>({
          filter: `user = "${user.id}"`,
          expand: 'food',
          sort: 'position',
        })
  }

  /*
   * Meal Items den jeweiligen Mahlzeiten zuordnen.
   */
  const mealsWithItems = meals.map(
    (meal) => ({
      ...meal,
      items: mealItems.filter(
        (item) =>
          item.meal === meal.id,
      ),
    }),
  )

  /*
   * Mahlzeiten über meals.entry mit dem
   * jeweiligen Entry verbinden.
   */
  return entries.map((entry) => {
    const meal =
      mealsWithItems.find(
        (item) =>
          item.entry === entry.id,
      )

    return {
      ...entry,
      meal,
    }
  })
}

/* -------------------------------------------------------------------------- */
/* Get single entry                                                           */
/* -------------------------------------------------------------------------- */

export async function getEntry(
  id: string,
): Promise<Entry> {
  if (!pb.authStore.isValid) {
    throw new Error('Nicht authentifiziert.')
  }

  const record =
    await pb
      .collection('entries')
      .getOne(id)

  return {
    ...record,
    type: record.entry_type,
  } as Entry
}

/* -------------------------------------------------------------------------- */
/* Delete                                                                     */
/* -------------------------------------------------------------------------- */

export async function deleteEntry(
  id: string,
): Promise<void> {
  if (!pb.authStore.isValid) {
    throw new Error('Nicht authentifiziert.')
  }

  await pb
    .collection('entries')
    .delete(id)
}
