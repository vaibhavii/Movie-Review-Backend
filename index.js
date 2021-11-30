const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = 5000;

// include body parser for body parameters
app.use(bodyParser.json());

// load mysql package
const mysql = require("mysql");

// create mysql connection
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "movies"
});

// check connection
connection.connect(function (error) {

    if (error) {
        console.log(error);
        throw error;
    } else {
        console.log("We are now successfully connected with mysql database");
    }
});

app.get("/users", function (request, response) {

    // query
    connection.query("SELECT * from user", function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/movie", function (request, response) {

    // query
    connection.query("SELECT * from getallmovieinfo", function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/movie/highestrated", function (request, response) {

    // query
    connection.query("SELECT * from highestratedmovieinfo", function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/review/movie/:movieid", function (request, response) {

    // query
    var movie_id = request.params.movieid;
    connection.query(
        "SELECT user.Username, review.Rating, review.Review, review.DateCreated, user.UserId, review.ReviewId from review join user on review.UserId = user.UserId WHERE review.MovieID = ?",
        [movie_id],
     function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/review/user/:userid", function (request, response) {

    // query
    var user_id = request.params.userid;
    connection.query(
        "SELECT user.Username, movie.MovieID, movie.Name, review.Rating, review.Review, review.DateCreated, user.UserId, review.ReviewId from review join movie on review.MovieID = movie.MovieID join user on review.UserId = user.UserId WHERE review.UserId = ?",
        [user_id],
     function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/review/movie/:movieid/user/:userid", function (request, response) {

    // query
    var movie_id = request.params.movieid;
    var user_id = request.params.userid;
    connection.query(
        "SELECT user.Username, review.Rating, review.Review, review.DateCreated, user.UserId, review.ReviewId from review join user on review.UserId = user.UserId WHERE review.MovieID = ? AND review.UserId = ?",
        [movie_id, user_id],
     function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.delete("/review/:id", function(request, response){

    var review_id = request.params.id;
    console.log(review_id);

    connection.query("CALL DeleteReview(?)", [review_id], function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "Review has been deleted successfully",
                data: result
            });
        }
    });
});

app.listen(PORT, function () {

    console.log("Server is running at 5000 port");
});
