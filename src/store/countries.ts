import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex'

export interface Country {
  translations: { [key: string]: string }
  flag: string
  name: string
  alpha2Code: string
  timezones: string[]
  languages: Language[]
}

export interface Language {
  // eslint-disable-next-line camelcase
  iso639_1: string
  // eslint-disable-next-line camelcase
  iso639_2: string
  name: string
  nativeName: string
}

export interface LangData {
  lang: string
  nativeName: string
}

export interface State {
  list: Country[]
}

export const mutationTypes: { [key: string]: string } = {
  SET_COUNTRY_DATA: 'SET_COUNTRY_DATA'
}

export const state: () => State = (): State => ({
  list: []
})

export const getters: GetterTree<State, undefined> = {
  languages({ list }: State): Language[] {
    return list
      .reduce((prev: Language[], curr: Country): Language[] => {
        prev = prev.concat(
          curr.languages.map((lang: Language): Language & {
            alpha2code: string
          } => Object.assign({}, lang, { alpha2code: curr.alpha2Code }))
        )

        return prev
      }, [])
      .filter(
        (language: Language, index: number, arr: Language[]): boolean =>
          index ===
          arr.findIndex(
            (item: Language): boolean =>
              language.iso639_1 === item.iso639_1 &&
              language.iso639_2 === item.iso639_2 &&
              language.nativeName === item.nativeName
          )
      )
      .sort((a: Language, b: Language): number => {
        if (a.iso639_1 && b.iso639_1) {
          if (a.iso639_1 > b.iso639_1) return 1
          if (a.iso639_1 < b.iso639_1) return -1
          return 0
        }

        if (a.iso639_2 > b.iso639_2) return 1
        if (a.iso639_2 < b.iso639_2) return -1
        return 0
      })
  },
  calendarIdNames(): any {
    return [
      {
        alpha2Code: 'IS',
        calendarIdName: 'is'
      },
      {
        alpha2Code: 'AZ',
        calendarIdName: 'az'
      },
      {
        alpha2Code: 'IE',
        calendarIdName: 'irish'
      },
      {
        alpha2Code: 'AF',
        calendarIdName: 'af'
      },
      {
        alpha2Code: 'US',
        calendarIdName: 'usa'
      },
      {
        alpha2Code: 'AE',
        calendarIdName: 'ae'
      },
      {
        alpha2Code: 'DZ',
        calendarIdName: 'dz'
      },
      {
        alpha2Code: 'AR',
        calendarIdName: 'ar'
      },
      {
        alpha2Code: 'AL',
        calendarIdName: 'al'
      },
      {
        alpha2Code: 'AW',
        calendarIdName: 'aw'
      },
      {
        alpha2Code: 'AM',
        calendarIdName: 'am'
      },
      {
        alpha2Code: 'AI',
        calendarIdName: 'ai'
      },
      {
        alpha2Code: 'AO',
        calendarIdName: 'ao'
      },
      {
        alpha2Code: 'AG',
        calendarIdName: 'ag'
      },
      {
        alpha2Code: 'AD',
        calendarIdName: 'ad'
      }
    ]
  }
}

export const mutations: MutationTree<State> = {
  [mutationTypes.SET_COUNTRY_DATA](
    state: State,
    countriesList: Country[]
  ): void {
    state.list = countriesList
  }
}

export const actions: ActionTree<State, undefined> = {
  async fetchAll({ commit }: ActionContext<State, undefined>): Promise<void> {
    const result: Country[] = await fetch(
      'https://restcountries.eu/rest/v2/all?fields=name;translations;alpha2Code;timezones;flag;languages'
    ).then((res: Response): Promise<Country[]> => res.json())

    commit(mutationTypes.SET_COUNTRY_DATA, result)
  }
}
