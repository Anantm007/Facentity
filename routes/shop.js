const express=require('express')
const router= express.Router()
const bcrypt=require('bcryptjs')

const lineReader=require('line-reader')

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

  const readFile = async(req, res, next) => {
    try{
        lineReader.eachLine('../opencv-face-recognition/face_data.txt', function(line, last) {
          if (last) {
            req.name = line;
            next();
          }
        });
      } catch(e){
        res.status(400).send(e)
      }
  }



// Process payment
router.post('/:id/payment', readFile, async(req, res) => {

    const {amount, pin} = req.body;

    const shop = await Shop.findById(req.params.id);
    if(shop)
    {
        const userName = req.name;

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
            return res.json({
                success: false,
                message: "invalid PIN"
            })
        }


        if(amount > user.wallet)
        {
            return res.json({
                success: false,
                message: "Sorry, you do not have enough money"
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

            return res.json({
                success: true,
                transactionId: transaction.id,
                message: "Transaction successfull"
            })

        } catch (err) {
            return res.json({
                success: false,
                message: err
            })

        }

    }

    return res.json({
        success: false,
        message: "Shop Not Found"
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
