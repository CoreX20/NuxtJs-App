<template>
  <!-- Hero -->
  <div
    class="p-5 text-center"
    :style="`background: linear-gradient(rgba(0, 1, 22, 1), rgba(0,0,0, 0.1)), url(${require('@/assets/hero.jpg')}); background-size: cover;
  background-repeat: no-repeat; background-position: center;height: 350px`"
  >
    <div class="mask">
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="text-white">
          <h1 class="mt-5 mb-3 fw-bold">Welcome!</h1>
          <h3 class="mb-3">
            Explore the world of movies and discover your next favorite film.
          </h3>
        </div>
      </div>
    </div>

    <!-- Search bar -->
    <div class="input-group mt-5">
      <input
        v-model.lazy="searchQuery"
        type="search"
        class="form-control rounded-pill glow"
        placeholder="Search for movie"
        aria-label="Search"
        aria-describedby="search-addon"
        @keyup.enter="emitSearchQuery"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchQuery: '',
    }
  },
  methods: {
    emitSearchQuery() {
      this.$emit('search-query', this.searchQuery)
    },
  },
}
</script>
<style scoped>
.glow {
  --box-shadow-color: #ffffff;
  box-shadow: 0 0 20px -2px var(--box-shadow-color);
}
</style>
