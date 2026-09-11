export const FOOD_CATEGORIES = [
  {
    value: 'fruit',
    label: 'Obst',
  },
  {
    value: 'vegetable',
    label: 'Gemüse',
  },
  {
    value: 'grain',
    label: 'Getreide',
  },
  {
    value: 'dairy',
    label: 'Milchprodukte',
  },
  {
    value: 'meat_fish',
    label: 'Fleisch & Fisch',
  },
  {
    value: 'beverage',
    label: 'Getränk',
  },
  {
    value: 'snack',
    label: 'Snack',
  },
  {
    value: 'other',
    label: 'Sonstiges',
  },
] as const

export type FoodCategory =
  (typeof FOOD_CATEGORIES)[number]['value']


export const FOOD_UNITS = [
  {
    value: 'g',
    label: 'Gramm (g)',
  },
  {
    value: 'kg',
    label: 'Kilogramm (kg)',
  },
  {
    value: 'ml',
    label: 'Milliliter (ml)',
  },
  {
    value: 'l',
    label: 'Liter (l)',
  },
  {
    value: 'piece',
    label: 'Stück',
  },
  {
    value: 'portion',
    label: 'Portion',
  },
] as const

export type FoodUnit =
  (typeof FOOD_UNITS)[number]['value']
