import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex'

export interface Country {
  translations: { [key: string]: string }
  flag: string
  name: string
  alpha2Code: string
  timezones: string[]
}

export interface State {
  countries: Country[]
}

export const mutationTypes: { [key: string]: string } = {
  SET_COUNTRY_DATA: 'SET_COUNTRY_DATA'
}

export const state: () => State = (): State => ({
  countries: []
})

export const getters: GetterTree<State, undefined> = {
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
  [mutationTypes.SET_COUNTRY_DATA](state: State, countries: Country[]): void {
    state.countries = countries
  }
}

export const actions: ActionTree<State, undefined> = {
  async fetchAll({ commit }: ActionContext<State, undefined>): Promise<void> {
    const result: Country[] = await fetch(
      'https://restcountries.eu/rest/v2/all?fields=name;translations;alpha2Code;timezones;flag'
    ).then((res: Response): Promise<Country[]> => res.json())

    commit(mutationTypes.SET_COUNTRY_DATA, result)
  }
}
