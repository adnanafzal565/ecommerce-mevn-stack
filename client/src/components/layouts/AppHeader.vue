<template>
  <nav class="light-blue lighten-1" role="navigation">
    <div class="nav-wrapper container">

      <router-link id="logo-container" to="/" class="brand-logo">Logo</router-link>

      <ul class="right hide-on-med-and-down">
        <li>
          <form style="position: relative; top: 10px;" v-on:submit.prevent="doSearch">
            <div class="input-field">
              <input id="search" type="search" v-model="search" style="height: 50px;" />
              <label class="label-icon" for="search"><i class="material-icons" style="line-height: 50px;">search</i></label>
              <i class="material-icons" style="line-height: 50px;">close</i>
            </div>
          </form>
        </li>

        <li class="nav-item" v-if="!login">
          <router-link class="nav-link" to="/login">Login</router-link>
        </li>

        <li class="nav-item" v-if="!login">
          <router-link class="nav-link" to="/register">Register</router-link>
        </li>

        <li v-if="user != null">
           <!-- Dropdown Trigger -->
            <a class='dropdown-trigger' href='javascript:void(0)' data-target='dropdown-user' v-text="user.name"></a>

            <!-- Dropdown Structure -->
            <ul id='dropdown-user' class='dropdown-content' style="width: 140px;">
              <li><a href="javascript:void(0)" v-on:click="doLogout">Logout</a></li>
            </ul>
        </li>

        <li>
          <router-link to="/cart">Cart <span v-if="cartCounter > 0" v-text="'(' + cartCounter + ')'"></span></router-link>
        </li>

        <li>
          <router-link to="/premium">Premium version</router-link>
        </li>
      </ul>

      <ul id="nav-mobile" class="sidenav">
      </ul>
      <a href="#" data-target="nav-mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
    </div>
  </nav>
</template>

<script>

  import "/public/assets/css/materialize.css"
  import "/public/assets/css/style.css"

  import "/public/assets/js/materialize.js"
  import "/public/assets/js/init.js"

  import store from "../../vuex/store"
  import axios from "axios"
  import swal from "sweetalert2"

  import { io } from "socket.io-client"

  export default {
    name: "AppHeader",

    data() {
      return {
        search: ""
      }
    },

    computed: {
      user: function () {
        return store.getters.getUser
      },

      login: function () {
        return store.getters.getLogin
      },

      cartCounter: function() {
        return store.getters.getCartCounter
      }
    },

    methods: {
      doLogout: async function () {
        const response = await axios.post(
          this.$apiURL + "/logout",
          null,
          {
            headers: this.$headers
          }
        )

        if (response.data.status == "success") {
          // remove access token from local storage
          localStorage.removeItem(this.$accessTokenKey)

          this.$headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '
          }

          store.commit("setLogin", false)
          store.commit("setUser", null)

          this.$router.push("/login")
        } else {
          swal.fire("Error", response.data.message, "error")
        }
      },

      getUser: async function () {

        // check if user is logged in
        if (localStorage.getItem(this.$accessTokenKey)) {

          const response = await axios.post(
            this.$apiURL + "/getUser",
            null,
            {
                headers: this.$headers
            }
          )

          if (response.data.status == "success") {
            // user is logged in
            store.commit("setUser", response.data.user)

            global.socketIO.emit("connected", response.data.user.email)

            global.socketIO.on("newMessage", function (message) {
              store.commit("appendMessage", message)
              M.toast({html: 'New message has been received.'})
            })

            setTimeout(function () {
              var elems = document.querySelectorAll('.dropdown-trigger')
              var instances = M.Dropdown.init(elems, {})
            }, 500)
          } else {
            // user is logged out
            localStorage.removeItem(this.$accessTokenKey)
          }

          store.commit("setLogin", (localStorage.getItem(this.$accessTokenKey) != null))
        }
      },

      doSearch: function () {
        store.commit("setSearch", this.search)
      }
    },

    mounted: function () {
      const cookieParts = document.cookie.split("; ")
      for (let a = 0; a < cookieParts.length; a++) {
        const keyValue = cookieParts[a].split("=")
        if (keyValue[0] == "products") {
          const products = JSON.parse(keyValue[1])
          store.commit("setCartCounter", products.length)
        }
      }

      global.socketIO = io(this.$apiURL)
      this.getUser()

      var elems = document.querySelectorAll('.sidenav')
      M.Sidenav.init(elems, {})
    }
  }
</script>