<template>
  
  <app-header />
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
    <app-topbar />
    <router-view />
  </main>
  <app-footer />
</template>

<script>
import AppHeader from './components/layouts/AppHeader.vue'
import AppTopbar from './components/layouts/AppTopbar.vue'
import AppFooter from './components/layouts/AppFooter.vue'

import "/public/assets/css/material-dashboard.css?v=3.0.4"

// import "/public/assets/js/core/popper.min.js"
// import "/public/assets/js/core/bootstrap.min.js"
// import "/public/assets/js/plugins/perfect-scrollbar.min.js"
// import "/public/assets/js/plugins/smooth-scrollbar.min.js"
// import "/public/assets/js/material-dashboard.min.js?v=3.0.4"

export default {
  name: 'App',
  components: {
    AppHeader,
    AppTopbar,
    AppFooter
  }
}
</script>