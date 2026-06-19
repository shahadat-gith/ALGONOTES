import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    public_id: { type: String, default: "" }
  },
  { _id: false }
);

const verificationSchema = new mongoose.Schema(
  {
    status: { 
      type: String, 
      enum: ["pending", "verified"], 
      default: "pending" 
    },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null }
  },
  { _id: false }
);

const forgotPasswordSchema = new mongoose.Schema(
  {
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    username: { 
      type: String, 
      default: null,
      unique: true,
      sparse: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    avatar: { 
      type: avatarSchema, 
      default: () => ({}) 
    },
    verificationOptions: { 
      type: verificationSchema, 
      default: () => ({}) 
    },
    forgotPasswordOptions: { 
      type: forgotPasswordSchema, 
      default: () => ({}) 
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');
export default User;