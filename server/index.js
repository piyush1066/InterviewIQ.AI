import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);


import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config()
const app = express()
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)




const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
    connectDb();
}) 