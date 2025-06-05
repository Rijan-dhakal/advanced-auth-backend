import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './databases/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res)=>{
    res.send("Hello homepage")
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();


app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
