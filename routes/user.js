const express=reqire('express')
const router= express.Router()

require('dotenv').config()

const MongoObjectId = require("mongoose").Types.ObjectId;

const stripe = require('stripe')(process.env.skKey);

// Models
const Shop = require('../models/shop');
const Transacrion = require("../models/transaction");
const User = require("../models/user");

// Nodemailer setup
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service : 'gmail',
    secure : false,
    port : 25,
    auth : {
        user : process.env.EmailId,
        pass : process.env.EmailPass
    },
    tls : {
        rejectUnauthorized : false
    }
});

router.get('/user', async(req,res)=>{
    return res.status(200).render('../views/user/login.ejs');
})

module.exports = router;