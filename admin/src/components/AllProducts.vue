<template>
    <!-- End Navbar -->
    <div class="container-fluid py-4">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="font-weight-bolder">All products</h4>
                    </div>

                    <div class="card-body">
                        <div class="table-responsive p-0">
                            <table class="table align-items-center justify-content-center mb-0" id="products-table">
                                <thead>
                                    <tr>
                                        <th class="text-uppercase text-secondary opacity-7">Name</th>
                                        <th class="text-uppercase text-secondary opacity-7">Price</th>
                                        <th class="text-uppercase text-secondary opacity-7">In stock</th>
                                        <th class="text-uppercase text-secondary opacity-7">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="(product) in products" v-bind:key="product._id.toString()">
                                        <td>
                                            <span v-text="product.name"></span>
                                        </td>

                                        <td>
                                            $<span v-text="product.price"></span>
                                        </td>

                                        <td>
                                            <span v-text="product.itemsInStock || 0"></span>
                                        </td>

                                        <td>
                                            <router-link v-bind:to="'/product/edit/' + product._id" class="text-secondary">
                                                Edit
                                            </router-link>

                                            <form v-on:submit.prevent="deleteProduct">
                                                <input type="hidden" name="_id" v-bind:value="product._id" required />

                                                <input type="submit" name="submit" class="btn btn-xs bg-gradient-primary" value="Delete" />
                                            </form>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="card-footer">
                        <button type="button" v-on:click="loadMore" class="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0" ref="btnLoadMore">Load more</button>
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
                page: 1,
                products: []
            }
        },

        methods: {
            deleteProduct: async function () {
                const self = this
                const form = event.target
                const formData = new FormData(form)

                swal.fire({
                    title: 'Are you sure?',
                    text: "This product will be deleted.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        const response = await axios.post(
                            self.$apiURL + "/admin/products/destroy",
                            formData,
                            {
                                headers: self.$headers
                            }
                        )

                        if (response.data.status == "success") {
                            for (let a = 0; a < self.products.length; a++) {
                                if (self.products[a]._id == form._id.value) {
                                    self.products.splice(a, 1)
                                    break
                                }
                            }

                            swal.fire("Success", response.data.message, "success")
                        } else {
                            swal.fire("Error", response.data.message, "error")
                        }
                    }
                })
            },

            loadMore: async function () {
                this.$refs.btnLoadMore.setAttribute("disabled", "disabled")

                this.page++
                this.getData()
            },

            getData: async function () {
                const formData = new FormData()
                formData.append("page", this.page)

                const response = await axios.post(
                    this.$apiURL + "/admin/products/fetch",
                    formData,
                    {
                        headers: this.$headers
                    }
                )

                this.$refs.btnLoadMore.removeAttribute("disabled")

                if (response.data.status == "success") {
                    if (response.data.products.length > 0) {
                        this.products = response.data.products
                    }
                } else {
                    swal.fire("Error", response.data.message, "error")
                }
            }
        },

        mounted: function () {
            this.getData()
        }
    }
</script>

<style>
    #products-table th,
    #products-table td {
        padding-left: 0px !important;
    }
</style>