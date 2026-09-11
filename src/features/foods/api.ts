import { pb } from '#/lib/pocketbase'

export type FoodCategory =
  | 'fruit'
  | 'vegetable'
  | 'grain'
  | 'dairy'
  | 'meat_fish'
  | 'beverage'
  | 'snack'
  | 'other'

export type FoodUnit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'piece'
  | 'portion'

export interface Food {
  id: string
  name: string
  name_normalized: string
  brand?: string
  barcode?: string
  category: FoodCategory
  default_unit: FoodUnit
  notes?: string
  active: boolean
  created: string
  updated: string
}

export interface CreateFoodInput {
  name: string
  brand?: string
  barcode?: string
  category: FoodCategory
  default_unit: FoodUnit
  notes?: string
  active: boolean
}

export type UpdateFoodInput =
  CreateFoodInput

function normalizeFoodName(
  name: string,
): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function assertAuthenticated() {
  if (!pb.authStore.isValid) {
    throw new Error(
      'Nicht authentifiziert.',
    )
  }
}

export async function createFood(
  input: CreateFoodInput,
): Promise<Food> {
  assertAuthenticated()

  const name = input.name.trim()

  if (!name) {
    throw new Error(
      'Bitte einen Namen eingeben.',
    )
  }

  return pb
    .collection('foods')
    .create<Food>({
      name,

      name_normalized:
        normalizeFoodName(name),

      brand:
        input.brand?.trim() ?? '',

      barcode:
        input.barcode?.trim() ?? '',

      category: input.category,

      default_unit:
        input.default_unit,

      notes:
        input.notes?.trim() ?? '',

      active: input.active,
    })
}

export async function getFoods(): Promise<
  Food[]
> {
  assertAuthenticated()

  return pb
    .collection('foods')
    .getFullList<Food>({
      sort: 'name',
    })
}

export async function getFood(
  id: string,
): Promise<Food> {
  assertAuthenticated()

  return pb
    .collection('foods')
    .getOne<Food>(id)
}

export async function updateFood(
  id: string,
  input: UpdateFoodInput,
): Promise<Food> {
  assertAuthenticated()

  const name = input.name.trim()

  if (!name) {
    throw new Error(
      'Bitte einen Namen eingeben.',
    )
  }

  return pb
    .collection('foods')
    .update<Food>(id, {
      name,

      name_normalized:
        normalizeFoodName(name),

      brand:
        input.brand?.trim() ?? '',

      barcode:
        input.barcode?.trim() ?? '',

      category: input.category,

      default_unit:
        input.default_unit,

      notes:
        input.notes?.trim() ?? '',

      active: input.active,
    })
}

export async function deleteFood(
  id: string,
): Promise<void> {
  assertAuthenticated()

  await pb
    .collection('foods')
    .delete(id)
}
