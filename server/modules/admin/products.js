const express = require("express")
const fileSystem = require("fs")
const auth = require("./auth")
const ObjectId = require("mongodb").ObjectId

module.exports = {
	callbackFileUpload: function (images, index, savedPaths = [], success = null, error = null) {
		const self = this

		if (images.length > index) {

			fileSystem.readFile(images[index].path, function (error, data) {
				if (error) {
					console.error(error)
					return
				}

				let filePath = "uploads/" + new Date().getTime() + "-" + images[index].name
				
				fileSystem.writeFile(filePath, data, async function (error) {
					if (error) {
						console.error(error)
						return
					}

					console.log("image " + (index + 1) + " uploaded")
					savedPaths.push(filePath)

					if (index == (images.length - 1)) {
						console.log("last image uploaded")

						if (success != null) {
							success(savedPaths)
						}
					} else {
						index++
						self.callbackFileUpload(images, index, savedPaths, success, error)
					}
				})

				fileSystem.unlink(images[index].path, function (error) {
					if (error) {
						console.error(error)
						return
					}
				})
			})
		} else {
			if (success != null) {
				success(savedPaths)
			}
		}
	},

	init: function (router) {
		const self = this
		const productsRouter = express.Router()

		productsRouter.post("/destroy", auth, async function (request, result) {
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

			for (let a = 0; a < product.images.length; a++) {
				fileSystem.unlink(product.images[a], function (error) {
					console.log(error)
				})
			}

			await global.db.collection("products").remove({
				_id: product._id
			})

			result.json({
				status: "success",
				message: "Product has been deleted."
			})
		})

		productsRouter.post("/update", auth, async function (request, result) {
			const name = request.fields.name
			const description = request.fields.description
			const price = request.fields.price
			const itemsInStock = parseInt(request.fields.itemsInStock) || 0
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

			// check if all files are image
			for (let a = 0; a < request.files.images.length; a++) {
				if (request.files.images[a].size > 0 && (request.files.images[a].type == "image/jpeg" || request.files.images[a].type == "image/png")) {
					// 
				} else {
					result.json({
						status: "error",
						message: "Please select image file only."
					})
					return
				}
			}

			const images = []
			if (Array.isArray(request.files.images)) {
				for (let a = 0; a < request.files.images.length; a++) {
					images.push(request.files.images[a])
				}
			} else {
				if (request.files.images.size > 0) {
					images.push(request.files.images)
				}
			}

			self.callbackFileUpload(images, 0, [], async function (savedPaths) {
				// add in mongo db

				if (savedPaths.length > 0) {
					// delete previous images
					for (let a = 0; a < product.images.length; a++) {
						fileSystem.unlink(product.images[a], function (error) {
							console.log(error)
						})
					}

					await global.db.collection("products").findOneAndUpdate({
						_id: product._id
					}, {
						$set: {
							name: name,
							description: description,
							price: parseFloat(price),
							itemsInStock: itemsInStock,
							images: savedPaths
						}
					})
				} else {
					await global.db.collection("products").findOneAndUpdate({
						_id: product._id
					}, {
						$set: {
							name: name,
							description: description,
							itemsInStock: itemsInStock,
							price: parseFloat(price)
						}
					})
				}

				result.json({
					status: "success",
					message: "Product has been updated."
				})
			})
		})

		productsRouter.post("/fetchSingle", auth, async function (request, result) {
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

		productsRouter.post("/fetch", auth, async function (request, result) {
			const page = parseInt(request.fields.page) || 1

			// number of records you want to show per page
		    const perPage = 10

			// get records to skip
			const startFrom = (page - 1) * perPage
			
			const products = await global.db.collection("products").find({})
				.sort({
					"createdAt": -1
				})
				.skip(startFrom)
				.limit(perPage)
				.toArray()

			result.json({
				status: "success",
				message: "Data has been fetched.",
				products: products
			})
		})

		productsRouter.post("/add", auth, function (request, result) {
			const name = request.fields.name
			const description = request.fields.description
			const price = request.fields.price
			const itemsInStock = parseInt(request.fields.itemsInStock) || 0

			if (itemsInStock < 0) {
				result.json({
					status: "error",
					message: "Items in stock must be a positive number."
				})
				return
			}

			// check if all files are image
			for (let a = 0; a < request.files.images.length; a++) {
				if (request.files.images[a].size > 0 && (request.files.images[a].type == "image/jpeg" || request.files.images[a].type == "image/png")) {
					// 
				} else {
					result.json({
						status: "error",
						message: "Please select image file only."
					})
					return
				}
			}

			const images = []
			if (Array.isArray(request.files.images)) {
				for (let a = 0; a < request.files.images.length; a++) {
					images.push(request.files.images[a])
				}
			} else {
				images.push(request.files.images)
			}

			self.callbackFileUpload(images, 0, [], async function (savedPaths) {
				await global.db.collection("products").insertOne({
					name: name,
					description: description,
					price: parseFloat(price),
					itemsInStock: itemsInStock,
					images: savedPaths,
					createdAt: new Date().getTime()
				})

				result.json({
					status: "success",
					message: "Product has been added."
				})
			})
		})

		router.use("/products", productsRouter)
	}
}