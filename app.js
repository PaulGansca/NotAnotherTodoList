//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('views', __dirname + '/views');
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
});

const itemsSchema = {
  name: String
};

const ROOT_LIST = "Today";

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Make todo list persist"
});

const item2 = new Item({
  name: "Celebrate exam results"
});

const item3 = new Item({
  name: "Revise Language Processors"
});

const defaultItems = [item1, item2, item3];

//ideas

const ideasSchema = {
  name: String,
  content: String
}

const Idea = mongoose.model("Idea", ideasSchema);

//clipboard

const linksSchema = {
  name: String,
  clipboard: String
}

const Link = mongoose.model("Link", linksSchema);

const listSchema = {
  name: String,
  type: String,
  description: String,
  todos: [itemsSchema],
  ideas: [ideasSchema],
  clipboard: [linksSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

  List.find((err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        listTitle: ROOT_LIST,
        newLists: results
      });
    }
  })

});

app.get("/create/:customListName", (req, res) => {
  let customListName = req.params.customListName;

  List.findOne({
    name: customListName
  }, (err, results) => {
    if (err) {
      console.log(err);
    } else if (!results) {
      //list doesn't exist so create one
      const list = new List({
        name: customListName,
        type: "HARDCODED",
        description: "HARDCODED IN CREATE ROUTE",
        todos: defaultItems
      });

      list.save();

      res.redirect(`/${customListName}`)
    } else {
      //show existing
      res.redirect(`/${customListName}`)
      res.render("list", {
        listTitle: results.name,
        newListItems: results.todos
      });
    }
  })

});

app.get("/:customListName", (req, res) => {
  let customListName = req.params.customListName;

  List.findOne({
    name: customListName
  }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      //show existing
      res.render("list", {
        listTitle: results.name,
        newListItems: results.todos
      });
    }
  })
})

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === ROOT_LIST) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, (err, results) => {
      results.todos.push(item);
      results.save();
      res.redirect(`/${listName}`);
    })
  }

});

app.post("/delete", (req, res) => {
  //select inputs that are checked
  const doneItem = req.body.checkbox;
  const listName = req.body.listName;

  //use their name to find them in the db and delete
  if (listName === ROOT_LIST) {
    List.deleteOne({
      _id: doneItem
    }, err => {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        todos: {
          _id: doneItem
        }
      }
    }, (err, results) => {
      if (!err) {
        res.redirect(`/${listName}`)
      }
    })
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});