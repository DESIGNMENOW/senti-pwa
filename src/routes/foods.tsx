import { createFileRoute } from '@tanstack/react-router'

import { FoodList } from '#/features/foods/FoodList'

export const Route =
  createFileRoute('/foods')({
    component: FoodsPage,
  })

function FoodsPage() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <FoodList />
      </div>
    </main>
  )
}
