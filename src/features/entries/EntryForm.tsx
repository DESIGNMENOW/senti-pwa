import { MealForm } from './meals/MealForm'

interface EntryFormProps {
  initialType?: string
}

export function EntryForm({
  initialType,
}: EntryFormProps) {
  switch (initialType) {
    case 'meal':
      return (
        <MealForm initialType="breakfast" />
      )

    default:
      return (
        <GenericEntryPlaceholder
          type={initialType}
        />
      )
  }
}

function GenericEntryPlaceholder({
  type,
}: {
  type?: string
}) {
  const labels: Record<string, string> = {
    meal: 'Mahlzeit',
    symptom: 'Symptom',
    activity: 'Aktivität',
    wellbeing: 'Wohlbefinden',
  }


  const label =
    (type && labels[type]) || 'Eintrag'

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold">
        {label}
      </h1>

      <p className="mt-2 text-muted-foreground">
        Das Formular für {label.toLowerCase()}{' '}
        wird als Nächstes eingerichtet.
      </p>
    </div>
  )
}
