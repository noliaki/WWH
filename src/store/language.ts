import { MutationTree, ActionTree, ActionContext } from 'vuex'

export interface State {
  selectedLanguage: string
}

export const mutationTypes = {
  SET_SELECTED_LANGUAGE: 'SET_SELECTED_LANGUAGE'
}

export const state: () => State = (): State => ({
  selectedLanguage: 'en'
})

export const mutations: MutationTree<State> = {
  [mutationTypes.SET_SELECTED_LANGUAGE](
    state: State,
    selectedLang: string
  ): void {
    state.selectedLanguage = selectedLang
  }
}

export const actions: ActionTree<State, undefined> = {
  setSelectedLanguage(
    { commit }: ActionContext<State, undefined>,
    selectedLang: string
  ): void {
    commit(mutationTypes.SET_SELECTED_LANGUAGE, selectedLang)
  }
}
