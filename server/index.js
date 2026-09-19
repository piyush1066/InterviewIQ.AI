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
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

app.use(cors({
    origin: "https://interviewiq-ai-1-client-ww5q.onrender.com",
    credentials: true
}));


app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment", paymentRouter)



const PORT = process.env.PORT || 8000

const startServer = async () => {
    try {
        await connectDb();
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

startServer()
