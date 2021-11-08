var domainPrefix = true;
const URLname = (domainPrefix) ? "https://astonishing-horn-play.glitch.me" : "";
console.log((URLname) ? URLname : "Using relative URL (idk what its called)");

var globalUserIDs = [];

// Have to make these bools to prevent multiple function calls because of Firefox JS.event
var idPreventDefault = false;
var preventSubmitDefault = false;


// Submit clicked so post the data to the server
function submitDataToServer(playerName, playerScore, endFunc) {
    if (preventSubmitDefault) { return; }
    preventSubmitDefault = true;

    console.log("SUBMIT clicked!!!"); // display a message
    // create an object to post to the server
    // IMPORTANT: ONE NAME - VALUE PAIR FOR EACH FIELD
    let dataObj = {
        username: playerName,
        score: playerScore
    };

    const requestMsg = new XMLHttpRequest();
    requestMsg.open("post", URLname + "/putData", true); // open a HTTP post request
    requestMsg.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    requestMsg.send(JSON.stringify(dataObj));

    preventSubmitDefault = false;
    if (endFunc) {
        setTimeout(endFunc, 1000);
    }
}


// Function to check if the local userID exists
function checkLocalStorage() {
    if (idPreventDefault) { return; }
    idPreventDefault = true;

    let localID = window.localStorage.getItem("userID");

    var addLocalID = function() {
        console.log(this.responseText);
        let userIDs = JSON.parse(this.responseText);
        userIDs.forEach(function(row) {
            globalUserIDs.push(parseInt(row, 10));
        });

        window.localStorage.setItem("userID", globalUserIDs.length);

        let newLocalID = window.localStorage.getItem("userID");

        let newID = {
            userID: newLocalID,
        };

        const postRequest = new XMLHttpRequest();
        postRequest.open("post", URLname + "/addNewUserID", true); // open a HTTP post request
        postRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        postRequest.send(JSON.stringify(newID));
    }

    alert(localID);

    // If it doesn't exist, then get list of IDs from server and add new ID
    if (!localID) {
        const requestMsg = new XMLHttpRequest();
        requestMsg.addEventListener("load", addLocalID);
        requestMsg.open("get", URLname + "/getUniqueUser");
        requestMsg.send();
    }

    idPreventDefault = false;

}

checkLocalStorage();
