<template>
  <div id="app">
    <FooterWeb />
    <Nuxt />
  </div>
</template>
<script>
import FooterWeb from '../components/footerWeb.vue'

export default {
  components: { FooterWeb },
}
</script>
<style scoped>
#app {
  background: rgba(0, 1, 22, 1);
  min-height: 100vh;
}
</style>