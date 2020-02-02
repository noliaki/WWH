<template>
  <div class="wrapper">
    <nuxt />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style lang="postcss">
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
</style>
