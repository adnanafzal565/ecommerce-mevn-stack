<template>
	<div class="section no-pad-bot" id="index-banner">
		<div class="container">
			<br><br>
			<h1 class="header center orange-text">Premium features</h1>

			<div class="row">
				<div class="col offset-m3 s12 m6">
					<div class="card">

						<div class="card-content center">
							<h2 class='purple-text '><small>$</small>20</h2>
						</div>

						<ul class='collection center'>
							<li class='collection-item'>
								<a href="javascript:void(0)" v-on:click="showDemo('realtimeChat')">
									Realtime chat between users and admin
								</a>
							</li>
							<li class='collection-item'>
								<a href="javascript:void(0)" v-on:click="showDemo('productReviews')">
									Product reviews
								</a>
							</li>
							<li class='collection-item'>
								<a href="javascript:void(0)" v-on:click="showDemo('compressImages')">
									Compress product images
								</a>
							</li>
							<li class='collection-item'>
								<a href="javascript:void(0)" v-on:click="showDemo('shippingCharges')">
									Set shipping charges by country
								</a>
							</li>
						</ul>

						<div class="card-content center">
							<div class="row">
								<div class="col s12">
									<a>support@adnan-tech.com</a>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="premium-modal" class="modal">
		<div class="modal-content">
			<h5 class="modal-title" v-text="featureName"></h5>

			<iframe width="560" height="515" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" v-bind:src="featureDemo" allowfullscreen style="width: 100%;"></iframe>
		</div>

		<div class="modal-footer">
			<a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
		</div>
	</div>
</template>

<script>

	export default {
		data() {
			return {
				featureName: "",
				featureDemo: ""
			}
		},

		methods: {
			showDemo: function (type) {
				this.featureName = event.target.innerHTML

				if (type == "realtimeChat") {
					this.featureDemo = "https://www.youtube.com/embed/q7_117zID9E"
				}

				if (type == "productReviews") {
					this.featureDemo = "https://www.youtube.com/embed/MXwob7US3zs"
				}

				if (type == "compressImages") {
					this.featureDemo = "https://www.youtube.com/embed/q7_117zID9E"
				}

				if (type == "shippingCharges") {
					this.featureDemo = "https://www.youtube.com/embed/MXwob7US3zs"
				}

				const instance = M.Modal.getInstance(document.getElementById("premium-modal"))
				instance.open()
			}
		},

		mounted: function () {
			const elems = document.querySelectorAll('.modal')
		    const instances = M.Modal.init(elems, {})
		}
	}
</script>