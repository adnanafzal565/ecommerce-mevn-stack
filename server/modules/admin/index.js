const express = require("express")
const products = require("./products")
const orders = require("./orders")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const auth = require("./auth")

module.exports = {
	init: function (app) {
		const router = express.Router()

		router.post("/getUsers", auth, async function (request, result) {
			const admin = request.admin

			const users = await global.db.collection("users")
				.find({})
				.sort({
					lastMessageAt: -1
				})
				.toArray()

			for (let a = 0; a < users.length; a++) {
				delete users[a].password
				delete users[a].accessToken
			}

			result.json({
                status: "success",
                message: "Data has been fetched.",
                data: users
            })
		})

		router.post("/saveConfigurations", auth, async function(request, result) {
			const admin = request.admin
			const adminEmail = request.fields.adminEmail

			await global.db.collection("configurations").findOneAndUpdate({}, {
                $set: {
                    "adminEmail": adminEmail
                }
            }, {
            	upsert: true
            })

			result.json({
                status: "success",
                message: "Configuration has been saved."
            })
		})

		router.post("/logout", auth, async function (request, result) {
            const admin = request.admin

            await global.db.collection("admins").findOneAndUpdate({
                "_id": admin._id
            }, {
                $set: {
                    "accessToken": ""
                }
            })

            result.json({
                status: "success",
                message: "Logout successfully."
            })
        })

		router.post("/fetch", auth, async function (request, result) {
		    const admin = request.admin

		    const notifications = await global.db.collection("notifications").find({
		    	isRead: false
		    }).toArray()

		    let unReadOrderNotifications = 0
		    for (let a = 0; a < notifications.length; a++) {
		    	if (notifications[a].type == "order") {
		    		unReadOrderNotifications++
		    	}
		    }

		    result.json({
		        status: "success",
		        message: "Data has been fetched.",
		        admin: admin,
		        unReadOrderNotifications: unReadOrderNotifications
		    })
		})

		// route for login requests
		router.post("/login", async function (request, result) {

		    // get values from login form
		    const email = request.fields.email
		    const password = request.fields.password

		    // check if email exists
		    const admin = await global.db.collection("admins").findOne({
		        "email": email
		    })

		    if (admin == null) {
		        result.json({
		            status: "error",
		            message: "Email does not exists."
		        })
		        return
		    }

		    // check if password is correct
		    bcryptjs.compare(password, admin.password, async function (error, isVerify) {
		        if (isVerify) {

		            // generate JWT of admin
		            const accessToken = jwt.sign({
		                "userId": admin._id.toString()
		            }, global.jwtSecret)

		            // update JWT of admin in database
		            await global.db.collection("admins").findOneAndUpdate({
		                "email": email
		            }, {
		                $set: {
		                    "accessToken": accessToken
		                }
		            })

		            admin.accessToken = accessToken

		            result.json({
		                status: "success",
		                message: "Login successfully.",
		                accessToken: accessToken,
		                admin: admin
		            })
		            return
		        }

		        result.json({
		            status: "error",
		            message: "Password is not correct."
		        })
		    })
		})

		app.use("/admin", router)
		products.init(router)
		orders.init(router)
	}
}