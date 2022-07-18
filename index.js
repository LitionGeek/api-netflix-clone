const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors")
const authRoute = require("./src/routes/auth")
const usersRoute = require("./src/routes/users")
const moviesRoute = require("./src/routes/movies")
const listsRoute = require("./src/routes/lists")
const bodyParser = require("body-parser")
const morgan = require("morgan")
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>console.log("DB Connected")).catch(()=>{console.log("error")});
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan("dev"));


app.listen(8800,(req,res)=>{
    console.log("Backend server is running!")
})

app.use("/api/auth",authRoute)
app.use("/api/users",usersRoute)
app.use("/api/movies",moviesRoute)
app.use("/api/lists",listsRoute)