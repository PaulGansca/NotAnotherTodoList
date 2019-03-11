//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const methodOverride = require("method-override");
const idea = require("./models/idea");
const item = require("./models/item");
const link = require("./models/link");
const list = require("./models/list");

const app = express();

app.set("view engine", "ejs");

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(methodOverride('_method'))
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.use('/scripts', express.static(__dirname + '/node_modules/clipboard/dist/'));
mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useFindAndModify: false
});

const indexRoutes = require("./routes/index");
const todolistRoutes = require("./routes/todolist");
const clipboardRoutes = require("./routes/clipboard");
const ideaRoutes = require("./routes/idea");


app.use(indexRoutes);
app.use(todolistRoutes);
app.use(clipboardRoutes);
app.use(ideaRoutes);

app.listen(3000, function () {
    console.log("Server started on port 3000");
});