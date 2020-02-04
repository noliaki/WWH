<template>
  <div>
    <label for="language">{{ selectedLanguage }}</label
    ><select id="language" @input="onInput">
      <option disabled>select language</option>
      <option
        v-for="lang in languages"
        :key="lang.iso639_1 || lang.iso639_2"
        :value="lang.iso639_1 || lang.iso639_2"
        :selected="(lang.iso639_1 || lang.iso639_2) === selectedLanguage"
        >{{ lang.iso639_1 || lang.iso639_2 }} | {{ lang.nativeName }}</option
      >
    </select>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Country } from '~/store/countries'

export default Vue.extend({
  computed: {
    languages(): Country[] {
      return this.$store.getters['countries/languages']
    },
    selectedLanguage(): string {
      return this.$store.state.language.selectedLanguage
    }
  },
  created(): void {
    if (process.client) {
      this.$store.dispatch(
        'language/setSelectedLanguage',
        navigator.language.replace(/(-|_).+/i, '').toLowerCase()
      )
    }

    this.$store.dispatch('countries/fetchAll')
  },
  methods: {
    onInput($event: Event): void {
      console.log(($event.target as HTMLSelectElement).value)

      this.$store.dispatch(
        'language/setSelectedLanguage',
        ($event.target as HTMLSelectElement).value
      )
    }
  }
})
</script>
<style lang="postcss" scoped>
div {
  @apply text-sm relative bg-gray-300 overflow-hidden text-gray-500 flex justify-center items-center px-1;
  min-width: 3em;
}

select {
  @apply absolute inset-0 opacity-0;
}
</style>
