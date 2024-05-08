const { Schema, model, models } = require("mongoose");

const sessionSchema = new Schema({
  uid: Schema.Types.ObjectId,
});

const Session = models?.Session || model("session", sessionSchema);

module.exports = { Session };
