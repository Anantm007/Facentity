const mongoose=require('mongoose')
const User=require('./user')
const Shop=require('./shop')

const transactionSchema= new mongoose.Schema(
    {
        amount: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Shop'
        }
    },{
        timestamps: true
    }
)

const Transaction=mongoose.model('Transaction',transactionSchema)

module.exports=Transaction