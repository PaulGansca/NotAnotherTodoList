const express = require("express");
const router = express.Router();
const List = require("../models/list");
const Idea = require("../models/idea").Idea;
const _ = require("lodash");

router.get("/idea/:customListName", (req, res) => {
    let customListName = _.kebabCase(req.params.customListName);
    let elementId = -1;
    List.findOne({
            name: customListName,
            type: "idea"
        },
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                //show existing
                res.render("idea", {
                    listTitle: results.name,
                    newListItems: results.ideas,
                    elementId: elementId
                });
            }
        }
    );
});

router.post("/idea", function (req, res) {
    let listName = req.body.listName;

    const idea = new Idea({
        name: "",
        content: ""
    });

    List.findOne({
            name: listName
        },
        (err, results) => {
            results.ideas.push(idea);
            results.save();
            res.redirect(`/idea/${listName}`);
        }
    );
});

router.post("/idea/delete", (req, res) => {
    //select Link that was binned
    const deleteLink = req.body.deleteButton;
    const listName = req.body.listName;

    //use their name to find them in the db and delete

    List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                ideas: {
                    _id: deleteLink
                }
            }
        },
        (err, results) => {
            if (!err) {
                res.redirect(`/idea/${listName}`);
            }
        }
    );
});

router.get("/:customListName/idea/:elementId", (req, res) => {
    let customListName = _.kebabCase(req.params.customListName);
    let elementId = req.params.elementId;

    List.findOne({
            name: customListName,
            type: "idea"
        },
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                //show existing
                res.render("idea", {
                    listTitle: results.name,
                    newListItems: results.ideas,
                    elementId: elementId
                });
            }
        }
    );
});

router.patch("/:customListName/idea/:elementId", (req, res) => {
    List.updateOne({
            name: req.params.customListName,
            ideas: {
                $elemMatch: {
                    _id: req.params.elementId
                }
            }
        }, { //update just the right Link inside clipboard
            $set: {
                "ideas.$.name": req.body.ideaTitle,
                "ideas.$.content": req.body.ideaBody
            }
        },
        err => {
            if (!err) {
                res.redirect(`/idea/${req.params.customListName}`);
            } else {
                res.send(err);
            }
        }
    );
});

module.exports = router;