<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-transparent">
    <div class="container-fluid">
      <NuxtLink class="navbar-brand" to="/">Movie Review</NuxtLink>
      <div class="dropdown pe-5">
        <button
          id="dropdownMenuButton1"
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ username }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li>
            <NuxtLink class="dropdown-item text-white" to="/profile"
              >Account</NuxtLink
            >
          </li>
          <li>
            <a class="dropdown-item text-danger" @click="signOut">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { supabase } from '../utils/supabase'
export default {
  data() {
    return {
      username: '',
      errorMsg: null,
    }
  },
  async fetch() {
    await this.getUser()
    this.realtimeListener()
  },
  methods: {
    async signOut() {
      const { error } = await supabase.auth.signOut()
      this.$router.push('/login')
      if (error) {
        this.errorMsg = error.message
      }
    },
    async getUser() {
      const { data } = await supabase.auth.getSession()
      const { data: user } = await supabase
        .from('user')
        .select('username')
        .eq('id', data.session.user.id)

      if (user) {
        this.username = user[0].username
      }
    },
    realtimeListener() {
      supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
          },
          (payload) => {
            this.username = payload.new.username
          }
        )
        .subscribe()
    },
  },
}
</script>

<style scoped>
.dropdown .dropdown-menu {
  background-color: rgba(0, 0, 0, 0.5);
}
.dropdown-menu li a:hover {
  background-image: none;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
