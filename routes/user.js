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

router.post('/user',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email, req.body.password)
        // const token=await user.generateAuthToken()
        if(!user){
            throw new Error()
        }
        res.send({
            user: user.getPublicProfile()
        })
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/user/:id', async(req,res)=>{
    return res.status(200).render('../views/user/dashboard.js');
})

router.get('/user/:id/history', async(req,res)=>{
    return res.status(200).render('../views/user/history.js');
})

router.get('/user/:id/addMoney', async(req,res)=>{
    return res.status(200).render('../views/user/addMoney.js');
})

router.post('/user/:id/addMoney', async(req,res)=>{
    console.log(req.body)
    var chargeAmount = req.body.amount;
    
})

module.exports = router;