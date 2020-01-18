const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const Transaction=require('./transaction')

const shopSchema= new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email is invalid')
                }
            }
        },
        password: {
            type: String,
            trim: true,
            minlength: 4,
            required: true,
            validate(value){
                if(value.includes("password")){
                    throw new Error('Password should not contain password')
                }
            }
        },
        transactions: [{
            transaction: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Transaction'
            }
        }]
    },{
        timestamps: true
    }
)

shopSchema.pre('save',async function(next){
    const shop=this
    if(shop.isModified('password')){
        shop.password=await bcrypt.hash(shop.password,8)
    }
    next()
})

const Shop=mongoose.model('Shop',shopSchema)

module.exports=Shop