const mongoose = require("mongoose");
const ideasSchema = require("./idea");
const itemsSchema = require("./item");
const linksSchema = require("./link");

const listSchema = {
    name: String,
    type: String,
    description: String,
    todos: [itemsSchema.itemsSchema],
    ideas: [ideasSchema.ideasSchema],
    clipboard: [linksSchema.linksSchema]
};

module.exports = mongoose.model("List", listSchema);