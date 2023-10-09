<template>
  <div class="container">
    <div v-if="errorMsg" class="alert alert-danger" role="alert">
      {{ errorMsg }}
    </div>
    <div class="row d-flex justify-content-center mt-5">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card py-3 px-2">
          <p class="text-center mb-3 mt-2">SIGN IN WITH</p>
          <div class="row mx-auto">
            <div class="col-6">
              <i class="bi bi-github"></i>
            </div>
            <div class="col-6">
              <i class="bi bi-google"></i>
            </div>
          </div>
          <div class="division">
            <div class="row">
              <div class="col-3"><div class="line l"></div></div>
              <div class="col-6 pt-4"><span>OR WITH EMAIL</span></div>
              <div class="col-3"><div class="line r"></div></div>
            </div>
          </div>
          <form class="myform" @submit.prevent="signIn">
            <div class="form-group">
              <input
                v-model="email"
                type="email"
                class="form-control"
                placeholder="Your Email"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Password"
                required
              />
            </div>
            <div class="form-group mt-3 d-grid col-12">
              <button type="submit" class="btn btn-primary btn-lg">
                <small style="color: #f2ceff"
                  ><i
                    class="bi-box-arrow-in-right me-2"
                    style="font-size: 20px"
                  ></i
                  >Sign In</small
                >
              </button>
            </div>
            <div class="mt-3">
              <p>
                Don't have an account?
                <NuxtLink to="/signup" style="color: #ccc" class="fw-bold"
                  >Register now!</NuxtLink
                >
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { supabase } from '../utils/supabase'
export default {
  layout: 'main',
  data() {
    return {
      email: '',
      password: null,
      errorMsg: null,
    }
  },
  methods: {
    async signIn() {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password,
        })
        if (error) throw error
        this.$router.push('/')
      } catch (error) {
        this.errorMsg = error.message
        this.email = ''
        this.password = ''
      }
    },
  },
}
</script>

<style scoped>
body {
  background-color: #19123b;
}
.card {
  border: none;
  border-top: 5px solid rgb(176, 106, 252);
  background: #212042;
  color: #ccc;
}
p {
  font-weight: 600;
  font-size: 15px;
}
.bi {
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: #2a284d;
  height: 40px;
  width: 90px;
}
.bi:hover {
  cursor: pointer;
}
.bi-github {
  color: #4078c0;
}
.bi-google {
  color: #cb5048;
}
.division {
  float: none;
  position: relative;
  margin: 30px auto 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}
.division .line {
  border-top: 1.5px solid #57557a;
  position: absolute;
  bottom: 40px;
  width: 85%;
}
.line.l {
  left: 52px;
}
.line.r {
  right: 52px;
}
.division span {
  font-weight: 600;
  font-size: 14px;
}
.myform {
  padding: 0 25px 0 33px;
}
.form-control {
  border: 1px solid #57557a;
  border-radius: 3px;
  background: #2a284d;
  margin-bottom: 20px;
  letter-spacing: 1px;
  color: #ccc;
}
.form-control:focus {
  border: 1px solid #57557a;
  border-radius: 3px;
  box-shadow: none;
  background: #212042;
  color: #fff;
  letter-spacing: 1px;
}
::placeholder {
  color: #ccc;
}
.btn-primary {
  background: linear-gradient(
    135deg,
    rgba(176, 106, 252, 1) 39%,
    rgba(116, 17, 255, 1) 101%
  );
  border: none;
  border-radius: 50px;
}

@media (max-width: 767px) {
  .form-check {
    text-align: center;
  }
}
@media (max-width: 450px) {
  .bi {
    width: 100%;
    height: 100%;
  }
  .division .line {
    width: 50%;
  }
}
</style>