<template>
    <div class="section no-pad-bot" id="index-banner">
        <div class="container" style="margin-bottom: 50px;">
            <div class="row">
                <div class="col offset-m3 m6">
                    <h1 class="text-center" style="margin-bottom: 50px; text-align: center;">Register</h1>

                    <form method="POST" v-on:submit.prevent="doRegister">
                        <div class="form-group">
                            <label class="text-white">Enter name</label>
                            <input type="text" class="form-control" name="name" autocomplete="off" />
                        </div>

                        <br />

                        <div class="form-group">
                            <label class="text-white">Enter email</label>
                            <input type="email" class="form-control" name="email" autocomplete="off" />
                        </div>

                        <br />

                        <div class="form-group">
                            <label class="text-white">Enter password</label>
                            <input type="password" class="form-control" name="password" autocomplete="off" />
                        </div>

                        <br />

                        <input type="submit" value="Register" v-bind:disabled="isLoading" name="submit" class="btn btn-primary" />
                    </form>
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
                "isLoading": false
            }
        },

        methods: {
            doRegister: async function () {
                const form = event.target
                const formData = new FormData(form)

                this.isLoading = true

                const response = await axios.post(
                    this.$apiURL + "/registration",
                    formData
                )
                
                this.isLoading = false
                swal.fire("Registration", response.data.message, response.data.status)

                if (response.data.status == "success") {
                    form.reset()
                }
            }
        }
    }
</script>

<style>
    label {
        font-size: initial;
    }
</style>