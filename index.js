import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './databases/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res)=>{
    res.send("Hello homepage")
})

// auth router
app.use("/api/auth",authRouter)

// connecting to database
connectDB();

// error handler middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
