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
router.get('/login', async(req,res)=>{
    return res.status(200).render('login-shop');
})

router.get('/:id', async(req,res)=>{
    const shop=await Shop.findById(req.params.id)
    return res.status(200).render('index-shop',{
        shop: shop
    });
    // return res.send(user)
})


// Shop Register (One time only)
router.post("/register", async(req, res)=> {
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
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid Credentials' }] });
      }

     res.redirect(`/shop/${shop._id}`)
    /*
    return res.json({
        success: true,
        message: "User logged in"
    })*/

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }

})

// Display the payment page
router.get("/:id/payment", async(req, res) =>{
    const shop = await Shop.findById(req.params.id);
    if(shop)
    {
        return res.status(200).render('shopping-checkout', {
            shop: shop
        });

        // return res.json({
        //     success: true,
        //     data: shop
        // })
    }

    return res.json({
        success: false,
        message: "Invalid Shop"
    })
})

// List all the shop Transactions
router.get("/:id/transactions", async(req, res) => {
    const shop = await Shop.findById(req.params.id);
    await Transaction.find({shop: req.params.id}, (err, transactions) => {
        if(err)
        {
            return res.json({
                success: false,
                message: err
            })
        }
        return res.status(200).render('selling-history', {
            shop: shop,
            transactions
        });

        // return res.json({
        //     success: true,
        //     data: transactions
        // })
    })
})



module.exports = router;
