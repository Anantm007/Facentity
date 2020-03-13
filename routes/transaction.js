const express=require('express')
const router= express.Router()
var fs = require('fs');
const bcrypt=require('bcryptjs')

var path = require("path");

require('dotenv').config()

//const lineReader=require('line-reader')

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

// Models
const Shop = require('../models/shop');
const Transaction = require("../models/transaction");
const User = require("../models/user");

router.get("/:id", async(req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if(!transaction)
    {
        return res.json({
            success: false,
            message: "Transaction not found"
        })
    }

    return res.json({
        success: true,
        data: transaction
    })
})


// Process payment
router.post('/:id/pay', async(req, res) => {

    var arr = fs.readFileSync(path.join(__dirname 
            , '../../face_recognition/opencv-face-recognition/face_data.txt'))
            .toString().split('\n');
    console.log(arr)
    const {amount, pin} = req.body;
    const shop = await Shop.findById(req.params.id);
    if(shop)
    {
        const userName = arr[arr.length-2];
        console.log(userName)
        const user = await User.findOne({name: userName});
        if(!user)
        {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(pin,user.pin);

        if(!isMatch)
        {
            return res.render('failure',{
                message: "Transaction Failure Due to Invalid PIN",
                user: user
            })
        }


        if(amount > user.wallet)
        {
            return res.render('failure',{
                message: "Transaction Failure Due to Insufficient Funds",
                user: user
            })
        }

        user.wallet -= parseInt(amount);
        shop.wallet+=parseInt(amount);
        try {

            const transaction = new Transaction({
                user,
                shop,
                amount
            })

            await transaction.save();

            shop.transactions.unshift(transaction);
            user.transactions.unshift(transaction);

            await user.save();
            await shop.save();

            // Send email
            let HelperOptions ={

                from : process.env.EmailName + '<'+ (process.env.EmailId)+'>' ,
                to : user.email,
                subject : `Your payment at ${shop.name} was successful`,
                text : `Hello ${user.name}, \n\nYour payment of Rs. ${amount} on ${user.name} has been successfully processed! \n\nRegards,\nTeam FCB`
            };

                transporter.sendMail(HelperOptions,(err,info)=>{
                    if(err) throw err;

                    console.log("The message was sent");

            });

            return res.render('success',{
                message: "Transaction Successfull",
                user: user
            })

        } catch (err) {
            return res.render('failure',{
                message: "Transaction Failure",
                user: user
            })
            // return res.json({
            //     success: false,
            //     message: err
            // })
        }

    }

    return res.json({
        success: false,
        message: "Shop Not Found"
    })
})



module.exports = router;