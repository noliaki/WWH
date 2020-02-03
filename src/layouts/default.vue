<template>
  <div class="wrapper">
    <header>
      <language />
    </header>
    <nuxt />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Language from '~/components/Language.vue'

export default Vue.extend({
  components: {
    Language
  }
})
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
