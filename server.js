const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require('body-parser')


// SETUP
const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

const DB ='mongodb://localhost:27017/stock'

const connect = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Connected to mongoDB")
  } catch (error) {
    console.log(error);
  }
};

mongoose.connection.on("disconnected",()=>{
    console.log("mongoDB disconnected!")
})

app.use(cors({origin: ["http://localhost:3000"],methods:["GET","POST","PATCH"],credentials:true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("secretcode"));
app.use(bodyParser.json())


// ROUTES
const authRouter = require("./routes/authRoutes");
const dataRouter = require("./routes/dataRoutes");
const newsRouter = require("./routes/newsRoutes");
const stockRouter = require("./routes/stockRoutes");

app.use("/api/auth", authRouter);
app.use("/api/data", dataRouter);
app.use("/api/news", newsRouter);
app.use("/api/stock", stockRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../client/build/index.html"));
  });
}

// APP
app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
