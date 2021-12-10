const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require('cors');

const app = express();

var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      // callback(new Error('Not allowed by CORS'))
      callback(null, true);
    }
  },
  credentials: true
}
app.use(cors(corsOptions));

const PORT = 5000;

// include body parser for body parameters
app.use(bodyParser.json());

// load mysql package


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
    connection.query("SELECT * from getallmovieinfo LIMIT 50", function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/movie/:name", function (request, response) {

    // query
    var movie_name = request.params.name;
    connection.query("SELECT * from movie WHERE Name = ?", [movie_name], function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/highestratedmovie", function (request, response) {

    // query
    connection.query("SELECT * FROM movies.highratedinfodesc;", function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/highestgrossingmovies", function (request, response) {

    // query
    connection.query("SELECT * FROM movies.highestgrossingmovies;", function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/favorites/user/:userId/movie/:movieId", function (request, response) {

    // query
    var userId = request.params.userId;
    var movieId = request.params.movieId;
    connection.query("SELECT * from favorites WHERE UserId=? AND MovieID=?", [userId,movieId], function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/moviereviews/:userId", function (request, response) {

    // query
    var userId = request.params.userId;
    connection.query("select avg(Rating) AS AVG_RATING,Name AS MovieName , count(*) AS TotalReviews,movie.MovieID AS MovieID,ImageUrl AS ImageUrl,LongMinutes AS LongMinutes,Description AS Description,Genre AS Genre,ReleaseDate AS ReleaseDate,BoxOfficeCollection AS BoxOfficeCollection,Writer AS Writer,Director AS Director,Actors AS Actors,Language AS Language from (movie left join review on((movie.MovieID = review.MovieID))) where review.UserId = ? group by movie.MovieID", [userId], function(error, results, fields){
          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.get("/moviefavorites/:userId", function (request, response) {

    // query
    var userId = request.params.userId;
    connection.query("select avg(Rating) AS AVG_RATING,"+
    "Name AS MovieName , count(*) AS TotalReviews,"+
    "movie.MovieID AS MovieID,ImageUrl AS ImageUrl,"+
    "LongMinutes AS LongMinutes,Description AS Description,"+
    "Genre AS Genre,ReleaseDate AS ReleaseDate," +
    "BoxOfficeCollection AS BoxOfficeCollection,"+
    "Writer AS Writer,Director AS Director,"+
    "Actors AS Actors,"+
    "Language AS Language "+
    "from movie left join review "+
    "on movie.MovieID = review.MovieID "+
    "left join favorites "+
    "on movie.MovieID = favorites.MovieID "+
   " where favorites.UserId = ?"+
    "group by movie.MovieID;", [userId], function(error, results, fields){
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

app.delete("/movie/:id", function(request, response){

    var movie_id = request.params.id;

    connection.query("CALL DeleteMovie(?)", [movie_id], function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "Movie has been deleted successfully",
                data: result
            });
        }
    });
});

app.delete("/user/:id", function(request, response){

    var user_id = request.params.id;

    connection.query("CALL DeleteUser(?)", [user_id], function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "User has been deleted successfully",
                data: result
            });
        }
    });
});

app.delete("/favorites/:id", function(request, response){

    connection.query("DELETE FROM favorites WHERE FavoriteId = ?", [request.params.id], function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "Favorite has been deleted successfully",
                data: result
            });
        }
    });
});

app.delete("/favorite", function(request, response){

    var user_id = request.body.user_id;
    var movie_id = request.body.movie_id;

    connection.query("CALL DeleteFavorite(?,?)", [movie_id,user_id], function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "Favorite has been deleted successfully",
                data: result
            });
        }
    });
});

app.post("/movie", function(request, response){

    var Name = request.body.Name;
    var Description = request.body.Description;
    var releaseDate = request.body.releaseDate;
    var LongMinutes = request.body.LongMinutes;
    var ImageUrl = request.body.ImageUrl;
    var Genre = request.body.Genre;
    var BoxOffice = request.body.BoxOffice;
    var Writer = request.body.Writer;
    var Director = request.body.Director;
    var Actors = request.body.Actors;
    var LanguageMovie = request.body.LanguageMovie;
    var Country = request.body.Country;
    

    connection.query("CALL InsertMovie(?,?,?,?,?,?,?,?,?,?,?,?)", [Name,Description,releaseDate,LongMinutes,ImageUrl,Genre,BoxOffice,Writer,
        Director,Actors,LanguageMovie,Country],
     function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "Movie has been added successfully",
                data: result
            });
        }
    });
});

