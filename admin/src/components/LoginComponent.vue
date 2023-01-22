<template>

  <div class="page-header align-items-start min-vh-100" style="background-image: url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80');">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container my-auto">
      <div class="row">
        <div class="col-lg-4 col-md-8 col-12 mx-auto">
          <div class="card z-index-0 fadeIn3 fadeInBottom">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">Sign in</h4>
              </div>
            </div>
            <div class="card-body">
              <form id="login-form" class="text-start" v-on:submit.prevent="doLogin">
                <div class="input-group input-group-outline my-3">
                  <label class="form-label no-left-margin">Email</label>
                  <input type="email" name="email" autocomplete="off" class="form-control" />
                </div>
                <div class="input-group input-group-outline mb-3">
                  <label class="form-label no-left-margin">Password</label>
                  <input type="password" name="password" autocomplete="off" class="form-control" />
                </div>
                <div class="text-center">
                  <button type="submit" name="submit" class="btn bg-gradient-primary w-100 my-4 mb-2">Sign in</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  import swal from "sweetalert2"
  import store from "../vuex/store"

  export default {
    methods: {
      doLogin: async function () {
        const form = event.target
        const formData = new FormData(form)

        form.submit.setAttribute("disabled", "disabled")

        const response = await axios.post(
          this.$apiURL + "/admin/login",
          formData
        )

        form.submit.removeAttribute("disabled")

        if (response.data.status == "success") {
          // get access token from server
          const accessToken = response.data.accessToken

          // save in local storage
          localStorage.setItem(this.$accessTokenKey, accessToken)

          form.reset()
          this.$headers.Authorization = "Bearer " + accessToken

          store.commit("setAdmin", response.data.admin)
          store.commit("setLogin", true)

          this.$router.push({
            path: "/"
          })
        } else {
          swal.fire("Error", response.data.message, "error")
        }
      }
    },

    mounted: function () {
      setTimeout(function () {
        const form = document.getElementById("login-form")
        form.email.value = ""
        form.password.value = ""
      }, 500)
    }
  }
</script>