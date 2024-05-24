const express=require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use("/resources",express.static('resources'));
app.use("/vender",express.static('vender'));
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});
app.get("/signin.html",function(req,res){                //agar connect ki request aayi server p to kya response h
  res.sendFile(__dirname+"/signin.html");
});
app.get("/index.html",function(req,res){                //agar connect ki request aayi server p to kya response h
  res.sendFile(__dirname+"/index.html");
});
// app.get("/index.ejs",function(req,res){                //agar connect ki request aayi server p to kya response h
//   res.sendFile(__dirname+"/index.ejs");
// });
app.post("/",function(req,res)
{
  var name=(req.body.name);
  var password=(req.body.password);
  var mobile=(req.body.mobile);
  var address=(req.body.address);
  var email=(req.body.email);
  var plan=(req.body.plan);
  const mongoose = require('mongoose');
  mongoose.connect("mongodb://localhost:27017/OmniFood",{useNewUrlParser:true});
  const userSchema=mongoose.Schema({
    name:String,
    password:String,
    mobile:Number,
    address:String,
    email:String,
    plan:String
  });
  const User=mongoose.model("newusers",userSchema);
  const user=new User({
    name:name,
    password:password,
    mobile:mobile,
    address:address,
    email:email,
    plan:plan
  });
  user.save();
  res.sendFile(__dirname+"/thanks.html");
});
app.post("/signin",function(req,res){
  var email1=(req.body.email);
  var password1=(req.body.password);
  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');         //used for testing purpose

  // Connection URL
  const url = 'mongodb://localhost:27017';

  // Database Name
  const dbName = 'OmniFood';

  // Create a new MongoClient
  const client = new MongoClient(url,{ useNewUrlParser: true });

  // Use connect method to connect to the Server
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    findDocuments(db, function() {
        client.close();
      });
  });
  const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('newusers');
  // Find some documents
  collection.find({$and:[{email:email1},{password:password1}]}).toArray(function(err, arr) {
    assert.equal(err, null);
    if (arr.length == 0)
    {
      res.send("Please enter valid Credentials");
    }
    else {
        res.render("index.ejs",{arr:arr});
    }

    // res.sendFile(__dirname+"/index2.html");
    // res.send(users);
    // res.sendFile(__dirname+"/index.html");
    // console.log("Found the following records");
    // console.log(users);
    callback(arr);
  });
};
});
app.listen("3000",function()
{
  console.log("you have connected to port 3000");
});
