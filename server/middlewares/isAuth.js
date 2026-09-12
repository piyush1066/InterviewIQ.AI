import jwt from "jsonwebtoken"

const isAuth = async (req,res,next) => {
    try {
        let {token}= req.cookies

        if(!token){
            return res.status(401).json({message:"User isn't logged in."})
        }
        const verifyToken = jwt.verify(token , process.env.JWT_SECRET)

        if(!verifyToken){
            return res.status(401).json({message:"user does not have valid token"})
        }
        req.userId = verifyToken.userId

        next()

    } catch (error) {
         return res.status(401).json({error:"isAuth Error: invalid or expired token"})
    }
}

export default isAuth