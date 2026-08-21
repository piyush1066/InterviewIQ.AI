import jwt from "jsonwebtoken"

const isAuth = async (req,res,next) => {
    try {
        let {token}= req.cookies

        if(!token){
            return res.status(400).json({message:"User isn't logged in."})
        }
        const varifyToken = jwt.verify(token , process.env.JWT_SECRET)

        if(!varifyToken){
            return res.status(400).json({message:"user does not have valid token"})
        }
        req.userId = varifyToken.userId

        next()

    } catch (error) {
         return res.status(500).json({error:"isAuth Error"})
    }
}

export default isAuth