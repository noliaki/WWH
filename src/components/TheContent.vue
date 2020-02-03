<template>
  <main>
    <header>
      <nuxt-link :to="prevMonthRoute" class="btn">prev month</nuxt-link>
      <h2>{{ dateString }}</h2>
      <nuxt-link :to="nextMonthRoute" class="btn">next month</nuxt-link>
    </header>
    <calendar :year="year" :month="month"></calendar>
  </main>
</template>
<script lang="ts">
import Vue from 'vue'
import Calendar from '~/components/Calendar.vue'
import { int } from '~/utils'

interface Data {
  today: Date
}

export default Vue.extend({
  components: {
    Calendar
  },
  data(): Data {
    return {
      today: new Date()
    }
  },
  computed: {
    year(): number {
      if (typeof this.$route.params.year === 'undefined') {
        return this.today.getFullYear()
      }

      return int(this.$route.params.year)
    },
    month(): number {
      if (typeof this.$route.params.month === 'undefined') {
        return this.today.getMonth() + 1
      }

      return int(this.$route.params.month)
    },
    monthIndex(): number {
      return this.month - 1
    },
    nextMonthRoute() {
      const nextMonthDate: Date = new Date(this.year, this.monthIndex + 1)

      return {
        name: 'year-month',
        params: {
          year: nextMonthDate.getFullYear(),
          month: nextMonthDate.getMonth() + 1
        }
      }
    },
    prevMonthRoute() {
      const prevMonthDate: Date = new Date(this.year, this.monthIndex - 1)

      return {
        name: 'year-month',
        params: {
          year: prevMonthDate.getFullYear(),
          month: prevMonthDate.getMonth() + 1
        }
      }
    },
    dateString(): string {
      return `${this.year}/${this.month < 10 ? '0' : ''}${this.month}`
    }
  },
  methods: {
    onClick(): void {
      this.$store.dispatch('gapi/getHolidays', {
        lang: 'jpn',
        countryId: 'japanese',
        year: this.year
      })
    }
  }
})
</script>
<style lang="postcss" scoped>
main {
  display: grid;
  grid-template-rows: auto 1fr;
}

header {
  @apply flex justify-center items-center leading-none;
}

h2 {
  @apply text-lg font-bold;
}

.btn {
  @apply py-1 px-4 text-sm bg-purple-200 text-purple-700 rounded-full;
}

.btn:first-child {
  margin-right: 2em;
}
.btn:last-child {
  margin-left: 2em;
}
</style>
