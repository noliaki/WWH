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
    <transition name="fade">
      <div v-show="$store.state.gapi.isFetching" class="loading"></div>
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

.loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
}

.loading::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 40px;
  height: 40px;
  border: 6px solid rgb(16, 153, 245);
  border-radius: 999em;
  border-top-color: rgba(16, 153, 245, 0.2);
  animation: loading 700ms linear 0s infinite normal forwards;
}

input,
button,
select,
option {
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
}

@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
