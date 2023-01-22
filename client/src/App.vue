<template>
  <app-header/>
    <router-view/>
  <app-footer/>
</template>

<script>
import AppHeader from './components/layouts/AppHeader.vue'
import AppFooter from './components/layouts/AppFooter.vue'

// import "../public/assets/bootstrap/bootstrap.min.js"

// include jquery
// window.$ = window.jQuery = require("jquery")

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>
