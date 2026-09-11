export const ENTRY_TYPES = [
  {
    value: 'food',
    label: 'Essen',
    icon: '🍽️',
  },
  {
    value: 'symptom',
    label: 'Symptom',
    icon: '🩺',
  },
  {
    value: 'activity',
    label: 'Aktivität',
    icon: '🏃',
  },
  {
    value: 'medication',
    label: 'Medikament',
    icon: '💊',
  },
  {
    value: 'note',
    label: 'Notiz',
    icon: '📝',
  },
] as const

export type EntryType =
  (typeof ENTRY_TYPES)[number]['value']

export function getEntryTypeLabel(type: string) {
  return (
    ENTRY_TYPES.find((item) => item.value === type)
      ?.label ?? type
  )
}

export function getEntryTypeIcon(type: string) {
  return (
    ENTRY_TYPES.find((item) => item.value === type)
      ?.icon ?? '📝'
  )
}
