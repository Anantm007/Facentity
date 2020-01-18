const express=require('express')
const router= new express.Router()

require('dotenv').config()

// Models
const Shop = require('../models/shop');
const Transaction = require("../models/transaction");
const User = require("../models/user");

// Nodemailer setup
// const nodemailer = require("nodemailer");
// let transporter = nodemailer.createTransport({
//     service : 'gmail',
//     secure : false,
//     port : 25,
//     auth : {
//         user : process.env.EmailId,
//         pass : process.env.EmailPass
//     },
//     tls : {
//         rejectUnauthorized : false
//     }
// });

router.get('/users',async(req,res)=>{
    try{
        User.find().then((user)=>{
            if(!user){
                return res.status(404).send()
            }
            res.send(user)
        })
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/signin', async(req,res)=>{
    // return res.status(200).render('../views/user/login.ejs');
    return res.send('Hello')
})

router.get('/:id', async(req,res)=>{
    const user=await User.findById(req.params.id)
    // return res.status(200).render('../views/user/dashboard.js',{
    //     user: user
    // });
    return res.send(user)
})

router.get('/:id/history', async(req,res)=>{
    const user=await User.findById(req.params.id)
    // return res.status(200).render('../views/user/history.js',{
    //     user: user
    // });
    return res.send(user)
})

router.get('/:id/addMoney', async(req,res)=>{
    const user=await User.findById(req.params.id)
    // return res.status(200).render('../views/user/addMoney.js',{
    //     user: user
    // });
    return res.send(user)
})

router.post('/signup',async(req,res)=>{
    console.log(req.body)
    const user=new User(req.body)
    try{
        await user.save()
        res.status(201).send({
            user: user.getPublicProfile()
        })
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/signin',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email, req.body.password)
        // const token=await user.generateAuthToken()
        if(!user){
            throw new Error()
        }
        res.send(user)
        // res.redirect(`/${user._id}`)
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/:id/addMoney', async(req,res)=>{
    console.log(req.body)
    try{
        const user=await User.findById(req.params.id)
        var chargeAmount = req.body.amount;
        user['wallet']+=chargeAmount
        await user.save()
        res.send(user)
        // res.redirect(`/${user._id}`)
    } catch(e){
        res.status(400).send(e)
    }
})

module.exports = router;