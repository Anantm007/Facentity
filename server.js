const express=require('express')
const app=express()
const userRouter=require('./routes/user')
const shopRouter=require('./routes/shop')


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
app.use(express.static("views"))

// Getting data in json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

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

app.get('/batexecute', function(req, res){
  const { spawn } = require('child_process');
const bat = spawn('cmd.exe', ['/k', 'run.bat']);

bat.stdout.on('data', (data) => {
  console.log(data.toString());
});

bat.stderr.on('data', (data) => {
  console.error(data.toString());
});

bat.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
});

res.render('webcamstarted');
});

app.get('/runbat', function(req, res){
  res.render('runbat');
});


app.use('/user',userRouter)
app.use('/shop',shopRouter)
app.use('/transaction', require("./routes/transaction"));

app.get('/', async(req, res) => {
  return res.render('landing');
})
// Starting the server
app.listen(process.env.PORT || 3001, ()=>{
  console.log(`Server started on port ${process.env.PORT || 3001}`);
});
