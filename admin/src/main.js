import { createApp } from 'vue'
import App from './App.vue'

import { createRouter, createWebHistory } from "vue-router"

import AddProduct from "./components/AddProduct.vue"
import AllProducts from "./components/AllProducts.vue"
import AllOrders from "./components/AllOrders.vue"
import OrderDetail from "./components/OrderDetail.vue"
import LoginComponent from "./components/LoginComponent.vue"
import DashboardComponent from "./components/DashboardComponent.vue"
import EditProduct from "./components/EditProduct.vue"

const routes = [
	{ path: "/", component: DashboardComponent },
	{ path: "/login", component: LoginComponent },
	{ path: "/orderDetail/:_id", component: OrderDetail },
	{ path: "/allOrders", component: AllOrders },
	{ path: "/allProducts", component: AllProducts },
	{ path: "/product/edit/:_id", component: EditProduct },
	{ path: "/addProduct", component: AddProduct }
]
const router = createRouter({
	history: createWebHistory(),
	routes
})

const app = createApp(App)

app.config.globalProperties.$clientURL = "http://localhost:8080"
app.config.globalProperties.$mainURL = "http://localhost:8081"
app.config.globalProperties.$apiURL = "http://localhost:3000"
app.config.globalProperties.$accessTokenKey = "accessTokenKey"
app.config.globalProperties.$months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

app.config.globalProperties.$user = null
app.config.globalProperties.$login = false

app.config.globalProperties.$headers = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer ' + localStorage.getItem("accessTokenKey")
}

app.use(router)
app.mount('#app')
