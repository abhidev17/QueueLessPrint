const userRoutes = require("./routes/userRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/queuelessprint")
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.log(err));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("QueueLess Print Backend Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});