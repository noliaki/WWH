<template>
  <div class="wrapper">
    <header>
      <h1>Worls Wide Holidays</h1>
    </header>
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
  grid-template-rows: auto 1fr;
}
</style>
