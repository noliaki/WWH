import { ActionTree, ActionContext, MutationTree } from 'vuex'

export interface State {
  isShownCountrySelect: boolean
}

export const mutationType = {
  SHOW_COUNTRY_SELECT: 'SHOW_COUNTRY_SELECT',
  HIDE_COUNTRY_SELECT: 'HIDE_COUNTRY_SELECT'
}

export const state: () => State = (): State => ({
  isShownCountrySelect: false
})

export const mutations: MutationTree<State> = {
  [mutationType.SHOW_COUNTRY_SELECT](state: State): void {
    state.isShownCountrySelect = true
  },
  [mutationType.HIDE_COUNTRY_SELECT](state: State): void {
    state.isShownCountrySelect = false
  }
}

export const actions: ActionTree<State, undefined> = {
  showCountrySelect({ commit }: ActionContext<State, undefined>): void {
    commit(mutationType.SHOW_COUNTRY_SELECT)
  },
  hideCountrySelect({ commit }: ActionContext<State, undefined>): void {
    commit(mutationType.HIDE_COUNTRY_SELECT)
  }
}