app.put("/movie", function(request, response){

    var p_Name = request.body.Name;
    var p_Description = request.body.Description;
    var p_releaseDate = request.body.releaseDate;
    var p_LongMinutes = request.body.LongMinutes;
    var p_ImageUrl = request.body.ImageUrl;
    var p_Genre = request.body.Genre;
    var p_BoxOffice = request.body.BoxOffice;
    var p_Writer = request.body.Writer;
    var p_Director = request.body.Director;
    var p_Actors = request.body.Actors;
    var p_LanguageMovie = request.body.LanguageMovie;
    var p_Country = request.body.Country;
    var id = request.body.id;
    

    connection.query("CALL UpdateMovieDetails(?,?,?,?,?,?,?,?,?,?,?,?,?)", [p_Name,p_Description,p_releaseDate,p_LongMinutes,p_ImageUrl,p_Genre,p_BoxOffice,p_Writer,
        p_Director,p_Actors,p_LanguageMovie,p_Country,id],
     function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "Movie has been upadted successfully",
                data: result
            });
        }
    });
});


app.post("/user", function(request, response){

    var FirstName = request.body.FirstName;
    var LastName = request.body.LastName;
    var Username = request.body.Username;
    var Password = request.body.Password;
    var Location = request.body.Location;
    
    

    connection.query("CALL InsertUserDetails(?,?,?,?,?)", [FirstName,LastName,Username,Password,Location],
     function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "User has been added successfully",
                data: result
            });
        }
    });
});

app.put("/user", function(request, response){

    var p_FirstName = request.body.FirstName;
    var p_LastName = request.body.LastName;
    var p_Username = request.body.Username;
    var PasswordIN = request.body.Password;
    var p_Location = request.body.Location;
    var id = request.body.id;
    

    connection.query("CALL UpdateUserDetails(?,?,?,?,?,?)", [p_FirstName,p_LastName,p_Username,PasswordIN,p_Location,id],
     function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "User has been updated successfully",
                data: result
            });
        }
    });
});

app.post("/review", function(request, response){

    var Review = request.body.Review;
    var Rating = request.body.Rating;
    var DateCreated = request.body.DateCreated;
    var MovieID = request.body.MovieID;
    var UserId = request.body.UserId;
    
    

    connection.query("CALL InsertReview(?,?,?,?,?)", [Review,Rating,DateCreated,MovieID,UserId],
     function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "Review has been added successfully",
                data: result
            });
        }
    });
});

app.put("/review", function(request, response){

    var Review = request.body.Review;
    var Rating = request.body.Rating;
    var id = request.body.id;
    
    

    connection.query("CALL UpdateReview(?,?,?)", [Review,Rating,id],
     function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "Review has been updated successfully",
                data: result
            });
        }
    });
});

app.post("/favorite", function(request, response){

    var MovieID = request.body.MovieID;
    var UserId = request.body.UserId;

    connection.query("CALL InsertFavorites(?,?)", [MovieID, UserId],
     function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "Favorite has been added successfully",
                data: result
            });
        }
    });
});


app.get("/users/all", function(request, response){


    connection.query("SELECT * FROM USER",
     function(error, result, fields){

        if(error){

            throw error;
        }else{

            response.json({
                status : 1,
                message: "ALL USERS",
                data: result
            });
        }
    });
});

app.get("/search/:name", function (request, response) {

    // query
    var keyword = request.params.name;
    console.log(keyword);
    connection.query(
        "SELECT * FROM movies.getallmovieinfo WHERE MovieName LIKE " + "'%" + keyword + "%';", [keyword],
     function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.post("/login", function (request, response) {

    // query
    var username = request.body.username;
    var password = request.body.password;
    
    connection.query(
        "SELECT user.UserId FROM user WHERE user.Username = ? AND user.Password = ?;", [username, password],
     function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});

app.listen(PORT, function () {

    console.log("Server is running at 5000 port");
});

app.get("/search/:name", function (request, response) {

    // query
    var keyword = request.params.name;
    console.log(keyword);
    connection.query(
        "SELECT * FROM movies.getallmovieinfo WHERE MovieName LIKE " + "'%" + keyword + "%';", [keyword],
     function(error, results, fields){

          if(error){
              throw error;
          }else{
              response.json(results);
              //console.log(fields);
          } 
    });
});
