const mongoose = require("mongoose");

//clipboard

const linksSchema = {
    description: String,
    clipboard: String,
    date: String
};

const Link = mongoose.model("Link", linksSchema);

module.exports = {
    linksSchema: linksSchema,
    Link: Link
};