const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const PORT = process.env.PORT;
const userRouter = require("./Routes/userroute");

const app = express();
app.use(express.json());
app.use(cors());

app.use('/user', userRouter);

app.get('/', (req,res) => {
    res.send("welcome!");
})

mongoose.connect(process.env.MONGODBURL)
.then(() => console.log("Connected to the database"))
.catch((err) => console.log(err.message))

app.listen(PORT, () => console.log(`connected to port ${PORT}`))