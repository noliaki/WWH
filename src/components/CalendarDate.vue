<template>
  <div class="cell-wrapper" :class="{ '-holiday': isHoliday }">
    <button :class="{ '-isOutMonth': isOutMonth }">
      <div class="cell-content">
        {{ date.getDate() }}
        <div v-if="isHoliday" class="cell-holidays">
          <div v-for="(holiday, hIndex) in holidayCountries" :key="hIndex">
            {{ getFragEmojiByCountryCode(holiday.alpha2Code) }}
          </div>
        </div>
      </div>
    </button>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { flag } from 'country-emoji'
import { int, dateFormat } from '~/utils'

export default Vue.extend({
  props: {
    date: {
      type: Date as PropType<Date>,
      required: true
    }
  },
  computed: {
    formattedDate(): string {
      return dateFormat(this.date)
    },
    isOutMonth(): boolean {
      const cellMonth: number = this.date.getMonth() + 1
      const currentMonth: number = int(this.$route.params.month)

      return cellMonth !== currentMonth
    },
    selectedLanguage(): string {
      return this.$store.state.language.selectedLanguage
    },
    holidaysInYear(): any[] {
      return (
        (this.$store.state.gapi.holidays[this.selectedLanguage] &&
          this.$store.state.gapi.holidays[this.selectedLanguage][
            this.$route.params.year
          ]) ||
        []
      )
    },
    holidayCountries(): any[] {
      return this.holidaysInYear.reduce((prev: any, current: any): any[] => {
        const holidays = current.holidays
          .filter((holidayData: any): boolean => {
            return (
              this.formattedDate >= holidayData.start.date &&
              this.formattedDate < holidayData.end.date
            )
          })
          .map((holiday: any): any => ({
            summary: holiday.summary,
            alpha2Code: current.alpha2Code
          }))

        if (holidays.length > 0) {
          prev = prev.concat(holidays)
        }

        return prev
      }, [])
    },
    isHoliday(): boolean {
      return this.holidayCountries.length > 0
    }
  },
  methods: {
    getFragEmojiByCountryCode(countryCode: string): string {
      return flag(countryCode)
    }
  }
})
</script>
<style lang="postcss" scoped>
.cell-wrapper {
  @apply relative;
}

.cell-wrapper > button {
  @apply block absolute inset-0 w-full h-full;
}

.cell-content {
  @apply w-full h-full text-right px-2 py-1;
}

.-isOutMonth {
  opacity: 0.2;
}

.-holiday {
  @apply bg-red-100;
}

.cell-holidays {
  @apply flex flex-wrap;
}
</style>
