<template>
  <main>
    <header>
      <nuxt-link :to="prevMonthRoute">prev month</nuxt-link>
      {{ dateString }}
      <button type="button" @click.prevent="onClick">GET</button>
      <nuxt-link :to="nextMonthRoute">next month</nuxt-link>
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
        lang: navigator.language,
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
</style>
