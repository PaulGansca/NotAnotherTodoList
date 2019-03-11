const express = require("express");
const router = express.Router();
const List = require("../models/list");
const Link = require("../models/link").Link;
const _ = require("lodash");

router.get("/clipboard/:customListName", (req, res) => {
    let customListName = _.kebabCase(req.params.customListName);
    let elementId = -1;
    List.findOne({
            name: customListName,
            type: "clipboard"
        },
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                //show existing
                res.render("clipboard", {
                    listTitle: results.name,
                    newListItems: results.clipboard,
                    elementId: elementId
                });
            }
        }
    );
});

router.post("/clipboard", (req, res) => {
    const clipboardName = req.body.clipboard;
    const elemContent = req.body.content;
    const elemDescription = req.body.description;
    var date = new Date().toLocaleDateString();

    const link = new Link({
        description: elemDescription,
        clipboard: elemContent,
        date: date
    });

    List.findOne({
            name: clipboardName
        },
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                results.clipboard.push(link);
                results.save();
                res.redirect(`/clipboard/${clipboardName}`);
            }
        }
    );
});

router.post("/clipboard/delete", (req, res) => {
    //select Link that was binned
    const deleteLink = req.body.deleteButton;
    const listName = req.body.listName;

    //use their name to find them in the db and delete

    List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                clipboard: {
                    _id: deleteLink
                }
            }
        },
        (err, results) => {
            if (!err) {
                res.redirect(`/clipboard/${listName}`);
            }
        }
    );
});

router.get("/:customListName/clipboard/:elementId", (req, res) => {
    let customListName = _.kebabCase(req.params.customListName);
    let elementId = req.params.elementId;

    List.findOne({
            name: customListName,
            type: "clipboard"
        },
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                //show existing
                res.render("clipboard", {
                    listTitle: results.name,
                    newListItems: results.clipboard,
                    elementId: elementId
                });
            }
        }
    );
});

router.patch("/:customListName/clipboard/:elementId", (req, res) => {
    var date = new Date().toLocaleDateString();
    List.updateOne({
            name: req.params.customListName,
            clipboard: {
                $elemMatch: {
                    _id: req.params.elementId
                }
            }
        }, { //update just the right Link inside clipboard
            $set: {
                "clipboard.$.clipboard": req.body.content,
                "clipboard.$.description": req.body.description,
                "clipboard.$.date": date
            }
        },
        err => {
            if (!err) {
                res.redirect(`/clipboard/${req.params.customListName}`);
            } else {
                res.send(err);
            }
        }
    );
});

module.exports = router;