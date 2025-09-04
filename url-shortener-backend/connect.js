const mongoose = require("mongoose");

async function connectToMongoDB(url) {
    return mongoose.connect(url);  // its returnn a promise
}

module.exports = {
    connectToMongoDB
}