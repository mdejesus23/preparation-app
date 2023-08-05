const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class Theme {
  constructor(themeTitle, category, words) {
    this.themeTitle = themeTitle;
    this.category = category;
    this.readings = [{ reading: words, id: 1 }];
  }

  async save() {
    try {
      const db = getDb();
      const result = await db.collection("themes").insertOne(this);

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
}

module.exports = Theme;
