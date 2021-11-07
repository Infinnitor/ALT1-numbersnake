const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", submitDataToServer);

// const getBtn = document.getElementById("display-scores-btn");
// getBtn.addEventListener("click", getDataFromServer);

const domainPrefix = true;
const URLname = (domainPrefix) ? "https://astonishing-horn-play.glitch.me" : "";
console.log((URLname) ? URLname : "Using relative URL (idk what its called)");

var globalData = [];



// Submit clicked so post the data to the server
function submitDataToServer() {
    console.log("SUBMIT clicked!!!"); // display a message
    // create an object to post to the server
    // IMPORTANT: ONE NAME - VALUE PAIR FOR EACH FIELD
    let dataObj = {
        username: document.getElementById("userName").value,
        score: document.getElementById("scoreVal").value
    };

    // JUST USE THESE LINES AS THEY ARE - NO NEED TO CHANGE
    event.preventDefault(); // prevents 2 calls to this function!!

    const requestMsg = new XMLHttpRequest();
    requestMsg.open("post", URLname + "/putData", true); // open a HTTP post request
    requestMsg.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    requestMsg.send(JSON.stringify(dataObj));
}


// Send a request to the server to query the db and send the data back
function getDataFromServer(reciever) {

    // Very simple wrapper to pass this.responseText attr into function
    // This is to satisfy the restraints of the XMLHttpRequest stuff
    function getWrapper(func) {
        return function() { func(this.responseText); }
    }

    console.log("getScores()"); // display a debug message

    // request the data from the database
    const requestMsg = new XMLHttpRequest();
    requestMsg.addEventListener("load", getWrapper(reciever)); // attach a listener
    requestMsg.open("get", URLname + "/getScores"); // open a HTTP GET request
    requestMsg.send();
}


function testUpdate(responseText) {
    updateClientDataTable(responseText);
    alert(globalData);
}


function updateClientDataTable(responseText) {
    let users = JSON.parse(responseText);
    globalData = [];

    users.forEach(function(row) {
        // const newListItem = document.createElement("li");
        // newListItem.innerHTML = row["displayname"] + " : " + row["score"];
        // rowList.appendChild(newListItem);

        let scoreObj = {
            username: row["displayname"],
            score: parseInt(row["score"])
        }

        globalData.push(scoreObj);
    });
}


// function checkServerScores(responseText) {
//     let dataTable = JSON.parse(responseText);
//
//     let testUsername = document.getElementById("userName").value;
//
//     let rowList = [];
//     dataTable.forEach(function(row) { rowList.push(row["displayname"]); });
//
//     if (rowList.contains(testUsername)) {
//         alert("USERNAME ALREADY EXISTS");
//     }
// }
//
// let checkValidScorePOST = () => getDataFromServer(checkServerScores);


function displayData(responseText) {
    console.log("displayData()");

    // You guys it changed an attribute of the function!
    let users = JSON.parse(responseText);

    // define variables that reference elements on our page
    const rowHTML = document.getElementById("rowlist");
    rowHTML.innerHTML = "";

    let rowList = [];
    // iterate through every row and add it to our page
    users.forEach(function(row) {
        // const newListItem = document.createElement("li");
        // newListItem.innerHTML = row["displayname"] + " : " + row["score"];
        // rowList.appendChild(newListItem);

        let scoreObj = {
            username: row["displayname"],
            score: parseInt(row["score"])
        }

        rowList.push(scoreObj);
    });

    rowList.sort((a, b) => a.score - b.score);
    rowList.reverse();

    for (let i=0; i<rowList.length; i++) {
        let newListItem = document.createElement("li");
        newListItem.innerHTML = rowList[i].username + " : " + rowList[i].score;
        rowHTML.appendChild(newListItem);
    }
}
