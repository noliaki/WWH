<template>
  <main>
    <header>
      <div class="header-inner">
        <div class="heading">
          <nuxt-link :to="prevMonthRoute" class="btn btn-prev">prev</nuxt-link>
          <h2>{{ dateString }}</h2>
          <nuxt-link :to="nextMonthRoute" class="btn btn-next">next</nuxt-link>
        </div>
        <button
          type="button"
          class="btn-country-select"
          @click.prevent="showCountrySelect"
        >
          select country
        </button>
      </div>
      <language class="language" />
    </header>
    <calendar :year="year" :month="month"></calendar>
  </main>
</template>
<script lang="ts">
import Vue from 'vue'
import Calendar from '~/components/Calendar.vue'
import Language from '~/components/Language.vue'
import { int } from '~/utils'

interface Data {
  today: Date
}

export default Vue.extend({
  components: {
    Calendar,
    Language
  },
  data(): Data {
    return {
      today: new Date()
    }
  },
  computed: {
    targetDate(): Date {
      const today: Date = new Date()

      return new Date(
        (this.$route.params.year && int(this.$route.params.year)) ||
          today.getFullYear(),
        (this.$route.params.month && int(this.$route.params.month) - 1) ||
          today.getMonth()
      )
    },
    year(): number {
      return this.targetDate.getFullYear()
    },
    month(): number {
      return this.monthIndex + 1
    },
    monthIndex(): number {
      return this.targetDate.getMonth()
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
    },
    showCountrySelect(): void {
      this.$store.dispatch('modal/showCountrySelect')
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
  @apply relative bg-gray-100 px-12 py-2;
}

.heading {
  @apply flex justify-center items-center leading-none;
}

.header-inner {
  @apply text-center;
}

.language {
  @apply absolute top-0 right-0 bottom-0;
}

h2 {
  @apply text-lg font-bold;
}

.btn {
  @apply py-1 px-4 text-sm bg-purple-200 text-purple-700 rounded-full;
}

.btn-prev {
  margin-right: 2em;
}
.btn-next {
  margin-left: 2em;
}

.btn-country-select {
  @apply mt-4 py-1 px-4 text-sm bg-blue-200 text-blue-700 rounded-full;
}
</style>
