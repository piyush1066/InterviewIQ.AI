import jwt from "jsonwebtoken"

const genToken = (userId) => jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
)

export default genToken
