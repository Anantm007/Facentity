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
            type: Number,
            minlength: 4,
            maxlength: 4
        },
        password: {
            type: String,
            trim: true,
            minlength: 4,
            validate(value){
                if(value.includes("password")){
                    throw new Error('Password should not contain password')
                }
            }
        },
        // faceId: {
        //     type: String,
        //     unique: true,
        //     trim: true
        // },
        wallet: {
            type: Number,
            default: 0,
            min: 0,
            required: true
        }
    },{
        timestamps: true
    }
)

userSchema.virtual('transactionHistory',{
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.getPublicProfile=function(){
    const user=this
    const userPublic=user.toObject()
    delete userPublic.password
    delete userPublic.pin
    return userPublic
}

// userSchema.methods.generateAuthToken=async function (){
//     const user=this
//     const token=jwt.sign({_id: user._id.toString()},'gottalearn')
//     user.tokens=user.tokens.concat({token})
//     await user.save()
//     return token
// }

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
    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User