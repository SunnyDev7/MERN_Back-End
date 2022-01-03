require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParse = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth")

const app = express();

//DB Connection
mongoose.connect(process.env.DATABASE, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB")
});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParse());
app.use(cors());

//Routes
app.use("/api", authRoutes);

//Port
const port = process.env.PORT || 8000;

//Spinning a server
app.listen(port, () => {
    console.log(`Server up and running on port ${port}`)
});

