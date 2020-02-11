import { ActionTree, ActionContext, MutationTree } from 'vuex'

export interface State {
  isShownCountrySelect: boolean
  isShownTargetDate: boolean
}

export const mutationType = {
  SHOW_COUNTRY_SELECT: 'SHOW_COUNTRY_SELECT',
  HIDE_COUNTRY_SELECT: 'HIDE_COUNTRY_SELECT',
  SHOW_TARGET_DATE: 'SHOW_TARGET_DATE',
  HIDE_TARGET_DATE: 'HIDE_TARGET_DATE',
  HIDE_ALL: 'HIDE_ALL'
}

export const state: () => State = (): State => ({
  isShownCountrySelect: false,
  isShownTargetDate: false
})

export const mutations: MutationTree<State> = {
  [mutationType.SHOW_COUNTRY_SELECT](state: State): void {
    state.isShownCountrySelect = true
  },
  [mutationType.HIDE_COUNTRY_SELECT](state: State): void {
    state.isShownCountrySelect = false
  },
  [mutationType.SHOW_TARGET_DATE](state: State): void {
    state.isShownTargetDate = true
  },
  [mutationType.HIDE_TARGET_DATE](state: State): void {
    state.isShownTargetDate = false
  },
  [mutationType.HIDE_ALL](state: State): void {
    state.isShownCountrySelect = false
    state.isShownTargetDate = false
  }
}

export const actions: ActionTree<State, undefined> = {
  showCountrySelect({ commit }: ActionContext<State, undefined>): void {
    commit(mutationType.SHOW_COUNTRY_SELECT)
  },
  hideCountrySelect({ commit }: ActionContext<State, undefined>): void {
    commit(mutationType.HIDE_COUNTRY_SELECT)
  },
  showTargetDate({ commit }: ActionContext<State, undefined>): void {
    commit(mutationType.SHOW_TARGET_DATE)
  },
  hideTargetDate({ commit }: ActionContext<State, undefined>): void {
    commit(mutationType.HIDE_TARGET_DATE)
  },
  hideAll({ commit }: ActionContext<State, undefined>): void {
    commit(mutationType.HIDE_ALL)
  }
}
