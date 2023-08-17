const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  result: {
    themes: [
      {
        themeId: {
          type: Schema.Types.ObjectId,
          ref: "Theme",
          required: true,
        },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const { getDb } = require("../util/database");

// class User {
//   constructor(username, email, id) {
//     this.username = username;
//     this.email = email;
//     this._id = id;
//   }

//   async save() {
//     try {
//       const db = getDb();

//       const result = await db.collection("user").insertOne(this);
//       console.log(result);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async findById(userId) {
//     try {
//       const db = getDb();
//       const user = await db
//         .collection("users")
//         .findOne({ _id: new mongodb.ObjectId(userId) });
//       //   console.log(user);
//       return user;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }

// module.exports = User;
