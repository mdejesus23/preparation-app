const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const themeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
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
});

module.exports = mongoose.model("Theme", themeSchema);

// const mongodb = require("mongodb");
// const { getDb } = require("../util/database");

// class Theme {
//   constructor(title, imageUrl, description, readings, id) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.readings = readings; //[{reading: category: votes: }]
//     this._id = id ? new mongodb.ObjectId(id) : null;
//   }

//   async save() {
//     try {
//       const db = getDb();
//       let dbOp;
//       if (this._id) {
//         dbOp = db
//           .collection("themes")
//           .updateOne({ _id: this._id }, { $set: this });
//       } else {
//         dbOp = db.collection("themes").insertOne(this);
//       }
//       const result = await dbOp;

//       console.log(result);
//       return result;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async fetchAll() {
//     try {
//       const db = getDb();
//       const themes = await db.collection("themes").find().toArray();
//       return themes;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async findById(themeId) {
//     try {
//       const db = getDb();
//       const theme = await db
//         .collection("themes")
//         .find({ _id: new mongodb.ObjectId(themeId) })
//         .next();
//       // console.log(theme);
//       return theme;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async deleteById(themeId) {
//     try {
//       const db = getDb();
//       await db
//         .collection("themes")
//         // the curly braces {} in the deleteOne database query are used to define the filter criteria.
//         .deleteOne({ _id: new mongodb.ObjectId(themeId) });
//       console.log("theme deleted!");
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async addReading(reading, category, id) {
//     try {
//       const db = getDb();
//       const theme = await db
//         .collection("themes")
//         .find({ _id: new mongodb.ObjectId(id) })
//         .next();

//       // Make sure to handle cases where the theme with the given ID is not found to prevent errors.
//       if (!theme) {
//         throw new Error("Theme not found.");
//       }

//       // create new reading object.
//       const newReading = {
//         _id: new mongodb.ObjectId(),
//         reading: reading,
//         category: category,
//         voteCount: 0,
//         voters: [],
//       };

//       // update reading array with theme old readings and new reading.
//       const updatedReadings = [...theme.readings, newReading];

//       const result = await db
//         .collection("themes")
//         .updateOne(
//           { _id: new mongodb.ObjectId(id) },
//           { $set: { readings: updatedReadings } }
//         );
//       return result;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }

// module.exports = Theme;
