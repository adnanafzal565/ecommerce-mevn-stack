const express = require("express")
const ObjectId = require("mongodb").ObjectId
const auth = require("./auth")

module.exports = {
	init: function (router) {
		const orderRouter = express.Router()

		orderRouter.post("/search", auth, async function (request, result) {
			const search = request.fields.search || ""

			const orders = await global.db.collection("orders").find({
				$or: [{
					name: {
						$regex: ".*" + search + ".*",
						$options: "i" 
					}
				}, {
					email: {
						$regex: ".*" + search + ".*",
						$options: "i" 
					}
				}, {
					mobile: {
						$regex: ".*" + search + ".*",
						$options: "i" 
					}
				}, {
					country: {
						$regex: ".*" + search + ".*",
						$options: "i" 
					}
				}, {
					address: {
						$regex: ".*" + search + ".*",
						$options: "i" 
					}
				}, {
					paidVia: {
						$regex: ".*" + search + ".*",
						$options: "i" 
					}
				}, {
					status: {
						$regex: ".*" + search + ".*",
						$options: "i" 
					}
				}]
			}).sort({
				"createdAt": -1
			})
			.toArray()

			result.send({
				status: "success",
				message: "Data has been fetched.",
				orders: orders
			})
		})

		orderRouter.post("/markAsCompleted", auth, async function (request, result) {
			const _id = request.fields._id
			
			const order = await global.db.collection("orders").findOne({
				_id: ObjectId(_id)
			})

			if (order == null) {
				result.json({
					status: "error",
					message: "Order not found."
				})
				return
			}

			await global.db.collection("orders").findOneAndUpdate({
				_id: order._id
			}, {
				$set: {
					status: "Completed"
				}
			})

			result.json({
				status: "success",
				message: "Order has been marked as completed."
			})
		})

		orderRouter.post("/fetchSingle", auth, async function (request, result) {
			const orderId = request.fields.orderId

			const order = await global.db.collection("orders").findOne({
				_id: ObjectId(orderId)
			})

			if (order == null) {
				result.json({
					status: "error",
					message: "Order not found."
				})
				return
			}

			result.json({
				status: "success",
				message: "Data has been fetched.",
				order: order
			})
		})

		orderRouter.post("/fetch", auth, async function (request, result) {
			const page = parseInt(request.fields.page) || 1

			// number of records you want to show per page
		    const perPage = 10

			// get records to skip
			const startFrom = (page - 1) * perPage
			
			const orders = await global.db.collection("orders").find({})
				.sort({
					"createdAt": -1
				})
				.skip(startFrom)
				.limit(perPage)
				.toArray()

			await global.db.collection("notifications").updateMany({
				type: "order"
			}, {
				$set: {
					isRead: true
				}
			})

			result.json({
				status: "success",
				message: "Data has been fetched.",
				orders: orders
			})
		})

		router.use("/orders", orderRouter)
	}
}