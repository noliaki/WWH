import { ActionTree, ActionContext, MutationTree, GetterTree } from 'vuex'
import { Country } from '~/store/countries'

declare const gapi: any

interface CountryHolidays {
  alpha2Code: string
  language: string
  year: number
  summary: string
  holidays: any[]
}

export interface State {
  doneClientInit: boolean
  holidays: CountryHolidays[]
  targetDateString: string | undefined
}

export const state: () => State = (): State => ({
  doneClientInit: false,
  holidays: [],
  targetDateString: ''
})

export const getters: GetterTree<State, never> = {
  hasHolidays: ({ holidays }: State) => ({
    alpha2Code,
    language,
    year
  }: {
    alpha2Code: string
    language: string
    year: number
  }): boolean =>
    holidays.find(
      (item: CountryHolidays): boolean =>
        item.alpha2Code === alpha2Code &&
        item.language === language &&
        item.year === year
    ) !== undefined,
  getCountryHolidaysByDateString: ({ holidays }: State) => (
    dateString: string
  ): { alpha2Code: string; holidaySummaries: string[]; summary: string }[] => {
    return holidays.reduce(
      (
        prev: {
          alpha2Code: string
          holidaySummaries: string[]
          summary: string
        }[],
        current: CountryHolidays
      ): {
        alpha2Code: string
        holidaySummaries: string[]
        summary: string
      }[] => {
        const holidaySummaries = current.holidays
          .filter(
            (holiday: any): boolean =>
              dateString >= holiday.start.date && dateString < holiday.end.date
          )
          .map((item: any): string => item.summary)

        if (holidaySummaries.length > 0) {
          prev.push({
            alpha2Code: current.alpha2Code,
            summary: current.summary,
            holidaySummaries
          })
        }

        return prev
      },
      []
    )
  },
  getTargetCountryHolidays(
    { targetDateString }: State,
    getters: any
  ): { alpha2Code: string; holidaySummaries: string[] }[] {
    return getters.getCountryHolidaysByDateString(targetDateString)
  }
}

export const mutationType: { [key: string]: string } = {
  ON_UPDATE_SIGNEDIN_STATUS: 'ON_UPDATE_SIGNEDIN_STATUS',
  ON_DONE_CLIENT_INIT: 'ON_DONE_CLIENT_INIT',
  SET_HOLIDAYS: 'SET_HOLIDAYS',
  SET_TARGET_DATE: 'SET_TARGET_DATE'
}

export const mutations: MutationTree<State> = {
  [mutationType.ON_DONE_CLIENT_INIT](state: State): void {
    state.doneClientInit = true
  },
  [mutationType.SET_HOLIDAYS](
    state: State,
    {
      year,
      holidays,
      alpha2Code,
      language,
      summary
    }: {
      year: number
      holidays: any
      alpha2Code: string
      language: string
      summary: string
    }
  ): void {
    state.holidays.push({
      year,
      holidays,
      alpha2Code,
      language,
      summary
    })
  },
  [mutationType.SET_TARGET_DATE](state: State, targetDateString: string): void {
    state.targetDateString = targetDateString
  }
}

export const actions: ActionTree<State, any> = {
  loadAndInit({ dispatch, commit }): Promise<void> {
    return new Promise(
      (resolve: () => void, reject: (reason: any) => void): void => {
        gapi.load('client', {
          async callback(): Promise<void> {
            await dispatch('init').catch((err: any): void => {
              throw new Error(err)
            })

            commit(mutationType.ON_DONE_CLIENT_INIT)

            resolve()
          },
          onerror(): void {
            reject(new Error('gapi.client failed to load'))
          }
        })
      }
    )
  },
  async init(): Promise<void> {
    await gapi.client.init({
      apiKey: process.env.API_KEY,
      clientId: process.env.CLIENT_ID,
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
      ],
      scope: 'https://www.googleapis.com/auth/calendar.events.readonly'
    })
  },
  async fetchYearHolidaysByCalendarId(
    { commit, getters }: ActionContext<State, undefined>,
    {
      calendarId,
      year,
      alpha2Code,
      language
    }: {
      calendarId: string
      year: number
      alpha2Code: string
      language: string
    }
  ): Promise<void> {
    if (getters.hasHolidays({ alpha2Code, language, year })) {
      return
    }

    try {
      const res = await gapi.client.calendar.events.list({
        calendarId,
        timeMin: new Date(year).toISOString(),
        timeMax: new Date(year + 1, 0, 0).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime'
      })

      console.log(res)

      commit(mutationType.SET_HOLIDAYS, {
        alpha2Code,
        year,
        language,
        summary: res.result.summary,
        holidays: res.result.items
      })
    } catch (error) {
      console.log(calendarId, year)
      console.log(error)
    }
  },
  async fetchHolidays(
    { state, dispatch }: ActionContext<State, undefined>,
    {
      year,
      selectedCountries,
      language
    }: { year: number; selectedCountries: Country[]; language: string }
  ): Promise<void> {
    if (!state.doneClientInit) {
      await dispatch('loadAndInit')
    }

    const request: Promise<void>[] = selectedCountries.map(
      (country: Country): Promise<void> => {
        return dispatch('fetchYearHolidaysByCalendarId', {
          year,
          alpha2Code: country.alpha2Code,
          language,
          calendarId: `${language.toLocaleLowerCase()}.${(country.googleCalendarId as string).toLocaleLowerCase()}#holiday@group.v.calendar.google.com`
        })
      }
    )

    Promise.all(request).then((result: any[]): void => {
      console.log(result)
    })
  },
  setTargetDateString(
    { commit }: ActionContext<State, undefined>,
    targetDateString: string
  ): void {
    commit(mutationType.SET_TARGET_DATE, targetDateString)
  }
}
