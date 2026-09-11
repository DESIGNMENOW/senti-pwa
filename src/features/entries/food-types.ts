export const FOOD_CATEGORIES = [
  'fruit',
  'vegetable',
  'grain',
  'dairy',
  'meat_fish',
  'beverage',
  'snack',
  'other',
] as const

export type FoodCategory =
  (typeof FOOD_CATEGORIES)[number]

export const FOOD_UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'piece',
  'portion',
] as const

export type FoodUnit =
  (typeof FOOD_UNITS)[number]

export interface Food {
  id: string
  name: string
  name_normalized?: string
  brand?: string
  barcode?: string
  category: FoodCategory
  default_unit: FoodUnit
  notes?: string
  active: boolean
}
