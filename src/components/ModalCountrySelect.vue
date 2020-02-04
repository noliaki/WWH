<template>
  <modal-base @hideModal="hideModal">
    <div>
      <select v-model="selectedCountries" multiple size="20">
        <option disabled>select country</option>
        <option
          v-for="country in countries"
          :key="country.alpha2Code"
          :value="country.alpha2Code"
          >{{ getFragEmojiByCountryCode(country.alpha2Code)
          }}{{ country.name }}</option
        >
      </select>
    </div>
  </modal-base>
</template>
<script lang="ts">
import Vue from 'vue'
import { flag } from 'country-emoji'
import ModalBase from '~/components/ModalBase.vue'
import { Country } from '~/store/countries'

export default Vue.extend({
  components: {
    ModalBase
  },
  data() {
    return {
      selectedCountries: []
    }
  },
  computed: {
    countries(): Country[] {
      return this.$store.state.countries.list
    }
  },
  methods: {
    getFragEmojiByCountryCode(countryCode: string): string {
      return flag(countryCode)
    },
    hideModal(): void {
      this.$store.dispatch('modal/hideCountrySelect')
    }
  }
})
</script>
<style lang="postcss" scoped>
select {
  @apply bg-gray-100 rounded-lg p-4;
  max-width: 100%;
}
</style>
