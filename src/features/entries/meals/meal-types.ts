export const MEAL_TYPES = [
  {
    value: 'breakfast',
    label: 'Frühstück',
  },
  {
    value: 'lunch',
    label: 'Mittagessen',
  },
  {
    value: 'dinner',
    label: 'Abendessen',
  },
  {
    value: 'snack',
    label: 'Snack',
  },
  {
    value: 'drink',
    label: 'Getränk',
  },
] as const

export type MealType =
  (typeof MEAL_TYPES)[number]['value']


export const MEAL_UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'piece',
  'portion',
] as const

export type MealUnit =
  (typeof MEAL_UNITS)[number]


export const MEAL_UNIT_LABELS: Record<
  MealUnit,
  string
> = {
  g: 'Gramm (g)',
  kg: 'Kilogramm (kg)',
  ml: 'Milliliter (ml)',
  l: 'Liter (l)',
  piece: 'Stück',
  portion: 'Portion',
}


export const MEAL_PREPARATIONS = [
  'raw',
  'cooked',
  'fried',
  'baked',
  'steamed',
  'grilled',
  'other',
] as const

export type MealPreparation =
  (typeof MEAL_PREPARATIONS)[number]


export const MEAL_PREPARATION_LABELS: Record<
  MealPreparation,
  string
> = {
  raw: 'Roh',
  cooked: 'Gekocht',
  fried: 'Gebraten',
  baked: 'Gebacken',
  steamed: 'Gedämpft',
  grilled: 'Gegrillt',
  other: 'Sonstige',
}
