const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const Route = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const dotenv = require("dotenv");
dotenv.config();


connectToMongoDB(process.env.MONGO_URI)
.then(() => console.log("connect to mongoDB"))

app.use(express.json());
app.use(cors());
app.use("/url", Route);

app.get("/:shortId", async function(req,res){
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push: {
        visitHistory: {
            timestamp: Date.now()
        },
    } })
    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));