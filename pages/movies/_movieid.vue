<template>
  <!-- Loading -->
  <loadingCard v-if="$fetchState.pending" />
  <!-- Movie Info -->
  <div v-else class="container mt-4">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="movie-img">
          <img
            :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`"
            alt=""
            style="max-height: 500px"
          />
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-8">
        <div class="movie-details text-white">
          <h1>{{ movie.title }}</h1>
          <blockquote class="blockquote">
            <p>"{{ movie.tagline }}"</p>
            <footer class="blockquote-footer">{{ movie.title }}</footer>
          </blockquote>
          <p>{{ movie.overview }}</p>
          <p>
            <b>Released:</b>
            {{
              new Date(movie.release_date).toLocaleString('en-us', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            }}
          </p>
          <p><b>Duration:</b> {{ movie.runtime }} minutes</p>
          <p>
            <b>Genre:</b>
            {{ movie.genres.map((genre) => genre.name).join(', ') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Trailer -->
    <div class="row justify-content-center mt-5">
      <h1 class="text-white">Trailers</h1>
      <div
        v-for="(trailer, index) in visibleTrailers"
        :key="index"
        class="col-12 col-lg-6 mb-3"
      >
        <div v-if="trailer.site === 'YouTube'" class="player">
          <video-player
            :src="`https://www.youtube.com/embed/${trailer.key}?rel=0`"
          />
        </div>
        <div v-else-if="trailer.site === 'Vimeo'" class="player">
          <video-player
            :src="`https://player.vimeo.com/video/${trailer.key}`"
          />
        </div>
      </div>
    </div>

    <!-- Input Comment -->
    <div class="row d-flex justify-content-center mt-2">
      <h1 class="text-white">Comments</h1>
      <div class="col-12">
        <div class="card">
          <div class="card-body p-4">
            <div class="d-flex flex-start w-100">
              <img
                class="rounded-circle shadow-1-strong me-3"
                src="../../assets/profile.png"
                alt="avatar"
                width="65"
                height="65"
              />
              <div class="w-100">
                <h5>Add a comment</h5>
                <form @submit.prevent="handleSubmit">
                  <div class="form-outline">
                    <label class="form-label" for="Comment"
                      >Share Your Thoughts</label
                    >
                    <textarea
                      id="Comment"
                      v-model="newReview.content"
                      class="form-control"
                      rows="4"
                      placeholder="Leave Your Comment"
                    ></textarea>
                  </div>
                  <div class="mt-3">
                    <button type="submit" class="btn btn-success">Send</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments -->
    <div class="row d-flex mt-5">
      <div v-for="(review, index) in reviews" :key="index" class="col-12">
        <div class="d-flex flex-start mb-4">
          <img
            class="rounded-circle shadow-1-strong me-3"
            :src="
              review.author_details.avatar_path
                ? `https://image.tmdb.org/t/p/w500/${review.author_details.avatar_path}`
                : require('../../assets/profile.png')
            "
            alt="avatar"
            width="65"
            height="65"
          />

          <div class="card w-auto">
            <div class="card-body p-4">
              <div class="">
                <h5>{{ review.author }}</h5>
                <p class="small">
                  {{
                    new Date(review.created_at).toLocaleString('en-us', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                </p>
                <p>
                  {{ review.content }}
                </p>
                <!--
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <a href="#!" class="link-muted me-2"
                      ><i class="fas fa-thumbs-up me-1"></i>132</a
                    >
                    <a href="#!" class="link-muted"
                      ><i class="fas fa-thumbs-down me-1"></i>15</a
                    >
                  </div>
                  <a href="#!" class="link-muted"
                    ><i class="fas fa-reply me-1"></i> Reply</a
                  >
                </div>
                -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import VideoPlayer from 'nuxt-video-player'
import loadingCard from '../../components/loadingCard.vue'

require('nuxt-video-player/src/assets/css/main.css')
export default {
  components: { loadingCard, VideoPlayer },
  data() {
    return {
      movie: null,
      reviews: [],
      trailers: [],
      newReview: {
        author: 'Anonymous',
        author_details: {
          avatar_path: null,
        },
        content: '',
        created_at: '',
      },
    }
  },
  async fetch() {
    await this.getSingleMovie()
    await this.getReviews()
    await this.getTrailers()
  },
  computed: {
    visibleTrailers() {
      const filteredTrailers = this.trailers.filter((trailer) => {
        return trailer.type === 'Trailer'
      })

      if (filteredTrailers.length > 0) {
        if (filteredTrailers.length === 1) {
          return [filteredTrailers[0], this.trailers[0]]
        } else {
          return filteredTrailers.slice(0, 2)
        }
      } else {
        return this.trailers.slice(0, 2)
      }
    },
  },
  /* computed: {
    sortedReviews() {
      return this.reviews.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at)
      })
    },
  }, */
  fetchDelay: 1000,
  methods: {
    async getSingleMovie() {
      const data = axios.get(
        `https://api.themoviedb.org/3/movie/${this.$route.params.movieid}?language=en-US`,
        {
          headers: {
            Authorization: this.$config.myPrivateToken,
            accept: 'application/json',
          },
        }
      )
      const result = await data
      this.movie = result.data
    },
    async getReviews() {
      const data = axios.get(
        `https://api.themoviedb.org/3/movie/${this.$route.params.movieid}/reviews?language=en-US&page=1`,
        {
          headers: {
            Authorization: this.$config.myPrivateToken,
            accept: 'application/json',
          },
        }
      )
      const result = await data
      result.data.results.forEach((review) => {
        this.reviews.push(review)
      })
    },
    async getTrailers() {
      const data = axios.get(
        `https://api.themoviedb.org/3/movie/${this.$route.params.movieid}/videos?language=en-US`,
        {
          headers: {
            Authorization: this.$config.myPrivateToken,
            accept: 'application/json',
          },
        }
      )
      const result = await data
      result.data.results.forEach((trailer) => {
        this.trailers.push(trailer)
      })
    },
    handleSubmit() {
      this.newReview.created_at = new Date().toLocaleString('en-us', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
      this.reviews.unshift(this.newReview)
      this.newReview = {
        author: 'Anonymous',
        author_details: {
          avatar_path: null,
        },
        content: '',
        created_at: '',
      }
    },
  },
}
</script>


<style>
</style>