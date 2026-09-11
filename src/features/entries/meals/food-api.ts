import { pb } from '#/lib/pocketbase'

import type { Food } from './food-types'

export async function searchFoods(
  search = '',
): Promise<Food[]> {
  const filterParts = ['active = true']

  if (search.trim()) {
    const value = search
      .trim()
      .replace(/"/g, '\\"')

    filterParts.push(
      `(name ~ "${value}" || name_normalized ~ "${value}" || brand ~ "${value}" || barcode = "${value}")`,
    )
  }

  return pb
    .collection('foods')
    .getList<Food>(1, 20, {
      filter: filterParts.join(' && '),
      sort: 'name',
    })
    .then((result) => result.items)
}

export async function getFood(
  id: string,
): Promise<Food> {
  return pb
    .collection('foods')
    .getOne<Food>(id)
}

export async function createFood(input: {
  name: string
  brand?: string
  barcode?: string
  category: Food['category']
  default_unit: Food['default_unit']
  notes?: string
}): Promise<Food> {
  const user = pb.authStore.record

  if (!user) {
    throw new Error('Nicht authentifiziert.')
  }

  return pb.collection('foods').create<Food>({
    name: input.name.trim(),
    name_normalized: normalizeFoodName(
      input.name,
    ),
    brand: input.brand?.trim() ?? '',
    barcode: input.barcode?.trim() ?? '',
    category: input.category,
    default_unit: input.default_unit,
    notes: input.notes?.trim() ?? '',
    active: true,
  })
}

function normalizeFoodName(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
}
