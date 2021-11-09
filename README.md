# ALT1-numbersnake
Applied Learning Task 1 - Interractive website

The requirements for the project were:

- [x] - Write a webpage with HTML, CSS and Javascript

- [x] - Establish a connection between client and server

- [x] - Send and receive data through GET and POST requests

- [x] - Have some kind of social message


# Description
For our project we decided that we would make a client side game that would submit highscores in the game. We chose the classic game Snake as our client side game, however we added some features to it - such as the snake eating numbers and the ability to revive your snake and keep your score when you die, provided that you could add up all the numbers you collected. The game is targeted at younger children as it is intended to tie learning basic addition into a fun game


# Database
There are two main tables in our database, the scores table, and the uniqueUsers table. The scores table is the more important one, as it contains a list of user's scores, that are uploaded when they finish the game, along with a display name that they can choose when submitting their highscore.

The uniqueUsers table is less useful, as it doesn't provide anything to the user, as it is used solely for the purpose of logging how many unique users there are on the website, without identifying them. To do this, it uses browser localStorage to store an ID for a user. If the localStorage is empty, that would indicate that it is a new user, and it submits some data to the server to increase the amount of user IDs in the table. localStorage also stores the most recent display name that the user has put in, however it does not submit this to the uniqueUsers table.

An expansion on this databse system would be to potentially change the ID system so that it links a userID to a highscore, in order to allow users to update their score in the game when they beat it, instead of simply adding a new item.


# Client-Server
Our server was written entirely in Javascript, and uses the website Glitch.com (which is a wrapper for Node.js, among other things). On the server side, it uses Express to run the server and handle requests. On the client side it uses standard XMLHttpRequests to communicate with the server.

There are four main HTTP requests that are utilised. In terms of managing the highscores, there are /putData, which is used to post a user's score, and /getScores, which is used to send the list of highscores to the client side. There are also two other requests that handle user IDs. The names of these requests are /getUniqueUser, which is used to get a list of the IDs, and /addNewUserID, which is used to update the database if the client detects that it is a new user (which is indicated by a lack of localStorage)


# Challenges
There were some challenges we faced during this project. One of the early ones was with making the snake's tail, but we were able to solve this when a group member came up with a solution that involved the snake leaving a trail behind which dissapears after a few frames, instead of moving the snake's tail based on the velocity of the snake at a given time. The length of the snake can thus be incremented by increasing the amount of time that this trail stays on screen.

The majority of the challenges we faced were associated with server side programming. Many of them were caused by small errors in the code, however there were some issues that were caused by obscure problems, such as differences in how Javascript is run on based on your browser. Most of these issues have been resolved, and the site has passed multiple tests of its HTTP functionality, however had we more time we would have been able to build a more solid foundation for the client side requests, which was where the majority of bugs occurred as a result of an overreliance on callbacks for processing the data in asynchronous requests.
