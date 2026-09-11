import { createFileRoute } from '@tanstack/react-router'

import { FoodForm } from '#/features/foods/FoodForm'

export const Route =
  createFileRoute('/food/$id/edit')({
    component: EditFoodPage,
  })

function EditFoodPage() {
  const { id } = Route.useParams()

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <FoodForm foodId={id} />
    </main>
  )
}
