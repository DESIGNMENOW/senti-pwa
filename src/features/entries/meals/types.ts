import type {
  MealPreparation,
  MealType,
  MealUnit,
} from './meal-types'

export interface Food {
  id: string
  name: string
}

export interface MealItem {
  id: string
  user: string
  meal: string
  food: string
  quantity?: number
  unit: MealUnit
  consumed_at: string
  preparation?: MealPreparation
  position: number
  notes?: string
  expand?: {
    food?: Food
  }
}

export interface Meal {
  id: string
  user: string
  entry: string
  meal_type: MealType
  name: string
  started_at: string
  ended_at?: string
  notes?: string
  items?: MealItem[]
}
