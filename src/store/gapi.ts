import { ActionTree, ActionContext, MutationTree } from 'vuex'

declare const gapi: any

export interface State {
  isSignedIn: boolean
  doneClientInit: boolean
}

export const state: () => State = (): State => ({
  isSignedIn: false,
  doneClientInit: false
})

export const murationTypes: { [key: string]: string } = {
  ON_UPDATE_SIGNEDIN_STATUS: 'ON_UPDATE_SIGNEDIN_STATUS',
  ON_DONE_CLIENT_INIT: 'ON_DONE_CLIENT_INIT'
}

export const mutations: MutationTree<State> = {
  [murationTypes.ON_UPDATE_SIGNEDIN_STATUS](
    state: State,
    isSignedIn: boolean
  ): void {
    state.isSignedIn = isSignedIn
  },
  [murationTypes.ON_DONE_CLIENT_INIT](state: State): void {
    state.doneClientInit = true
  }
}

export const actions: ActionTree<State, any> = {
  load(): Promise<void> {
    return new Promise(
      (resolve: () => void, reject: (reason: any) => void): void => {
        gapi.load('client:auth2', {
          callback(): void {
            console.log('resolve LOAD')
            resolve()
          },
          onerror(): void {
            reject(new Error('gapi.client failed to load'))
          }
        })
      }
    )
  },
  init({ commit, dispatch }: ActionContext<State, any>): Promise<void> {
    return new Promise(
      (resolve: () => void, reject: (reason: any) => void): void => {
        gapi.client
          .init({
            apiKey: process.env.API_KEY,
            clientId: process.env.CLIENT_ID,
            discoveryDocs: [
              'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
            ],
            scope: 'https://www.googleapis.com/auth/calendar.events.readonly'
          })
          .then(
            (): void => {
              gapi.auth2
                .getAuthInstance()
                .isSignedIn.listen((updateSigninStatus: boolean): void => {
                  dispatch('updateSigninStatus', updateSigninStatus)
                })

              dispatch(
                'updateSigninStatus',
                gapi.auth2.getAuthInstance().isSignedIn.get()
              )
              commit(murationTypes.ON_DONE_CLIENT_INIT)
              resolve()
            },
            (error: any): void => {
              console.log(error)
              reject(error)
            }
          )
      }
    )
  },
  updateSigninStatus(
    { commit }: ActionContext<State, any>,
    isSignedIn: boolean
  ): void {
    console.log(isSignedIn)
    commit(murationTypes.ON_UPDATE_SIGNEDIN_STATUS, isSignedIn)
  },
  async getHolidays({ dispatch, state }): Promise<void> {
    if (!state.doneClientInit) {
      await dispatch('load')
      await dispatch('init')
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
