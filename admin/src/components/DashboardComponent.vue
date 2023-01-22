<template>
    <!-- End Navbar -->
    <div class="container-fluid py-4">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="font-weight-bolder">Configurations</h4>
                    </div>

                    <div class="card-body">
                        <form v-on:submit.prevent="saveConfigurations">
                            <div class="input-group input-group-outline mb-3">
                                <label class="form-label no-left-margin">Admin email</label>
                                <input type="email" class="form-control" name="adminEmail" v-bind:value="configurations == null ? '' : configurations.adminEmail" />
                            </div>

                            <div class="text-center">
                                <button type="submit" class="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0">Save</button>
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
                configurations: null
            }
        },

        methods: {

            saveConfigurations: async function () {
                const form = event.target
                const formData = new FormData(form)

                const response = await axios.post(
                    this.$apiURL + "/admin/saveConfigurations",
                    formData,
                    {
                        headers: this.$headers
                    }
                )

                swal.fire("Configurations", response.data.message, response.data.status)
            }
        },

        mounted: async function () {
            const response = await axios.post(
                this.$apiURL + "/getConfigurations",
                null
            )

            if (response.data.status == "success") {
                this.configurations = response.data.configurations
            }
        }
    }
</script>