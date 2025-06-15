import jwt from "jsonwebtoken"
import { customError } from "../utils/customError.js"
import { User } from "../models/user.model.js"

const authorize = async (req, res, next) => {
    try {
        
        const token = req.cookies.token
        
        if(!token) customError("Unauthorized, no token provided", 401)

        const decoded = jwt.verify(token, process.env.JWT_SECRET)    

        const user = await User.findById(decoded.userId).select("-__v -password -createdAt -updatedAt -lastLogin -emailVerificationToken -emailVerificationExpiresAt -resetPasswordToken -resetPasswordExpiresAt")
        
        if(!user) customError("Unauthorized, user not found", 401)
        
        req.user = user

        next()

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || "Unauthorized"
        })
       
    }
}

export default authorize; 