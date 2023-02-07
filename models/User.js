const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        require: true
    },

    lastname: {
        type: String,
        require: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },

    phone: {
        type: String,
        required: false,
        match: /^(?:7|0|(?:\+94))[0-9]{9,10}$/
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        //select set to false so password doesn't come when querying automatically
        select: false
    },
    
    status: {
        type: Boolean,
        default: true
    },
    profilePoints: {
        type: Number,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profilePicture: String,
    coverPicture: String,
    bio: String,
    address: String,
    worksAt: String,
    title: String,
    relationship: String,
    zip:String,
    city: String,
    state:String,
    country: String,
    gender: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    followRequests: [],
    myRequests: [],
    communityRequests: [],
    communityInvites: [],
    myCommunityRequests: [],
    contacts: [],
    skills:[],
    interests:[],
    education: [],
    followers: [],
    following: [],
    webhId:{type:String},
    resetLink:{
        type:String,
        default:''
    }
},
{timestamps: true}
)

//this function run before saving data to database
UserSchema.pre("save", async function (next) {

    //hashing the password
    //checking if the password is already hashed
    if (!this.isModified("password")) {
        next();
    }

    //hashing the with difficulty level 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

//reset password token
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token (private key) and save to database
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

    return resetToken;
};

const User = mongoose.model("user", UserSchema)
module.exports = User