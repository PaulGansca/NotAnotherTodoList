var express = require("express");
var router = express.Router();
const List = require("../models/list");
const _ = require("lodash");

const ROOT_LIST = "All Lists";



// const item1 = new Item({
//     name: "Make todo list persist"
// });

// const item2 = new Item({
//     name: "Celebrate exam results"
// });

// const item3 = new Item({
//     name: "Revise Language Processors"
// });

// const defaultItems = [item1, item2, item3];

router.get("/", function (req, res) {
    List.find((err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render("home", {
                listTitle: ROOT_LIST,
                newLists: results
            });
        }
    });
});

router.get("/createList", (req, res) => {
    res.render("createList");
});

router.post("/createList", (req, res) => {
    let listName = _.kebabCase(req.body.listName);
    let listType = req.body.listType;
    let listDescription = req.body.listDescription;

    List.findOne({
            name: listName
        },
        (err, results) => {
            if (err) {
                res.send(err);
            } else if (!results) {
                //list doesn't exist so create one
                const list = new List({
                    name: listName,
                    type: listType,
                    description: listDescription
                });

                list.save();

                res.redirect(`/${listType}/${listName}`);
            } else {
                //show existing
                res.redirect(`/${listName}`);
                res.render(listType, {
                    listTitle: results.name,
                    newListItems: results.todos
                });
            }
        }
    );
});



router.get("/about", function (req, res) {
    res.render("about");
});

module.exports = router;