<template>
	<aside class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark" id="sidenav-main" v-if="login">
    <div class="sidenav-header">
      <i class="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
      <a class="navbar-brand m-0" href=" https://demos.creative-tim.com/material-dashboard/pages/dashboard " target="_blank">
        <img src="../../../public/assets/img/logo-ct.png" class="navbar-brand-img h-100" alt="main_logo">
        <span class="ms-1 font-weight-bold text-white">Material Dashboard 2</span>
      </a>
    </div>
    <hr class="horizontal light mt-0 mb-2">
    <div class="collapse navbar-collapse  w-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link v-bind:class="'nav-link text-white ' + ($route.path == '/' ? 'bg-gradient-primary active' : '')" to="/">
            <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
              <i class="material-icons opacity-10">dashboard</i>
            </div>
            <span class="nav-link-text ms-1">Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item mt-3">
          <h6 class="ps-4 ms-2 text-uppercase text-xs text-white font-weight-bolder opacity-8">Products</h6>
        </li>
        <li class="nav-item">
          <router-link v-bind:class="'nav-link text-white ' + ($route.path == '/allProducts' ? 'bg-gradient-primary active' : '')" to="/allProducts">
            <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
              <i class="material-icons opacity-10">list</i>
            </div>
            <span class="nav-link-text ms-1">All products</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link v-bind:class="'nav-link text-white ' + ($route.path == '/addProduct' ? 'bg-gradient-primary active' : '')" to="/addProduct">
            <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
              <i class="material-icons opacity-10">add</i>
            </div>
            <span class="nav-link-text ms-1">Add new product</span>
          </router-link>
        </li>

        <li class="nav-item mt-3">
          <h6 class="ps-4 ms-2 text-uppercase text-xs text-white font-weight-bolder opacity-8">Orders</h6>
        </li>
        <li class="nav-item">
          <router-link v-bind:class="'nav-link text-white ' + ($route.path == '/allOrders' ? 'bg-gradient-primary active' : '')" to="/allOrders">
            <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
              <i class="material-icons opacity-10">list</i>
            </div>
            <span class="nav-link-text ms-1">All orders</span>
            <span v-if="unReadOrderNotifications > 0" v-text="'(' + unReadOrderNotifications + ')'" style="margin-left: 10px;"></span>
          </router-link>
        </li>

        <li class="nav-item" v-if="login">
          <a class="nav-link text-white " href="javascript:void(0)" v-on:click="doLogout">
            <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
              <i class="material-icons opacity-10">power_settings_new</i>
            </div>
            <span class="nav-link-text ms-1">Logout</span>
          </a>
        </li>

        <li class="nav-item" v-else>
          <router-link class="nav-link text-white " to="/login">
            <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
              <i class="material-icons opacity-10">login</i>
            </div>
            <span class="nav-link-text ms-1">Sign In</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>

	import "../../../public/assets/css/nucleo-icons.css"
	import "../../../public/assets/css/nucleo-svg.css"
	import "../../../public/assets/css/font-awesome.min.css"

  import axios from "axios"
  import store from "../../vuex/store"
  import { io } from "socket.io-client"

	export default {

    methods: {

      doLogout: async function () {
        const response = await axios.post(
          this.$apiURL + "/admin/logout",
          null,
          {
            headers: this.$headers
          }
        )

        localStorage.removeItem(this.$accessTokenKey)
        store.commit("setAdmin", null)
        store.commit("setLogin", false)

        this.$router.push({
            path: "/login"
        })
      },

      getAdmin: async function () {
        const self = this
        // check if admin is logged in
        if (localStorage.getItem(this.$accessTokenKey)) {
          const response = await axios.post(
            this.$apiURL + "/admin/fetch",
            null,
            {
              headers: this.$headers
            }
          )

          if (response.data.status == "success") {
            // admin is logged in
            store.commit("setAdmin", response.data.admin)
            store.commit("setLogin", true)
            store.commit("setUnReadOrderNotifications", response.data.unReadOrderNotifications)

            if (typeof global.socketIO !== "undefined") {
              global.socketIO.emit("connected", response.data.admin.email)

              global.socketIO.on("newOrder", function () {
                let tempUnReadOrderNotifications = store.getters.getUnReadOrderNotifications
                tempUnReadOrderNotifications++
                store.commit("setUnReadOrderNotifications", tempUnReadOrderNotifications)
              })
            }
          } else {
            // admin is logged out
            localStorage.removeItem(this.$accessTokenKey)
            store.commit("setLogin", false)
            this.$router.push({
              path: "/login"
            })
          }
        } else {
          store.commit("setLogin", false)

          this.$router.push({
            path: "/login"
          })
        }
      },
    },

    computed: {
      admin() {
        return store.getters.getAdmin
      },

      login() {
        return store.getters.getLogin
      },

      unReadOrderNotifications () {
        return store.getters.getUnReadOrderNotifications
      }
    },

    mounted: function () {
        this.getAdmin()

        global.socketIO = io(this.$apiURL)
    },
	}
</script>

<style>
	@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700"
</style>

<style>
	@import "https://fonts.googleapis.com/icon?family=Material+Icons+Round"
</style>

<style>
	.navbar-vertical.navbar-expand-xs .navbar-collapse {
		height: auto !important;
	}
</style>