<template>
  <div
    class="cell-wrapper"
    :class="{
      '-holiday': isHoliday,
      '-sunday': index % 7 === 0,
      '-saturday': (index % 7) - 6 === 0,
      '-waiting': isWaiting && holidays.length > 0
    }"
  >
    <button
      class="cell-btn"
      :class="{ '-isOutMonth': isOutMonth }"
      @click.prevent="onClickDate"
    >
      <div class="cell-content">
        <div class="cell-date">{{ date.getDate() }}</div>
        <transition name="fade">
          <div v-if="isHoliday" class="cell-holidays">
            <span v-for="(holiday, hIndex) in holidayCountries" :key="hIndex">
              {{ getFragEmojiByCountryCode(holiday.alpha2Code) }}
            </span>
          </div>
        </transition>
      </div>
    </button>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { flag } from 'country-emoji'
import { int, dateFormat } from '~/utils'

interface Data {
  timerId: number | undefined
  holidayCountries: any[]
  isWaiting: boolean
}

export default Vue.extend({
  props: {
    date: {
      type: Date as PropType<Date>,
      required: true
    },
    index: {
      type: Number as PropType<number>,
      required: true
    }
  },
  data(): Data {
    return {
      timerId: undefined,
      holidayCountries: [],
      isWaiting: false
    }
  },
  computed: {
    isOutMonth(): boolean {
      const cellMonth: number = this.date.getMonth() + 1
      const currentMonth: number = int(this.$route.params.month)

      return cellMonth !== currentMonth
    },
    selectedLanguage(): string {
      return this.$store.state.language.selectedLanguage
    },
    isHoliday(): boolean {
      return this.holidayCountries.length > 0
    },
    holidays(): any[] {
      return this.$store.state.gapi.holidays
    }
  },
  watch: {
    holidays(): void {
      this.startTimer()
    }
  },
  beforeDestroy(): void {
    this.stopTimer()
    this.isWaiting = false
  },
  mounted(): void {
    this.startTimer()
  },
  methods: {
    getFragEmojiByCountryCode(countryCode: string): string {
      return flag(countryCode)
    },
    onClickDate(): void {
      this.$store.dispatch('gapi/setTargetDate', this.date)
      this.$store.dispatch('modal/showTargetDate')
    },
    getHoliday(): void {
      this.holidayCountries = this.$store.getters[
        'gapi/getCountryHolidaysByDateString'
      ](dateFormat(this.date))
    },
    startTimer(): void {
      this.isWaiting = true
      this.stopTimer()
      this.timerId = window.setTimeout(() => {
        this.getHoliday()
        this.isWaiting = false
      }, this.index * 60)
    },
    stopTimer(): void {
      if (this.timerId) {
        window.clearTimeout(this.timerId)
      }
    }
  }
})
</script>
<style lang="postcss" scoped>
.cell-wrapper {
  @apply relative;
}

.cell-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 3vw;
  height: 3vw;
  margin: auto;
  border-radius: 999em;
  border: 3px solid #81e6d9;
  opacity: 0;
  border-top: 3px solid #e6fffa;
  transition: opacity 300ms linear;
}

.cell-wrapper.-waiting::after {
  opacity: 1;
  animation: loading 700ms linear 0s infinite normal forwards;
}

.cell-btn {
  @apply block absolute inset-0 w-full h-full pointer-events-none;
}

.cell-btn:hover::after {
  content: '';
  @apply block absolute inset-0 border-4 border-green-300 pointer-events-none;
}

.-holiday > .cell-btn {
  @apply pointer-events-auto;
}

.cell-content {
  @apply flex flex-col w-full h-full text-right px-2 py-1;
}

.-isOutMonth {
  opacity: 0.2;
}

.-saturday {
  @apply bg-blue-100 text-blue-700;
}

.-holiday,
.-sunday {
  @apply bg-red-100 text-red-700;
}

.cell-holidays {
  @apply flex-grow leading-none overflow-auto;
}
</style>
