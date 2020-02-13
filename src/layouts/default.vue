<template>
  <div class="wrapper">
    <nuxt />
    <transition name="fade">
      <modal-country-select v-show="$store.state.modal.isShownCountrySelect" />
    </transition>
    <transition name="fade">
      <country-holidays-in-target-date
        v-show="$store.state.modal.isShownTargetDate"
      />
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ModalCountrySelect from '~/components/ModalCountrySelect.vue'
import CountryHolidaysInTargetDate from '~/components/CountryHolidaysInTargetDate.vue'

export default Vue.extend({
  components: {
    ModalCountrySelect,
    CountryHolidaysInTargetDate
  },
  middleware: 'redirectIfNoDate'
})
</script>
<style lang="postcss">
*,
*::before,
*::after {
  box-sizing: border-box;
}

*::before,
*::after {
  pointer-events: none;
}

html,
body,
#__nuxt,
#__layout,
.wrapper {
  overflow: hidden;
  height: 100%;
}

.wrapper {
  display: grid;
  grid-template-rows: 1fr;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms linear;
}
</style>
