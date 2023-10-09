<template>
  <!-- Loading -->
  <loadingCard v-if="$fetchState.pending" />
  <!-- Movie Info -->
  <div v-else>
    <div
      class="py-5"
      :style="{
        height: '580px',
        backgroundImage: `linear-gradient(rgba(0,1,22, 1), rgba(0,0,0, 0.6)), url(
          'https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="container">
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
      </div>
    </div>

    <div class="container">
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
                  :src="
                    profile_image
                      ? `${profile_image}?time=${new Date().getTime()}`
                      : require('../../assets/profile.png')
                  "
                  alt="avatar"
                  width="65"
                  height="65"
                />
                <div class="w-100">
                  <h5>Add a comment</h5>
                  <form @submit.prevent="insertComment">
                    <div class="form-outline">
                      <label class="form-label" for="Comment"
                        >Share Your Thoughts</label
                      >
                      <textarea
                        id="Comment"
                        v-model="content"
                        class="form-control"
                        rows="4"
                        placeholder="Leave Your Comment"
                      ></textarea>
                    </div>
                    <div class="mt-3">
                      <button type="submit" class="btn btn-success">
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments from Supabase -->
      <div class="row d-flex mt-5">
        <div v-for="comment in comments" :key="comment.id" class="col-12">
          <div class="d-flex flex-start mb-4">
            <img
              class="rounded-circle shadow-1-strong me-3"
              :src="
                profile_image
                  ? `${profile_image}?time=${new Date().getTime()}`
                  : require('../../assets/profile.png')
              "
              alt="avatar"
              width="65"
              height="65"
            />

            <div class="card w-auto">
              <div class="card-body p-4">
                <div class="">
                  <h5>{{ comment.author }}</h5>
                  <p class="small">
                    {{
                      new Date(comment.created_at).toLocaleString('en-us', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    }}
                  </p>
                  <div v-if="isEditingComment && commentId === comment.id">
                    <textarea
                      v-model="newContent"
                      class="form-control"
                      rows="4"
                    ></textarea>
                    <button
                      class="btn btn-success"
                      @click="updateComment(comment)"
                    >
                      Edit
                    </button>
                    <a
                      class="text-underline text-underline text-secondary"
                      @click="editComment(comment)"
                      >Cancel</a
                    >
                  </div>
                  <div v-else>
                    <p>
                      {{ comment.content }}
                    </p>
                    <div v-if="user_id == comment.user_id">
                      <a
                        class="fw-bold text-underline text-secondary"
                        @click="editComment(comment)"
                        >Edit</a
                      >
                      <a
                        class="text-underline text-secondary"
                        @click="deleteComment(comment)"
                        >Delete</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments from TMDB -->
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
                </div>
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
import { supabase } from '../../utils/supabase'

require('nuxt-video-player/src/assets/css/main.css')
export default {
  components: { loadingCard, VideoPlayer },
  data() {
    return {
      movie: null,
      reviews: [],
      profile_image: null,
      user_id: null,
      comments: [],
      trailers: [],
      commentId: null,
      isEditingComment: false,
      content: '',
      newContent: '',
    }
  },
  async fetch() {
    await this.getSingleMovie()
    await this.getReviews()
    await this.getTrailers()
    await this.getCommentFromSupabase()
    await this.getUser()
    await this.getProfileImage()
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
  fetchDelay: 1000,
  methods: {
    async getSingleMovie() {
      const data = axios.get(
        `https://api.themoviedb.org/3/movie/${this.$route.params.movieid}?language=en-US`,
        {
          headers: {
            Authorization: process.env.apiToken,
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
            Authorization: process.env.apiToken,
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
            Authorization: process.env.apiToken,
            accept: 'application/json',
          },
        }
      )
      const result = await data
      result.data.results.forEach((trailer) => {
        this.trailers.push(trailer)
      })
    },
    async getProfileImage() {
      const { data } = await supabase.auth.getSession()
      const { data: user } = await supabase
        .from('user')
        .select('image_url')
        .eq('id', data.session.user.id)
      if (user && user !== null) {
        this.profile_image = user[0].image_url
      }
    },
    async insertComment() {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            movie_id: this.$route.params.movieid,
            content: this.content,
          },
        ])
        .select()
      if (error) {
        throw error
      }
      await this.getCommentFromSupabase()
      this.content = ''
    },
    async getCommentFromSupabase() {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', this.$route.params.movieid)
        .order('created_at', { ascending: false })
      if (reviews) {
        this.comments = reviews
      }
    },
    async updateComment(comment) {
      const { data } = await supabase
        .from('reviews')
        .update({ content: this.newContent })
        .eq('id', comment.id)
        .select()
      if (data) {
        const index = this.comments.findIndex((x) => x.id === comment.id)
        this.$set(this.comments, index, data[0])
        this.newContent = ''
        this.isEditingComment = false
      }
    },
    async deleteComment(comment) {
      this.commentId = comment.id
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', this.commentId)
      if (error) {
        throw error
      }
      this.comments = this.comments.filter((c) => c.id !== this.commentId)
    },
    async getUser() {
      const { data } = await supabase.auth.getSession()
      if (data) {
        this.user_id = data.session.user.id
      }
    },
    editComment(comment) {
      this.isEditingComment = !this.isEditingComment
      this.commentId = comment.id
      this.newContent = comment.content
    },
  },
}
</script>


<style>
a {
  cursor: pointer;
}
</style>