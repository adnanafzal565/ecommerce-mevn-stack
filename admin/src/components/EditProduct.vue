<template>
    <!-- End Navbar -->
    <div class="container-fluid py-4">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="font-weight-bolder">Edit product</h4>
                    </div>

                    <div class="card-body">
                        <form v-on:submit.prevent="editProduct" enctype="multipart/form-data" v-if="product != null">
                            <div class="input-group input-group-outline mb-3">
                                <label class="form-label no-left-margin">Name</label>
                                <input type="text" class="form-control" autocomplete="off" name="name" v-bind:value="product.name" required />
                            </div>

                            <div class="input-group input-group-outline mb-3">
                                <label class="form-label no-left-margin">Description</label>
                                <textarea name="description" style="margin-top: 40px;" class="form-control" required v-bind:value="product.description"></textarea>
                            </div>

                            <div class="input-group input-group-outline mb-3">
                                <label class="form-label no-left-margin">Price ($)</label>
                                <input type="number" min="0" name="price" autocomplete="off" class="form-control" required v-bind:value="product.price" />
                            </div>

                            <div class="input-group input-group-outline mb-3">
                                <label class="form-label no-left-margin">Items in stock (0 means unlimited, for digital products)</label>
                                <input type="number" min="0" autocomplete="off" name="itemsInStock" class="form-control" v-bind:value="product.itemsInStock || 0" required />
                            </div>

                            <div class="input-group input-group-outline mb-3">
                                <label class="form-label no-left-margin">Images</label>
                                <input type="file" multiple accept="image/*" name="images" class="form-control" />
                            </div>

                            <img v-for="(image) in product.images" v-bind:src="$apiURL + '/' + image" style="display: inline-block; width: 100%; margin-top: 10px;" />

                            <div class="text-center">
                                <button type="submit" class="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0">Edit product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import axios from "axios"
    import swal from "sweetalert2"

    export default {
        data() {
            return {
                _id: this.$route.params._id,
                product: null
            }
        },

        methods: {

            getData: async function () {
                const formData = new FormData()
                formData.append("_id", this._id)

                const response = await axios.post(
                    this.$apiURL + "/admin/products/fetchSingle",
                    formData,
                    {
                        headers: this.$headers
                    }
                )

                if (response.data.status == "success") {
                    this.product = response.data.product
                } else {
                    swal.fire("Error", response.data.message, "error")
                }

                const responseConfig = await axios.post(
                    this.$apiURL + "/getConfigurations",
                    null
                )

                if (responseConfig.data.status == "success") {
                    let configurations = responseConfig.data.configurations
                    this.categories = configurations.categories || []
                }
            },

            editProduct: async function () {
                const form = event.target
                const formData = new FormData(form)
                formData.append("_id", this._id)

                const response = await axios.post(
                    this.$apiURL + "/admin/products/update",
                    formData,
                    {
                        headers: this.$headers
                    }
                )

                swal.fire("Edit product", response.data.message, response.data.status)
            }
        },

        mounted: function () {
            this.getData()
        }
    }
</script>

<style>
    .no-left-margin::before {
        width: auto !important;
    }
</style>