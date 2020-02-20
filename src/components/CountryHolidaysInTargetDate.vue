<template>
  <modal-base @hideModal="hideModal">
    <div>
      <h2>
        {{ targetDate.getFullYear() }}.{{ targetDate.getMonth() + 1 }}.{{
          targetDate.getDate()
        }}
      </h2>
      <ul class="holiday-list">
        <li
          v-for="(item, index) in targetDateCountryHolidays"
          :key="index"
          class="holiday-item"
        >
          <div class="holiday-emoji">
            {{ $countryEmojiFlag(item.alpha2Code) }}
          </div>
          <div class="holiday-country">
            <div class="holiday-country-summary">{{ item.summary }}</div>
            <ul class="holiday-country-list">
              <li
                v-for="(summary, sIndex) in item.holidaySummaries"
                :key="'summary-' + sIndex"
                class="holiday-country-item"
              >
                {{ summary }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </modal-base>
</template>
<script lang="ts">
import Vue from 'vue'
import ModalBase from '~/components/ModalBase.vue'

export default Vue.extend({
  components: {
    ModalBase
  },
  computed: {
    targetDateCountryHolidays(): {
      alpha2Code: string
      holidaySummaries: string[]
      summary: string
    }[] {
      return this.$store.getters['gapi/getTargetCountryHolidays']
    },
    targetDate(): Date {
      return this.$store.state.gapi.targetDate
    }
  },
  methods: {
    hideModal(): void {
      this.$store.dispatch('modal/hideTargetDate')
    }
  }
})
</script>
<style lang="postcss" scoped>
h2 {
  @apply text-center font-bold bg-gray-200 py-2;
}

.holiday-item {
  @apply flex py-2;
}

.holiday-item + .holiday-item {
  @apply border-t border-dashed;
}

.holiday-emoji {
  @apply text-xl leading-none;
}

.holiday-country {
  @apply flex-grow ml-1;
}

.holiday-country-summary {
  @apply text-xs text-gray-500;
}

.holiday-country-item {
  @apply text-sm;
  margin-left: 1em;
  text-indent: -0.7em;
}

.holiday-country-item::before {
  content: '-';
}
</style>
