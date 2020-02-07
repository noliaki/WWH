<template>
  <modal-base @hideModal="hideModal">
    <div>
      <div>
        <select-countries class="select" />
        <select-language class="select" />
      </div>
      <div class="select-action">
        <button
          type="button"
          class="btn-fetch-holiday"
          @click.prevent="onClickFetch"
        >
          fetch Holidays
        </button>
      </div>
    </div>
  </modal-base>
</template>
<script lang="ts">
import Vue from 'vue'
import ModalBase from '~/components/ModalBase.vue'
import SelectLanguage from '~/components/SelectLanguage.vue'
import SelectCountries from '~/components/SelectCountries.vue'
import { Country } from '~/store/countries'
import { int } from '~/utils'

export default Vue.extend({
  components: {
    ModalBase,
    SelectLanguage,
    SelectCountries
  },
  computed: {
    selectedCountries(): Country[] {
      return this.$store.state.countries.selectedCountries
    }
  },
  methods: {
    hideModal(): void {
      this.$store.dispatch('modal/hideCountrySelect')
    },
    onClickFetch(): void {
      if (this.selectedCountries.length <= 0) return

      this.$store.dispatch('gapi/fetchHolidays', {
        year: int(this.$route.params.year),
        selectedCountries: this.selectedCountries,
        language: this.$store.state.language.selectedLanguage
      })

      this.hideModal()
    }
  }
})
</script>
<style lang="postcss" scoped>
.select {
  @apply bg-gray-200 rounded-lg p-2 block border;
  width: 100%;
}

.select + .select {
  @apply mt-2;
}

.btn-fetch-holiday {
  @apply bg-blue-400 rounded-full py-1 px-4 text-blue-800;
}

.select-action {
  @apply text-center mt-4;
}
</style>
