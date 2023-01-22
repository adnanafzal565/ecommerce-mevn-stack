<template>
	<div class="section no-pad-bot" id="index-banner" v-if="product != null">
		<div class="container-fluid">
			<div class="row">
				<div class="col m6">
					<div class="carousel">
						<a class="carousel-item" href="#one!" v-for="(image, index) in product.images">
							<img v-bind:src="this.$apiURL + '/' + image" style="width: 500px;" />
						</a>
					</div>
				</div>

				<div class="col m6">
					<h1 v-text="product.name + ' ($' + product.price + ')'"></h1>
					<p v-text="product.description"></p>
					<p>In stock: <span v-text="product.itemsInStock || 0"></span></p>

					<button v-if="isInCart" type="button" class="waves-effect waves-light btn" v-on:click="removeFromCart">Remove from cart</button>
					<button v-else type="button" class="waves-effect waves-light btn" v-on:click="addToCart">Add to cart</button>
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

		data() {
			return {
				_id: this.$route.params._id,
				product: null,
				isInCart: false
			}
		},

		methods: {
			getDateInFormat: function (timestamp) {
				let date = new Date(timestamp)
				date = date.getDate() + " " + store.getters.getMonths[date.getMonth()] + ", " + date.getFullYear()
				return date
			},

			removeFromCart: function () {
				const cookieParts = document.cookie.split("; ")
				for (let a = 0; a < cookieParts.length; a++) {
					const keyValue = cookieParts[a].split("=")
					if (keyValue[0] == "products") {
						const products = JSON.parse(keyValue[1])
						for (let b = 0; b < products.length; b++) {
							if (products[b]._id == this._id) {
								products.splice(b, 1)
								document.cookie = "products=" + JSON.stringify(products)

								swal.fire("Remove from cart", "Product has been removed from cart", "success")
								this.isInCart = false
								store.commit("setCartCounter", products.length)
								return
							}
						}
					}
				}
			},

			addToCart: function () {
				if (this.product == null) {
					return
				}

				let products = []
				const cookieParts = document.cookie.split("; ")
				for (let a = 0; a < cookieParts.length; a++) {
					const keyValue = cookieParts[a].split("=")
					if (keyValue[0] == "products") {
						products = JSON.parse(keyValue[1])
						break 
					}
				}

				products.push({
					_id: this._id,
					name: this.product.name,
					price: this.product.price,
					units: 1
				})
				document.cookie = "products=" + JSON.stringify(products)

				// swal.fire("Add to cart", "Product has been added to cart", "success")
				this.isInCart = true
				store.commit("setCartCounter", products.length)
			},

            getData: async function () {
                const formData = new FormData()
                formData.append("_id", this._id)

                const response = await axios.post(
                    this.$apiURL + "/products/fetchSingle",
                    formData
                )

                if (response.data.status == "success") {
                    // console.log(response.data.product)
                    this.product = response.data.product

                    setTimeout(function () {
                    	var elems = document.querySelectorAll('.carousel')
	                    var instances = M.Carousel.init(elems, {})
	                }, 500)
                } else {
                    swal.fire("Error", response.data.message, "error")
                }
            }
        },

        mounted: function () {
            this.getData()

            const cookieParts = document.cookie.split("; ")
			for (let a = 0; a < cookieParts.length; a++) {
				const keyValue = cookieParts[a].split("=")
				if (keyValue[0] == "products") {
					const products = JSON.parse(keyValue[1])
					for (let b = 0; b < products.length; b++) {
						if (products[b]._id == this._id) {
							this.isInCart = true
							return
						}
					}
				}
			}

			setTimeout(function () {
				var el = document.querySelectorAll('.tabs')
				var instance = M.Tabs.init(el, {})
			}, 1000)
        }
	}
</script>