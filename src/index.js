const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectToDB = require("./config/db.config");
const apiRouter = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.text());
app.use(cors({
    origin: "*"
}));

app.use("/api", apiRouter);

app.listen(3000, ()=>{
    console.log("server listening on port 3000");
    connectToDB();
});