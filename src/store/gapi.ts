import { ActionTree, MutationTree } from 'vuex'

declare const gapi: any

export interface State {
  doneClientInit: boolean
}

export const state: () => State = (): State => ({
  doneClientInit: false
})

export const murationTypes: { [key: string]: string } = {
  ON_UPDATE_SIGNEDIN_STATUS: 'ON_UPDATE_SIGNEDIN_STATUS',
  ON_DONE_CLIENT_INIT: 'ON_DONE_CLIENT_INIT'
}

export const mutations: MutationTree<State> = {
  [murationTypes.ON_DONE_CLIENT_INIT](state: State): void {
    state.doneClientInit = true
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
  async getHolidays({ dispatch, state }): Promise<void> {
    if (!state.doneClientInit) {
      await dispatch('loadAndInit')
    }

    const res = await gapi.client.calendar.events.list({
      calendarId: 'ja.is#holiday@group.v.calendar.google.com',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    })

    console.log(res)
  }
}
