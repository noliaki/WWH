<template>
  <select
    v-model.lazy="selectedCountries"
    multiple
    size="20"
    @change="onChange"
  >
    <option disabled>select country</option>
    <option
      v-for="country in selectableCountries"
      :key="country.alpha2Code"
      :value="country"
      >{{ getFragEmojiByCountryCode(country.alpha2Code)
      }}{{ country.name }}</option
    >
  </select>
</template>
<script lang="ts">
import Vue from 'vue'
import { flag } from 'country-emoji'
import { Country } from '~/store/countries'

export default Vue.extend({
  data() {
    return {
      selectedCountries: []
    }
  },
  computed: {
    selectableCountries(): Country[] {
      return this.countries.filter(
        (country: Country): boolean => country.googleCalendarId !== undefined
      )
    },
    countries(): Country[] {
      return this.$store.state.countries.list
    }
  },
  methods: {
    getFragEmojiByCountryCode(countryCode: string): string {
      return flag(countryCode)
    },
    onChange(_$event: Event): void {
      this.$store.dispatch(
        'countries/setSelectedCountries',
        this.selectedCountries
      )
    }
  }
})
</script>
