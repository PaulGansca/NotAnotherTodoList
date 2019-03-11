const express = require("express");
const router = express.Router();
const _ = require("lodash");
const List = require("../models/list");
const Item = require("../models/item").Item;
const ROOT_LIST = "All Lists";

router.get("/todolist/:customListName", (req, res) => {
    let customListName = _.kebabCase(req.params.customListName);

    List.findOne({
            name: customListName,
            type: "todolist"
        },
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                //show existing
                res.render("todolist", {
                    listTitle: results.name,
                    newListItems: results.todos
                });
            }
        }
    );
});

router.post("/todolist", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    List.findOne({
            name: listName
        },
        (err, results) => {
            results.todos.push(item);
            results.save();
            res.redirect(`/todolist/${listName}`);
        }
    );
});

router.post("/todolist/delete", (req, res) => {
    //select inputs that are checked
    const doneItem = req.body.checkbox;
    const listName = req.body.listName;

    //use their name to find them in the db and delete
    if (listName === ROOT_LIST) {
        List.deleteOne({
                _id: doneItem
            },
            err => {
                if (!err) {
                    res.redirect("/");
                }
            }
        );
    } else {
        List.findOneAndUpdate({
                name: listName
            }, {
                $pull: {
                    todos: {
                        _id: doneItem
                    }
                }
            },
            (err, results) => {
                if (!err) {
                    res.redirect(`/todolist/${listName}`);
                }
            }
        );
    }
});

module.exports = router;