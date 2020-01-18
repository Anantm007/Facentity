const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const Transaction=require('./transaction')

const userSchema=new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
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
        pin: {
            type: String,
            minlength: 4,
            maxlength: 4,
            required: true
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
        wallet: {
            type: Number,
            default: 0,
            min: 0
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

userSchema.methods.getPublicProfile=function(){
    const user=this
    const userPublic=user.toObject()
    delete userPublic.password
    delete userPublic.pin
    return userPublic
}

userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error('Unable to log in')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to log in')
    }
    return user
}

userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('pin')){
        user.pin=await bcrypt.hash(user.pin,8)
    }
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password, 8)
    }
    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User