const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const themeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  passcode: {
    type: String,
    required: true,
  },
  readings: [
    {
      reading: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      voteCount: {
        type: Number,
        required: true,
      },
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: String,
});

module.exports = mongoose.model("Theme", themeSchema);
