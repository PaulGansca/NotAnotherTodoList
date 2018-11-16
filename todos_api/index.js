var express = require("express"),
  app = express();
var port = 3000;

app.get("/", function(req, res) {
  res.send("Hi from Express");
});

app.get("/drunk", function(req, res) {
  res.json({ alcohol: "beer" });
});

app.listen(port, function() {
  console.log("App is running on port " + port);
});
