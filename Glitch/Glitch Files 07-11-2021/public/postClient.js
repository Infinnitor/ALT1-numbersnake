var domainPrefix = true;
const URLname = (domainPrefix) ? "https://astonishing-horn-play.glitch.me" : "";
console.log((URLname) ? URLname : "Using relative URL (idk what its called)");

var globalData = [];
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


function checkLocalStorage() {
    let localStore = window.localStorage;
    let localID = localStore.getItem("userID");

    alert(localID);
}


console.log("ALERT");
checkLocalStorage();
