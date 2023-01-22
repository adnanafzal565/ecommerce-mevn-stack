const jwt = require("jsonwebtoken")
const ObjectId = require("mongodb").ObjectId

module.exports = async function (request, result, next) {
    try {
        const accessToken = request.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(accessToken, jwtSecret)
        const adminId = decoded.adminId

        const admin = await db.collection("admins").findOne({
            accessToken: accessToken
        })

		if (admin == null) {
			result.json({
	            status: "error",
	            message: "Admin has been logged out."
	        })
			return
		}

        delete admin.password
        delete admin.accessToken
        delete admin.createdAt

        request.admin = admin
        next()
    } catch (exp) {
        result.json({
            status: "error",
            message: "Admin has been logged out."
        })
    }
}