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
    return res.render('login');
    // return res.send('Hello')
})

router.get('/:id', async(req,res)=>{
    const user=await User.findById(req.params.id)
    return res.status(200).render('index',{
        user: user
    });
    // return res.send(user)
})

router.get('/:id/trans-history', async(req,res)=>{
    const user=await User.findById(req.params.id)
    const transactions = await Transaction.find({user: req.params.id})
    return res.status(200).render('trans-history',{
        user,
        transactions
    });
    // return res.send(user)
})

router.get('/:id/addMoney', async(req,res)=>{
    const user=await User.findById(req.params.id)
    return res.status(200).render('add-money',{
        user: user
    });
    // return res.send(user)
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
        res.redirect(`/user/${user._id}`)
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/:id/addMoney', async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        var chargeAmount = parseInt(req.body.amount);
        user.wallet+=chargeAmount
        await user.save()

        return res.render('success',{
            message: "Add Money to Wallet Successfull",
            user: user
        })
    } catch(e){
        return res.render('failure',{
            message: "Add Money to Wallet Failed",
            user: user
        })
    }
})

module.exports = router;
