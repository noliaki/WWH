import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex'

export interface Country {
  translations: { [key: string]: string }
  flag: string
  name: string
  alpha2Code: string
  timezones: string[]
  languages: Language[]
  googleCalendarId?: string
}

export interface CalendarIdMap {
  [alpha2Code: string]: string
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
  selectedCountries: Country[]
}

export const mutationType: { [key: string]: string } = {
  SET_COUNTRY_DATA: 'SET_COUNTRY_DATA',
  SET_SELECTED_COUNTRY: 'SET_SELECTED_COUNTRY'
}

export const state: () => State = (): State => ({
  list: [],
  selectedCountries: []
})

export const getters: GetterTree<State, undefined> = {
  languages({ list }: State): Language[] {
    return list
      .reduce((prev: Language[], curr: Country): Language[] => {
        prev = prev.concat(curr.languages)

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
  calendarIdMap(): CalendarIdMap {
    return {
      IS: 'is',
      AZ: 'az',
      IE: 'irish',
      AF: 'af',
      US: 'usa',
      AE: 'ae',
      DZ: 'dz',
      AR: 'ar',
      AL: 'al',
      AW: 'aw',
      AM: 'am',
      AI: 'ai',
      AO: 'ao',
      AG: 'ag',
      AD: 'ad',
      YE: 'ye',
      GB: 'uk',
      IL: 'jewish',
      IT: 'italian',
      IQ: 'iq',
      IR: 'ir',
      ID: 'indonesian',
      IN: 'indian',
      WF: 'wf',
      UG: 'ug',
      UA: 'ukrainian',
      UZ: 'uz',
      UY: 'uy',
      EC: 'ec',
      EG: 'eg',
      EE: 'ee',
      ET: 'et',
      ER: 'er',
      SV: 'sv',
      AU: 'australian',
      AT: 'austrian',
      OM: 'om',
      NL: 'dutch',
      GH: 'gh',
      CV: 'cv',
      GG: 'gg',
      GY: 'gy',
      KZ: 'kz',
      QA: 'qa',
      CA: 'canadian',
      GA: 'ga',
      CM: 'cm',
      GM: 'gm',
      KH: 'kh',
      GN: 'gn',
      GW: 'gw',
      CY: 'cy',
      CU: 'cu',
      CW: 'cw',
      GR: 'greek',
      KI: 'ki',
      KG: 'kg',
      GT: 'gt',
      GU: 'gu',
      KW: 'kw',
      CK: 'ck',
      GL: 'gl',
      GE: 'ge',
      GD: 'gd',
      HR: 'croatian',
      KY: 'ky',
      KE: 'ke',
      CI: 'ci',
      CR: 'cr',
      KM: 'km',
      CO: 'co',
      CG: 'cg',
      CD: 'cd',
      SA: 'saudiarabian',
      WS: 'ws',
      BL: 'bl',
      ST: 'st',
      ZM: 'zm',
      PM: 'pm',
      SM: 'sm',
      MF: 'mf',
      SL: 'sl',
      DJ: 'dj',
      GI: 'gi',
      JE: 'je',
      JM: 'jm',
      SY: 'sy',
      SG: 'singapore',
      SX: 'sx',
      ZW: 'zw',
      SD: 'sd',
      CH: 'ch',
      SE: 'swedish',
      ES: 'spain',
      SR: 'sr',
      LK: 'lk',
      SK: 'slovak',
      SI: 'slovenian',
      SZ: 'sz',
      SC: 'sc',
      SN: 'sn',
      RS: 'rs',
      KN: 'kn',
      VC: 'vc',
      SH: 'sh',
      LC: 'lc',
      SO: 'so',
      SB: 'sb'
    }
  }
}

export const mutations: MutationTree<State> = {
  [mutationType.SET_COUNTRY_DATA](
    state: State,
    countriesList: Country[]
  ): void {
    state.list = countriesList
  },
  [mutationType.SET_SELECTED_COUNTRY](
    state: State,
    selectedCountries: Country[]
  ): void {
    state.selectedCountries = selectedCountries
  }
}

export const actions: ActionTree<State, undefined> = {
  async fetchAll({
    commit,
    getters
  }: ActionContext<State, undefined>): Promise<void> {
    const result: Country[] = await fetch(
      'https://restcountries.eu/rest/v2/all?fields=name;translations;alpha2Code;timezones;flag;languages'
    ).then((res: Response): Promise<Country[]> => res.json())

    result.forEach((country: Country): void => {
      country.googleCalendarId =
        getters.calendarIdMap[country.alpha2Code.toUpperCase()]
    })

    result.forEach((item: any) => {
      console.log(item.name, item.alpha2Code)
    })

    commit(mutationType.SET_COUNTRY_DATA, result)
  },
  setSelectedCountries(
    { commit }: ActionContext<State, undefined>,
    selectedCountries: Country[]
  ): void {
    commit(mutationType.SET_SELECTED_COUNTRY, selectedCountries)
  }
}
