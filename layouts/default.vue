<template>
  <div id="app">
    <HeaderWeb />
    <Nuxt keep-alive />
  </div>
</template>


<script>
import HeaderWeb from '../components/headerWeb.vue'

export default {
  components: {
    HeaderWeb,
  },
}
</script>

<style scoped>
#app {
  background: rgba(0, 1, 22, 1);
  min-height: 100vh;
}
</style>
