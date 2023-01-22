import { createApp } from 'vue'
import App from './App.vue'
import VueTidio from 'vue-tidio'

import { createRouter, createWebHistory } from "vue-router"

import HomeComponent from "./components/HomeComponent.vue"
import ProductDetail from "./components/ProductDetail.vue"
import CartComponent from "./components/CartComponent.vue"
import CheckoutComponent from "./components/CheckoutComponent.vue"
import RegisterComponent from "./components/RegisterComponent.vue"
import LoginComponent from "./components/LoginComponent.vue"
import PremiumComponent from "./components/PremiumComponent.vue"

const routes = [
    { path: "/premium", component: PremiumComponent },
    { path: "/login", component: LoginComponent },
    { path: "/register", component: RegisterComponent },
    { path: "/checkout", component: CheckoutComponent },
    { path: "/cart", component: CartComponent },
    { path: "/product/:_id", component: ProductDetail },
    { path: "/", component: HomeComponent }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.use(VueTidio, { appKey: 'kapdevnmnkvcubnn6z7zpiatypsbunjr' })

router.afterEach((to) => {
  window.tidioChatApi &&
    window.tidioChatApi.display(to.meta.showChat);
})

app.config.globalProperties.$apiURL = "http://localhost:3000"
app.config.globalProperties.$accessTokenKey = "accessTokenKey"
app.config.globalProperties.$months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

app.config.globalProperties.$headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("accessTokenKey")
}

app.mount('#app')
