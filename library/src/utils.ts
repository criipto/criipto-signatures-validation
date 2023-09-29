export function tryParseJSON<T>(input: string) : T | null {
  try {
    return JSON.parse(input) as T
  } catch (err) {
    return null;
  }
}