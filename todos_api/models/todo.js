//name
//completed
//created_date

var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name cannot be blank!"
  },
  completed: {
    type: Boolean,
    default: false
  },
  created_date: {
    type: Data,
    default: Date.now
  }
});

var Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
