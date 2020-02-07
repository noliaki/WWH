<template>
  <div class="calendar">
    <div
      v-for="weekDay in week"
      :key="weekDay"
      class="calendar-cell calendar-week"
    >
      {{ weekDay }}
    </div>
    <calendar-date
      v-for="(date, index) in dates"
      :key="index"
      class="calendar-cell calendar-date"
      :date="date"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CalendarDate from '~/components/CalendarDate.vue'

export default Vue.extend({
  components: {
    CalendarDate
  },
  props: {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    }
  },
  data(): any {
    return {
      week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dates: []
    }
  },
  created(): void {
    const startDate: Date = new Date(this.year, this.month - 1)
    const startDateDay: number = startDate.getDay()
    const endDate: Date = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    )
    const endDateDate: number = endDate.getDate()
    const endDay: number = endDate.getDay()

    const len: number = startDateDay + endDateDate + (6 - endDay)

    for (let i: number = 0; i < len; i++) {
      const date: number = i + 1 - startDateDay
      this.dates[i] = new Date(this.year, this.month - 1, date)
    }
  }
})
</script>
<style lang="postcss" scoped>
.calendar {
  display: grid;
  grid-template-rows: auto;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-cell {
  @apply py-1 px-2 border-l text-right;
}

.calendar-date {
  @apply border-t;
}

.calendar-date.-outMonth {
  /* @apply opacity-25; */
}

.calendar-date:nth-child(7n) {
  @apply bg-blue-100 text-blue-700;
}
.calendar-date:nth-child(7n + 1) {
  border-left: none;
  @apply bg-red-100 text-red-700;
}
</style>
