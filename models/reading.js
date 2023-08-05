const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class Reading {
  constructor(title, category, voteCount) {
    this.title = title;
    this.category = category;
    this.voteCount = voteCount;
  }

  async save() {
    try {
      const db = getDb();
      const result = await db.collection("readings").insertOne(this);

      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {
    } catch (err) {
      console.log(err);
    }
  }
}
