<template>
  <div id="app">
    <HeaderWeb />

    <Nuxt />

    <FooterWeb />
  </div>
</template>


<script>
import HeaderWeb from '../components/headerWeb.vue'
import FooterWeb from '../components/footerWeb.vue'

export default {
  components: {
    HeaderWeb,
    FooterWeb,
  },
}
</script>

<style scoped>
#app {
  background: url(../assets/image.jpg) rgba(0, 0, 0, 4);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
}
</style>
