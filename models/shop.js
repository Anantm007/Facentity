const mongoose=require('mongoose')

const shopSchema= new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
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
        }
    },{
        timestamps: true
    }
)

shopSchema.virtual('transactionHistory',{
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'shop'
})

const Shop=mongoose.model('Shop',shopSchema)

module.exports=Shop