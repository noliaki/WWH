import { Context } from '@nuxt/types'
import { int } from '~/utils'

export default ({ redirect, params }: Context): void => {
  const year: number = int(params.year)
  const month: number = int(params.month)

  if (isNaN(year) || isNaN(month)) {
    const today: Date = new Date()
    redirect({
      name: 'year-month',
      params: {
        year: `${today.getFullYear()}`,
        month: `${today.getMonth() + 1}`
      }
    })
  }
}
