<template>
  <div class="cell-wrapper">
    <button :class="{ '-isOutMonth': isOutMonth }">
      <div class="cell-content">{{ date.getDate() }}</div>
    </button>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { int } from '~/utils'

export default Vue.extend({
  props: {
    date: {
      type: Date as PropType<Date>,
      required: true
    }
  },
  computed: {
    isOutMonth(): boolean {
      const cellMonth: number = this.date.getMonth() + 1
      const currentMonth: number = int(this.$route.params.month)

      return cellMonth !== currentMonth
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
</style>
