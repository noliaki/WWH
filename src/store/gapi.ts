import { ActionTree, ActionContext, MutationTree } from 'vuex'
import { Country } from '~/store/countries'

declare const gapi: any

export interface State {
  doneClientInit: boolean
  holidays: {
    [key: string]: {
      [key: string]: any
    }
  }
}

export const state: () => State = (): State => ({
  doneClientInit: false,
  holidays: {}
})

export const mutationType: { [key: string]: string } = {
  ON_UPDATE_SIGNEDIN_STATUS: 'ON_UPDATE_SIGNEDIN_STATUS',
  ON_DONE_CLIENT_INIT: 'ON_DONE_CLIENT_INIT',
  SET_HOLIDAYS: 'SET_HOLIDAYS'
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
      language
    }: {
      year: number
      holidays: any
      alpha2Code: string
      language: string
    }
  ): void {
    if (!state.holidays[language]) {
      state.holidays[language] = {}
      state.holidays[language][year] = []
    }

    state.holidays[language][year].push({
      alpha2Code,
      holidays
    })
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
    { state, commit }: ActionContext<State, undefined>,
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
    if (
      state.holidays[language] &&
      state.holidays[language][year].find(
        (item: any): boolean => item.alpha2Code === alpha2Code
      )
    ) {
      return
    }

    try {
      const res = await gapi.client.calendar.events.list({
        calendarId,
        timeMin: new Date(year).toISOString(),
        timeMax: new Date(year + 1, 1, 0).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime'
      })

      console.log(res)

      commit(mutationType.SET_HOLIDAYS, {
        alpha2Code,
        year,
        language,
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
  }
}
