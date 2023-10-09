<template>
  <div class="home">
    <!-- Hero -->
    <heroComponent @search-query="handleSearchQuery" />
    <div class="container-fluid px-5 py-3 position-relative">
      <!-- Search Feature -->
      <div class="w-25 mb-3">
        <div class="text-white mt-3">
          <label>Filter by Genre:</label>
          <select v-model="selectedGenre" class="form-select">
            <option selected value="">All</option>
            <option
              v-for="(genre, index) in genres"
              :key="index"
              :value="genre.id"
            >
              {{ genre.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Prev Next -->
      <div class="position-absolute mt-5 me-5 end-0 top-0">
        <button
          :disabled="page === 1"
          type="button"
          class="btn btn-info"
          @click="prevPage"
        >
          Prev
        </button>
        <button type="button" class="btn btn-info" @click="nextPage">
          Next
        </button>
      </div>
      <!-- Loading -->
      <loadingCard v-if="$fetchState.pending" />

      <!-- Search Movies -->
      <div v-if="searchQuery !== ''" id="searchResults" class="row p-5">
        <div
          v-for="(movie, index) in resultQuery"
          :key="index"
          class="col-12 col-md-6 col-lg-3 mb-4"
        >
          <div class="card text-dark">
            <div class="hover">
              <img
                class="card-img-top"
                :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`"
                alt=""
              />
            </div>
            <div class="opacity0">
              <NuxtLink
                class="position-absolute top-50 start-50 translate-middle"
                :to="{ name: 'movies-movieid', params: { movieid: movie.id } }"
                ><button type="button" class="btn btn-secondary">
                  Info Selengkapnya
                </button></NuxtLink
              >
            </div>
            <div class="card-body">
              <h5 class="card-title">
                {{ movie.title.slice(0, 25) }}
                <span v-if="movie.title.length > 25">...</span>
              </h5>
              <p
                class="rate text-white position-absolute top-0 start-0 d-flex justify-content-center align-items-center shadow"
              >
                {{ movie.vote_average.toFixed(1) }}
              </p>
            </div>
            <div class="card-footer">
              <small class="text-muted"
                >Released: {{ movie.release_date }}</small
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Filtered Movies -->
      <div v-else-if="selectedGenre !== ''" class="row">
        <div
          v-for="(movie, index) in filteredMovies"
          :key="index"
          class="col-12 col-md-6 col-lg-3 mb-4"
        >
          <div class="card text-dark">
            <div class="hover">
              <img
                class="card-img-top"
                :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`"
                alt=""
              />
            </div>
            <div class="opacity0">
              <NuxtLink
                class="position-absolute top-50 start-50 translate-middle"
                :to="{ name: 'movies-movieid', params: { movieid: movie.id } }"
                ><button type="button" class="btn btn-secondary">
                  Info Selengkapnya
                </button></NuxtLink
              >
            </div>
            <div class="card-body">
              <h5 class="card-title">
                {{ movie.title.slice(0, 25) }}
                <span v-if="movie.title.length > 25">...</span>
              </h5>
              <p
                class="rate text-white position-absolute top-0 start-0 d-flex justify-content-center align-items-center shadow"
              >
                {{ movie.vote_average.toFixed(1) }}
              </p>
            </div>
            <div class="card-footer">
              <small class="text-muted"
                >Released: {{ movie.release_date }}</small
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Movies  -->
      <div v-else class="row pt-3" id="Movies">
        <div
          v-for="(movie, index) in movies"
          :key="index"
          class="col-12 col-md-6 col-lg-3 mb-4"
        >
          <div class="card text-dark">
            <div class="hover">
              <img
                class="card-img-top"
                :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`"
                alt=""
              />
            </div>
            <div class="opacity0">
              <NuxtLink
                class="position-absolute top-50 start-50 translate-middle"
                :to="{ name: 'movies-movieid', params: { movieid: movie.id } }"
                ><button type="button" class="btn btn-secondary">
                  Info Selengkapnya
                </button></NuxtLink
              >
            </div>
            <div class="card-body">
              <h5 class="card-title">
                {{ movie.title.slice(0, 25) }}
                <span v-if="movie.title.length > 25">...</span>
              </h5>
              <p
                class="rate text-white position-absolute top-0 start-0 d-flex justify-content-center align-items-center shadow"
              >
                {{ movie.vote_average }}
              </p>
            </div>
            <div class="card-footer">
              <small class="text-muted"
                >Released: {{ movie.release_date }}</small
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import heroComponent from '../components/heroComponent.vue'
import loadingCard from '../components/loadingCard.vue'
export default {
  components: { loadingCard, heroComponent },
  data() {
    return {
      movies: [],
      page: 1,
      resultQuery: [],
      searchQuery: '',
      selectedGenre: '',
      genres: [
        {
          id: 28,
          name: 'Action',
        },
        {
          id: 12,
          name: 'Adventure',
        },
        {
          id: 16,
          name: 'Animation',
        },
        {
          id: 35,
          name: 'Comedy',
        },
        {
          id: 18,
          name: 'Drama',
        },
        {
          id: 10751,
          name: 'Family',
        },
        {
          id: 14,
          name: 'Fantasy',
        },
        {
          id: 27,
          name: 'Horror',
        },
        {
          id: 9648,
          name: 'Mystery',
        },
        {
          id: 878,
          name: 'Science Fiction',
        },
        {
          id: 53,
          name: 'Thriller',
        },
      ],
    }
  },
  async fetch() {
    if (this.searchQuery === '') {
      await this.getMovies()
      return
    }
    await this.searchMovies()
  },
  fetchDelay: 1000,
  computed: {
    filteredMovies() {
      if (this.selectedGenre === '') {
        return this.movies
      } else {
        return this.movies.filter((movie) =>
          movie.genre_ids.includes(this.selectedGenre)
        )
      }
    },
  },
  methods: {
    async getMovies() {
      const data = axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${this.page}`,
        {
          headers: {
            Authorization: process.env.apiToken,
            accept: 'application/json',
          },
        }
      )
      const result = await data
      result.data.results.forEach((movie) => {
        this.movies.push(movie)
      })
    },
    async searchMovies() {
      const data = axios.get(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${this.searchQuery}`,
        {
          headers: {
            Authorization: process.env.apiToken,
            accept: 'application/json',
          },
        }
      )
      const result = await data
      result.data.results.forEach((movie) => {
        this.resultQuery.push(movie)
      })
    },

    handleSearchQuery(query) {
      this.resultQuery = []
      this.searchQuery = query
      this.$fetch()

      const searchResultElement = document.getElementById('searchResults')
      if (searchResultElement) {
        searchResultElement.scrollIntoView({ behavior: 'smooth' })
      }
    },

    nextPage() {
      const MoviesElement = document.getElementById('Movies')
      if (MoviesElement) {
        MoviesElement.scrollIntoView({ behavior: 'smooth' })
      }
      this.page += 1
      this.movies = []
      return this.getMovies()
    },

    prevPage() {
      const MoviesElement = document.getElementById('Movies')
      if (MoviesElement) {
        MoviesElement.scrollIntoView({ behavior: 'smooth' })
      }
      if (this.page > 1) {
        this.page -= 1
      }
      this.movies = []
      return this.getMovies()
    },
  },
}
</script>

<style>
.vh100 {
  height: 100vh;
}
.opacity0 {
  opacity: 0;
  transition: 0.3s ease-in-out;
}

.card:hover .opacity0 {
  opacity: 1;
}

.hover :hover {
  opacity: 0.8;
}
.rate {
  width: 40px;
  height: 40px;
  background-color: #ffd700;
  border-radius: 0 0 16px 0;
}
</style>
