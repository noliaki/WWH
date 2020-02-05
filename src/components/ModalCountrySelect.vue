<template>
  <modal-base @hideModal="hideModal">
    <div>
      <select v-model="selectedCountries" multiple size="20">
        <option disabled>select country</option>
        <option
          v-for="country in selectableCountries"
          :key="country.alpha2Code"
          :value="country"
          >{{ getFragEmojiByCountryCode(country.alpha2Code)
          }}{{ country.name }}</option
        >
      </select>
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
import { flag } from 'country-emoji'
import ModalBase from '~/components/ModalBase.vue'
import { Country, CalendarIdMap } from '~/store/countries'
import { int } from '~/utils'

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
    selectableCountries(): (Country & CalendarIdMap)[] {
      return this.$store.getters['countries/calendarIdMaps']
        .map((item: CalendarIdMap): (Country & CalendarIdMap) | undefined => {
          const targetCountry: Country | undefined = this.countries.find(
            (country: Country): boolean =>
              country.alpha2Code === item.alpha2Code
          )

          if (targetCountry) {
            return Object.assign({}, item, targetCountry)
          }

          return undefined
        })
        .filter(
          (item: (Country & CalendarIdMap) | undefined): boolean =>
            item !== undefined
        )
    },
    countries(): Country[] {
      return this.$store.state.countries.list
    },
    selectedCalendarIds(): (string | undefined)[] {
      return this.selectedCountries.map(
        (item: Country & CalendarIdMap): string => item.countryCalendarId
      )
    }
  },
  methods: {
    getFragEmojiByCountryCode(countryCode: string): string {
      return flag(countryCode)
    },
    hideModal(): void {
      this.$store.dispatch('modal/hideCountrySelect')
    },
    onClickFetch(): void {
      if (this.selectedCountries.length <= 0) return

      this.$store.dispatch('gapi/fetchHolidays', {
        year: int(this.$route.params.year),
        calendarCountryIds: this.selectedCalendarIds,
        language: this.$store.state.language.selectedLanguage
      })
    }
  }
})
</script>
<style lang="postcss" scoped>
select {
  @apply bg-gray-100 rounded-lg p-4 block;
  width: 100%;
}

.btn-fetch-holiday {
  @apply bg-blue-100 rounded-full py-1 px-4;
}
</style>
