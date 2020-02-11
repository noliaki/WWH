import { Context } from '@nuxt/types'
import { flag as countryEmojiFlag } from 'country-emoji'

export default (
  _context: Context,
  inject: (key: string, value: any) => void
): void => {
  inject('countryEmojiFlag', countryEmojiFlag)
}
