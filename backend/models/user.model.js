import mongoose from "mongoose";
import bcypt from 'bcryptjs';
;const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required!'],
        unique:true,
        lowercase:true,
        trime:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minglength:[6,'Password must be at least 6 characters long']
    },
    cartItems:[
        {
            qunatity:{
                type:Number,
                default:1,
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
            }
        }
    ],
    role:{
        type:String,
        enum:['customer','admin'],
        default:'customer',
    }

},{timestamps:true});

const User = mongoose.model('User',userSchema);


//presave hook to hash password;
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    try {
        const salt = await bcypt.genSalt(10);
        this.password = await bcypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error);
    }
}
)

userSchema.methods.comparePassword = async function(password){
    return bcypt.compare(password, this.password);
}
export default User;