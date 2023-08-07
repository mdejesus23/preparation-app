const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class Theme {
  constructor(title, imageUrl, description, readings, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.readings = readings; //[{reading: category: votes: }]
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  async save() {
    // const db = getDb();
    // let dbOp;
    // if (this._id) {
    //   dbOp = db
    //     .collection("themes")
    //     .updateOne({ _id: this._id }, { $set: this });
    // } else {
    //   dbOp = db.collection("themes").insertOne(this);
    // }

    // return dbOp
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .then((err) => {
    //     console.log(err);
    //   });

    try {
      const db = getDb();
      let dbOp;
      if (this._id) {
        dbOp = db
          .collection("themes")
          .updateOne({ _id: this._id }, { $set: this });
      } else {
        dbOp = db.collection("themes").insertOne(this);
      }
      const result = await dbOp;

      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();
      const themes = await db.collection("themes").find().toArray();
      return themes;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(themeId) {
    try {
      const db = getDb();
      const theme = await db
        .collection("themes")
        .find({ _id: new mongodb.ObjectId(themeId) })
        .next();
      // console.log(theme);
      return theme;
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteById(themeId) {
    try {
      const db = getDb();
      await db
        .collection("themes")
        .deleteOne({ _id: new mongodb.ObjectId(themeId) });
      console.log("theme deleted!");
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Theme;
