<template>
  <div class="modal">
    <div class="modal-bg" @click.prevent="$emit('hideModal')"></div>
    <div class="modal-container">
      <div class="modal-content">
        <slot></slot>
      </div>
      <button type="button" @click.prevent="$emit('hideModal')">
        <span></span>
        <span></span>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style lang="postcss" scoped>
.modal {
  @apply fixed inset-0 w-full h-full flex overflow-auto p-12;
}

.modal-bg {
  @apply fixed inset-0 w-full h-full bg-black;
  opacity: 0.8;
}

.modal-container {
  @apply m-auto relative bg-white rounded-lg p-6;
  max-width: 95%;
}

.modal-content {
  @apply overflow-hidden;
}

button {
  @apply block bg-white absolute shadow-md border;
  top: -1em;
  right: -1em;
  width: 2.5em;
  height: 2.5em;
  border-radius: 999em;
}

button > span {
  @apply block absolute m-auto inset-0 rounded-lg bg-gray-600;
  width: 50%;
  height: 2px;
}

button > span:first-child {
  transform: rotate(45deg);
}
button > span:last-child {
  transform: rotate(-45deg);
}
</style>
