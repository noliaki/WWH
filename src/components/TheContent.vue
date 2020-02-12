<template>
  <main>
    <header>
      <div class="header-inner">
        <div class="heading">
          <nuxt-link :to="prevMonthRoute" class="btn btn-prev">prev</nuxt-link>
          <h2>
            <span class="header-year">{{ year }}</span
            >.<span class="header-month">{{ month }}</span>
          </h2>
          <nuxt-link :to="nextMonthRoute" class="btn btn-next">next</nuxt-link>
        </div>
      </div>
      <div class="country-language">
        <button
          type="button"
          class="btn-country-select"
          @click.prevent="showCountrySelect"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="globe"
            class="svg-inline--fa fa-globe fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            width="496"
            height="512"
            viewBox="0 0 496 512"
          >
            <path
              fill="#808080"
              d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"
            ></path>
          </svg>
        </button>
      </div>
    </header>
    <calendar :year="year" :month="month"></calendar>
  </main>
</template>
<script lang="ts">
import Vue from 'vue'
import Calendar from '~/components/Calendar.vue'
import { int } from '~/utils'

interface Data {
  targetDate: Date
}

export default Vue.extend({
  components: {
    Calendar
  },
  data(): Data {
    return {
      targetDate: new Date()
    }
  },
  computed: {
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
    }
  },
  created(): void {
    const today: Date = new Date()

    const year: number = int(this.$route.params.year)
    const monthIndex: number = int(this.$route.params.month) - 1

    this.targetDate = new Date(
      isNaN(year) ? today.getFullYear() : year,
      isNaN(monthIndex) ? today.getMonth() : monthIndex
    )
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

.country-language {
  @apply absolute top-0 right-0 bottom-0 flex;
}

.header-year {
  @apply text-base;
}

.header-month {
  @apply text-xl font-bold;
}

.btn {
  @apply py-1 px-4 text-sm bg-purple-200 text-purple-700 rounded-full;
}

.btn-prev {
  margin-right: 3vw;
}

.btn-next {
  margin-left: 3vw;
}

.btn-country-select {
  @apply flex justify-center items-center bg-gray-300 leading-none;
  width: 20vw;
  max-width: 40px;
}

.btn-country-select svg {
  display: block;
  max-width: 50%;
  height: auto;
}
</style>
