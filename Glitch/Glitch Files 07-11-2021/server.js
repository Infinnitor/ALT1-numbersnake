console.log("Server log - start again");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// Not sure that the next 3 lines are actually needed
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static("public"));

// This is called when the app is first started
app.get("/", function(request, response) {
  console.log("In app.get (/)");
  response.sendFile(__dirname + "/views/index.html");
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

// Create the database object
const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("DEMODB"); // database name

// Process the HTTP POST request for /putData
app.post("/putData", function(request, response) {
  console.log("In app.post (/putData)");

  // Construct insert statement
  // Example: INSERT INTO scores(displayname, score) VALUES ("Mario", 2)
  var insStr = "INSERT INTO scores(displayname, score) VALUES (";
  insStr = insStr + "\"" + request.body.username + "\", ";
  insStr = insStr + request.body.score + ");";
  console.log(insStr);

  // We can test the thing without actually modifying the database
  if (request.body.username == "TEST") {
      console.log("TEST detected");
  }
  else { db.run(insStr); }
});


// Process the HTTP GET request for /getData
app.get("/getScores", function(request, response) {
  console.log("Getting scores");
  db.all("SELECT * from scores", function(err, rows) {
    console.log(rows);
    response.send(JSON.stringify(rows));
  });
});
