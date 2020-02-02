import { ActionTree, ActionContext, MutationTree } from 'vuex'
import { mutationTypes } from './countries'

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

export const murationTypes: { [key: string]: string } = {
  ON_UPDATE_SIGNEDIN_STATUS: 'ON_UPDATE_SIGNEDIN_STATUS',
  ON_DONE_CLIENT_INIT: 'ON_DONE_CLIENT_INIT',
  SET_HOLIDAYS: 'SET_HOLIDAYS'
}

export const mutations: MutationTree<State> = {
  [murationTypes.ON_DONE_CLIENT_INIT](state: State): void {
    state.doneClientInit = true
  },
  [murationTypes.SET_HOLIDAYS](
    state: State,
    {
      calendarId,
      year,
      result
    }: { calendarId: string; year: number; result: any }
  ): void {
    if (!state.holidays[calendarId]) {
      state.holidays[calendarId] = {}
    }

    state.holidays[calendarId][year] = result
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

            commit(murationTypes.ON_DONE_CLIENT_INIT)

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
  async getHolidays(
    { dispatch, state },
    { lang, countryId, year }
  ): Promise<void> {
    if (!state.doneClientInit) {
      await dispatch('loadAndInit')
    }

    const res = await gapi.client.calendar.events.list({
      calendarId: `${lang}.${countryId}#holiday@group.v.calendar.google.com`,
      timeMin: new Date(year).toISOString(),
      timeMax: new Date(year + 1, 1, 0).toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime'
    })

    console.log(res)
  },
  async fetchCountryHolidays(
    { state, commit }: ActionContext<State, undefined>,
    { calendarId, year }: { calendarId: string; year: number }
  ): Promise<void> {
    if (state.holidays[calendarId] && state.holidays[calendarId][year]) {
      return
    }

    const result = await gapi.client.calendar.events.list({
      calendarId,
      timeMin: new Date(year).toISOString(),
      timeMax: new Date(year + 1, 1, 0).toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime'
    })

    commit(mutationTypes.SET_HOLIDAYS, {
      calendarId,
      year,
      result
    })
  }
}
