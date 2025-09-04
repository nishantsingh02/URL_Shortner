const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const urlSchema = new Schema({
  shortId: {
    type: String,
    require: true,
    unique: true,
  },
  redirectURL: {
    type: String,
    require: true,
  },
  visitHistory: [
    {
      timestamp: {
        type: Number,
      },
    },
    {
      timestamp: true,
    },
  ],
});


const URL = model("url", urlSchema);

module.exports = URL;