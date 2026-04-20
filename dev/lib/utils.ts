type ClassDictionary = Record<string, boolean | null | undefined>
type ClassArray = ClassValue[]
type ClassValue = ClassArray | ClassDictionary | false | Function | null | string | undefined

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flatMap((input): string[] => {
      if (!input) {
        return []
      }

      if (typeof input === 'string') {
        return [input]
      }

      if (Array.isArray(input)) {
        return [cn(...input)]
      }

      return Object.entries(input)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key)
    })
    .filter(Boolean)
    .join(' ')
}
