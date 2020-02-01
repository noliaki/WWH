<template>
  <div class="calendar">
    <header class="calendar-header">
      <div v-for="weekDay in week" :key="weekDay" class="calendar-date">
        {{ weekDay }}
      </div>
    </header>
    <div class="calendar-body">
      <div
        v-for="(date, index) in dates"
        :key="index"
        class="calendar-date"
        :class="{ '-outMonth': date.outMonth }"
      >
        {{ date.dateNum }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data(): any {
    return {
      week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dates: []
    }
  },
  created(): void {
    const startDate: Date = new Date(
      this.$route.params.year,
      parseInt(this.$route.params.month, 10) - 1
    )
    const startDateDay: number = startDate.getDay()
    const endDate: Date = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    )
    const endDateDate: number = endDate.getDate()
    const endDay: number = endDate.getDay()

    const len: number = startDateDay + endDateDate + (6 - endDay)

    console.log(startDate, endDate)

    for (let i: number = 0; i < len; i++) {
      const date: number = i + 1 - startDateDay
      const targetDate: Date = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        date
      )
      this.dates[i] = {
        dateNum: targetDate.getDate(),
        outMonth: date < 1 || date > endDateDate
      }
    }
  }
})
</script>
<style lang="postcss" scoped>
.calendar {
  display: grid;
  grid-template-rows: auto 1fr;
}

.calendar-header,
.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-date {
  @apply py-2 px-4 border-l text-right;
}

.calendar-body .calendar-date {
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
