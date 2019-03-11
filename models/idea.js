const mongoose = require("mongoose");

//ideas

const ideasSchema = {
    name: String,
    content: String
};

const Idea = mongoose.model("Idea", ideasSchema);

module.exports = {
    ideasSchema: ideasSchema,
    Idea: Idea
};