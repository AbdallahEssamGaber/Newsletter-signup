const express = require("express");
const app = express();
// const request = require('request');
const bodyParser = require("body-parser");
require("dotenv").config()
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const secName = req.body.sName;
  const email = req.body.email;

  //For the mailchimp API
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: secName
        }
      }
    ]
  };


  const jsonData = JSON.stringify(data);

  const url = process.env.SECRET_KEY;
  const options = {
    method: "POST",
    auth: process.env.AUTH
  }

  var request = https.request(url, options, function(response){
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 300,function(){
  console.log("Running on 300");
})




// aeca5df1e8fee016d9bdcdf201a30824-us20
// cc0585e3bb
