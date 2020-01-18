const express=require('express')
const app=express()
const userRouter=require('./routes/user')

// const cors=require('cors')
const bodyParser = require("body-parser");

// Mongoose 
const mongoose = require('mongoose');

// Config variables
require('dotenv').config();

//Connecting to the database
mongoose.promise = global.Promise;
mongoose.connect(process.env.MongoURI,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}, (err,db)=> {
    if(err)
    console.log(err);

    else
    console.log('Database Connected...');
});

app.set('view engine', 'ejs');

// Getting data in json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json())

// app.use(cors())

// Mounting the routes
// app.use('/', require('./routes/index'));



// Test route
app.get("/api", (req, res) => {
  res.json({
      succcess: true,
      message: "API running"
  });
})

app.use(userRouter)


// Starting the server
app.listen(process.env.PORT || 3000, ()=>{
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});