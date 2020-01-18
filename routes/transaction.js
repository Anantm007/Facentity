const express=require('express')
const router= express.Router()

require('dotenv').config()


// Models
const Transaction = require("../models/transaction");

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


module.exports = router;