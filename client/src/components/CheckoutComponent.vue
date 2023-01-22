<template>
	<div class="section no-pad-bot" id="index-banner">
		<div class="container">

			<div class="row">
				<div class="col m8">
					<h1 class="text-center">Checkout</h1>
				</div>
			</div>

			<div class="row">
				<div class="col m8">
					<div class="card">

	                    <div class="card-body">
	                    	<p v-if="cartEmpty" style="padding: 20px;">The cart is empty.</p>

	                    	<form v-else v-if="!cartEmpty">
	                    		<div class="input-field col m6">
									<input id="name" name="name" type="text" required v-model="name" />
									<label for="name">Name</label>
								</div>

								<div class="input-field col m6">
									<input id="email" name="email" type="email" required v-model="email" />
									<label for="email">E-mail</label>
								</div>

								<div class="input-field col m6">
									<input id="mobile" name="mobile" type="text" required v-model="mobile" />
									<label for="mobile">Mobile</label>
								</div>

								<div class="input-field col m6">
									<input id="country" name="country" type="text" required v-model="country" />
									<label for="country">Country</label>
								</div>

								<div class="input-field col m6">
									<textarea id="address" name="address" class="materialize-textarea" required v-model="address"></textarea>
									<label for="address">Address</label>
								</div>

								<p v-text="paymentStatus"></p>
	                    	</form>
	                    </div>
	                </div>
	            </div>

	            <div class="col m4">
	            	<div class="card" style="padding: 20px;">
	            		<div class="card-body">
	            			<div class="table-responsive">
		                        <table class="table align-items-center justify-content-center mb-0" id="products-table">
		                            <thead>
		                                <tr>
		                                    <th>Name</th>
		                                    <th>Price</th>
		                                    <th>Total</th>
		                                </tr>
		                            </thead>

		                            <tbody>
		                                <tr v-for="(product, index) in products" v-bind:key="product._id">
		                                	<td v-text="product.name"></td>
		                                	<td v-text="'$' + product.price + ' x ' + product.units"></td>
		                                	<td v-text="'$' + (product.price * product.units)"></td>
		                                </tr>
		                            </tbody>

		                            <tfoot>

		                            	<tr>
		                            		<td colspan="4" style="text-align: right;">
		                            			<div style="margin-right: 20px;">
		                            				<b>Total: </b>
		                            				$<span v-text="total"></span>
		                            			</div>
		                            		</td>
		                            	</tr>
		                            </tfoot>
		                        </table>
		                    </div>
	            		</div>

	            		<div class="card-footer" v-if="!cartEmpty">
	            			<div class="row">
	            				<div class="col offset-m6 m6">
			            			<button type="button" class="waves-effect waves-light btn offset-m2" v-on:click="cashOnDelivery" style="margin-top: 20px;" v-bind:disabled="paymentLoading">Order now</button>
			            		</div>
			            	</div>
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
    	data() {
    		return {
    			email: "",
    			name: "",
    			mobile: "",
    			address: "",
    			country: "",
    			paymentLoading: false,
    			paymentStatus: "",
    			cartEmpty: false,
    			total: 0,
    			products: []
    		}
    	},

    	methods: {
    		cashOnDelivery: function () {
    			const self = this

    			if (this.name == "" || this.email == "" || this.mobile == ""
    				|| this.country == "" || this.address == "") {
    				swal.fire("Error", "Please fill all fields.", "error")
    				return
    			}

    			swal.fire({
					title: 'Cash on delivery',
					text: "I want to process my order on cash on delivery.",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes'
				})
    			.then(async function (result) {
					if (result.isConfirmed) {
						let products = []
		    			const cookieParts = document.cookie.split("; ")
		    			for (let a = 0; a < cookieParts.length; a++) {
							const keyValue = cookieParts[a].split("=")
							if (keyValue[0] == "products") {
								products = keyValue[1]
								break
							}
						}

		    			self.paymentLoading = true
		                self.paymentStatus = "Processing your order..."

		                const formData = new FormData()
		                formData.append("products", products)
		                formData.append("name", self.name)
		                formData.append("email", self.email)
		                formData.append("mobile", self.mobile)
		                formData.append("country", self.country)
		                formData.append("address", self.address)

		                const response = await axios.post(
		                    self.$apiURL + "/cashOnDelivery",
		                    formData
		                )

		                self.paymentLoading = false
		                self.paymentStatus = ""

		                if (response.data.status == "success") {
		                	swal.fire("Success", response.data.message, "success")
		                	document.cookie = "products=" + JSON.stringify([])
		                	store.commit("setCartCounter", 0)
		                	self.cartEmpty = true
		                } else {
		                    swal.fire("Error", response.data.message, "error")
		                }
					}
				})
    		}
    	},

    	mounted: async function () {
    		const self = this
    		const cookieParts = document.cookie.split("; ")
			this.total = 0
			for (let a = 0; a < cookieParts.length; a++) {
				const keyValue = cookieParts[a].split("=")
				if (keyValue[0] == "products") {
					const products = JSON.parse(keyValue[1])
					this.products = products
					for (let a = 0; a < products.length; a++) {
	        			this.total += (products[a].units * products[a].price)
	        		}
					break
				}
			}

			const response = await axios.post(
                this.$apiURL + "/getConfigurations",
                null
            )

            if (response.data.status == "success") {
                let configurations = response.data.configurations
                if (configurations != null) {
                    const user = store.getters.getUser
                    if (user != null) {
                    	this.name = user.name
                    	this.email = user.email
                    }
                }
            }

            this.cartEmpty = (this.total == 0)
    	}
    }
</script>