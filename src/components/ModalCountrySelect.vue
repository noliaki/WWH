<template>
  <modal-base @hideModal="hideModal">
    <div>
      <div>
        <select-language class="select" />
      </div>
      <div>
        <select-countries class="select" />
      </div>
      <div>
        <button
          type="button"
          class="btn-fetch-holiday"
          @click.prevent="onClickFetch"
        >
          fetch HOLIDAYS
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
    }
  }
})
</script>
<style lang="postcss" scoped>
.select {
  @apply bg-gray-100 rounded-lg p-4 block;
  width: 100%;
}

.btn-fetch-holiday {
  @apply bg-blue-100 rounded-full py-1 px-4;
}
</style>
