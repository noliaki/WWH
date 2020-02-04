export const int: (str: string) => number = (str: string): number =>
  parseInt(str, 10)

export const dateFormat: (d: Date) => string = (d: Date): string => {
  const year: number = d.getFullYear()
  const month: string = `${d.getMonth() + 1}`.padStart(2, '0')
  const date: string = `${d.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${date}`
}
