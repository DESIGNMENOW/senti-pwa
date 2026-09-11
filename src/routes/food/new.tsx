import { createFileRoute } from '@tanstack/react-router'

import { FoodForm } from '#/features/foods/FoodForm'

export const Route =
  createFileRoute('/food/new')({
    component: NewFoodPage,
  })

function NewFoodPage() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <FoodForm />
    </main>
  )
}
