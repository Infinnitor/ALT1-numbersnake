// Prefix all requests with this URL is domainPrefix is true
const domainPrefix = true;
const URLname = (domainPrefix) ? "https://astonishing-horn-play.glitch.me" : "";
console.log((URLname) ? URLname : "Using relative URL (idk what its called)");


// This function is not used in this file, it is here for reference
function submitDataToServer() {
    console.log("SUBMIT clicked!!!"); // display a message
    // create an object to post to the server
    // IMPORTANT: ONE NAME - VALUE PAIR FOR EACH FIELD
    let dataObj = {
        username: document.getElementById("userName").value,
        score: document.getElementById("scoreVal").value
    };

    // This line does not work on Firefox. Sometimes
    event.preventDefault(); // Prevents 2 calls to this function

    const requestMsg = new XMLHttpRequest();
    requestMsg.open("post", URLname + "/putData", true); // open a HTTP post request
    requestMsg.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    requestMsg.send(JSON.stringify(dataObj));
}


// Send a request to the server to query the database and send the data back
function getDataFromServer(reciever) {

    // Very simple wrapper to pass this.responseText attribute into function
    // This is to satisfy the restraints of the XMLHttpRequest stuff
    function getWrapper(func) {
        return function() { func(this.responseText); }
    }

    console.log("getScores()");

    // Assemble a get request to the server for the data
    const requestMsg = new XMLHttpRequest();
    requestMsg.addEventListener("load", getWrapper(reciever)); // attach a listener
    requestMsg.open("get", URLname + "/getScores"); // open a HTTP GET request
    requestMsg.send();
}


// Function for tunring recieved data into a HTML list and displaying it
function displayData(responseText) {
    console.log("displayData()");

    let users = JSON.parse(responseText);

    // Get the <ol> tag
    const rowHTML = document.getElementById("rowlist");
    rowHTML.innerHTML = "";

    // Assemble a list of all the scores from the responseText
    let rowList = [];
    users.forEach(function(row) {
        let scoreObj = {
            username: row["displayname"],
            score: parseInt(row["score"])
        }

        rowList.push(scoreObj);
    });

    // Sort the list with highest scores first
    rowList.sort((a, b) => a.score - b.score);
    rowList.reverse();

    // Add rowList items to HTML
    for (let i=0; i<rowList.length; i++) {
        // Only top 5
        if (i > 4) {
            break;
        }

        let newListItem = document.createElement("li");
        newListItem.innerHTML = rowList[i].username + " : " + rowList[i].score;
        rowHTML.appendChild(newListItem);
    }
}
