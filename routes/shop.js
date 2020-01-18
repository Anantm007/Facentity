const express=require('express')
const router= express.Router()
const bcrypt=require('bcryptjs')

require('dotenv').config()


// Models
const Shop = require('../models/shop');
const Transaction = require("../models/transaction");
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


// Shop Login Page (landing page)
router.get('/shop', async(req,res)=>{
    return res.status(200).render('../views/shop/login.ejs');
})


// Shop Register (One time only)
router.post("/register", async(req, res)=> {
    // console.log("hello")
    try {
        const shop = new Shop(req.body);

        await shop.save();

        return res.json({
            success: true,
            data: shop
        })
        
    } catch (err) {
        return res.json({
            success: false,
            message: err
        })
    }
})


// Shop Login Authentication
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
      let shop = await Shop.findOne({ email });

      if (!shop) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password,shop.password);
      console.log(password, shop.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid Credentials' }] });
      }

    /*
      return res.status(200).render('../views/shop/dashboard.ejs', {
        user
      });
    */
    return res.json({
        success: true,
        message: "User logged in"
    })

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }

})

// Display the payment page
router.get("/:id/payment", async(req, res) =>{
    const shop = await Shop.findById(req.params.id);

    if(shop)
    {/*
        return res.status(200).render('../views/shop/payment.ejs', {
            shop: shop
        });*/

        return res.json({
            success: shop,
            data: shop
        })
    }

    return res.json({
        success: false,
        message: "Invalid Shop"
    })
})


// List all the shop Transactions
router.get("/:id/transactions", async(req, res) => {
    await Transaction.find({shop: req.params.id}, (err, transactions) => {
        if(err)
        {
            return res.json({
                success: false,
                message: err
            })
        }/*
        return res.status(200).render('../views/shop/transactions.ejs', {
            transactions
        });*/

        return res.json({
            success: true,
            data: transactions
        })
    })
})



module.exports = router;