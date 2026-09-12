console.log("🔥 INDEX.JS STARTED");
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

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}))


app.use(express.json())
app.use(cookieParser())

app.get("/test", (req, res) => {
    console.log("🔥 TEST ROUTE HIT");
    res.send("Server is working");
});

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)




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
