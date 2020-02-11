<template>
  <div class="cell-wrapper" :class="{ '-holiday': isHoliday }">
    <button
      class="cell-btn"
      :class="{ '-isOutMonth': isOutMonth }"
      @click.prevent="onClickDate"
    >
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
    holidayCountries(): any[] {
      return this.$store.getters['gapi/getCountryHolidaysByDateString'](
        this.formattedDate
      )
    },
    isHoliday(): boolean {
      return this.holidayCountries.length > 0
    }
  },
  methods: {
    getFragEmojiByCountryCode(countryCode: string): string {
      return flag(countryCode)
    },
    onClickDate(): void {
      this.$store.dispatch('gapi/setTargetDateString', this.formattedDate)
      this.$store.dispatch('modal/showTargetDate')
    }
  }
})
</script>
<style lang="postcss" scoped>
.cell-wrapper {
  @apply relative;
}

.cell-btn {
  @apply block absolute inset-0 w-full h-full pointer-events-none;
}

.-holiday > .cell-btn {
  @apply pointer-events-auto;
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
  @apply flex flex-wrap leading-none overflow-hidden;
}
</style>
