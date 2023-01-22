const express = require("express")
const ObjectId = require("mongodb").ObjectId

module.exports = {
	init: function (app) {
		const router = express.Router()

		router.post("/fetchSingle", async function (request, result) {
			const _id = request.fields._id
			
			const product = await global.db.collection("products").findOne({
				_id: ObjectId(_id)
			})

			if (product == null) {
				result.json({
					status: "error",
					message: "Product not found."
				})
				return
			}

			result.json({
				status: "success",
				message: "Data has been fetched.",
				product: product
			})
		})

		router.post("/fetch", async function (request, result) {
			const page = parseInt(request.fields.page) || 1
			const sortBy = request.fields.sortBy
			const category = request.fields.category || ""
			const search = request.fields.search || ""

			// number of records you want to show per page
		    const perPage = 10

			// get records to skip
			const startFrom = (page - 1) * perPage

			let sortObj = {
				"createdAt": -1
			}

			if (sortBy == "newestToOldest") {
				sortObj = {
					"createdAt": -1
				}
			} else if (sortBy == "oldestToNewest") {
				sortObj = {
					"createdAt": 1
				}
			} else if (sortBy == "priceDescending") {
				sortObj = {
					"price": -1
				}
			} else if (sortBy == "priceAscending") {
				sortObj = {
					"price": 1
				}
			}

			const orArray = []

			if (search != "") {
				orArray.push({
					name: {
						$regex: ".*" + search + ".*",
						$options: "i"
					}
				}, {
					description: {
						$regex: ".*" + search + ".*",
						$options: "i"
					}
				}, {
					category: {
						$regex: ".*" + search + ".*",
						$options: "i"
					}
				}, {
					"specs.value": {
						$regex: ".*" + search + ".*",
						$options: "i"
					}
				})
			}

			let findObj = {}
			if (category != "" && category != "All") {
				orArray.push({
					category: category
				})
			}

			if (orArray.length > 0) {
				findObj = {
					$or: orArray
				}
			}

			const products = await global.db.collection("products").find(findObj)
				.sort(sortObj)
				.skip(startFrom)
				.limit(perPage)
				.toArray()

			result.json({
				status: "success",
				message: "Data has been fetched.",
				products: products
			})
		})

		app.use("/products", router)
	}
}