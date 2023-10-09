<template>
  <div class="container rounded bg-white mt-5 mb-5">
    <div class="row">
      <div class="col-md-4">
        <div class="d-flex flex-column align-items-center text-center p-3 py-5">
          <img
            class="rounded-circle mt-5"
            width="150px"
            height="150px"
            :src="
              profileImage
                ? `${profileImage}?time=${new Date().getTime()}`
                : require('../assets/profile.png')
            "
            alt="Profile"
          /><span class="font-weight-bold">{{ username }}</span
          ><span class="text-black-50">{{ email }}</span
          ><span> </span>
        </div>
      </div>
      <div class="col-md-8">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right">Profile Settings</h4>
          </div>
          <div class="row mt-2">
            <div class="col-md-12">
              <label class="labels">Username</label
              ><input
                v-model="username"
                type="text"
                class="form-control"
                placeholder="Username"
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="mb-3">
              <label for="formFile" class="form-label">Profile Image</label>
              <input
                id="formFile"
                class="form-control"
                type="file"
                @change="onFileChange"
              />
            </div>

            <div v-if="fileErrorMsg" class="text-danger">
              {{ fileErrorMsg }}
            </div>
          </div>
          <div class="mt-5 text-center">
            <button
              class="btn btn-primary profile-button"
              type="button"
              @click="handleSave"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { supabase } from '../utils/supabase'
export default {
  data() {
    return {
      username: '',
      email: null,
      profileImage: null,
      fileErrorMsg: null,
    }
  },
  async fetch() {
    await this.getUser()
    await this.getProfileImage()
    console.log(this.profileImage)
  },
  methods: {
    async getUser() {
      const { data } = await supabase.auth.getSession()
      const { data: user } = await supabase
        .from('user')
        .select('username')
        .eq('id', data.session.user.id)

      if (user) {
        this.username = user[0].username
        this.email = data.session.user.email
      }
    },
    handleSave() {
      this.updateUsername()
      if (this.profileImage) {
        this.saveImageProfile()
      }
    },
    async updateUsername() {
      const { data } = await supabase.auth.getSession()
      const { data: username } = await supabase
        .from('user')
        .update({ username: this.username })
        .eq('id', data.session.user.id)
        .select()
      if (username) {
        console.log(username)
      }
    },
    async saveImageProfile() {
      const avatarFile = this.profileImage
      const { data: user } = await supabase.storage
        .from('user image')
        .upload('user-' + this.username, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        })
      if (user) {
        const { data: url } = supabase.storage
          .from('user image')
          .getPublicUrl('user-' + this.username)
        if (url && user !== null) {
          const { data } = await supabase.auth.getSession()
          const { error } = await supabase
            .from('user')
            .update({ image_url: url.publicUrl })
            .eq('id', data.session.user.id)
            .select()

          if (error) {
            throw error
          }
          this.profileImage = url.publicUrl
          console.log(this.profileImage)
        }
      } else {
        this.profileImage = null
      }
    },
    async getProfileImage() {
      const { data } = await supabase.auth.getSession()
      const { data: user } = await supabase
        .from('user')
        .select('image_url')
        .eq('id', data.session.user.id)
      if (user && user !== null) {
        console.log(user[0].image_url)
        this.profileImage = user[0].image_url
        console.log(this.profileImage)
      } else {
        this.profileImage = null
      }
    },
    onFileChange(event) {
      const file = event.target.files[0]
      if (file && this.isFileValid(file)) {
        this.profileImage = file
      } else {
        this.profileImage = null
        this.fileErrorMsg =
          'Invalid file type. Please choose a valid image file (JPEG or PNG).'
      }
    },
    isFileValid(file) {
      const allowedTypes = ['image/jpeg', 'image/png']
      return file && allowedTypes.includes(file.type)
    },
  },
}
</script>
