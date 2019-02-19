//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

//TODO add another field called type 
const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

  Item.find((err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results.length === 0) {
        Item.insertMany(defaultItems, err => {
          if (err) {
            console.log(err);
          } else {
            console.log("Saved default items to db")
          }
        });
      }

      res.render("list", {
        listTitle: "Today",
        newListItems: results
      });
    }
  })

});

app.get("/create/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({
    name: customListName
  }, (err, results) => {
    if (err) {
      console.log(err);
    } else if (!results) {
      //list doesn't exist so create one
      const list = new List({
        name: req.params.customListName,
        items: defaultItems
      });

      list.save();

      res.redirect(`${customListName}`)
    } else {
      //show existing
      res.render("list", {
        listTitle: results.name,
        newListItems: results.items
      });
    }
  })

});

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({
    name: customListName
  }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      //show existing
      res.render("list", {
        listTitle: results.name,
        newListItems: results.items
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
  //TODO modify when changing root list name
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, (err, results) => {
      results.items.push(item);
      results.save();
      res.redirect(`/${listName}`);
    })
  }

});

app.post("/delete", (req, res) => {
  //select inputs that are checked
  const doneItem = Object.keys(req.body)[0];

  //use their name to find them in the db and delete
  Item.deleteOne({
    _id: doneItem
  }, (err) => {
    if (err) {
      console.log(err);
    } else {

      res.redirect("/");
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});