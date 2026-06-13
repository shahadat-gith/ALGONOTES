import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"], // Basic email validation
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allows multiple users to have 'null/undefined' username initially
    },

    verificationOptions: {
      otp: { type: String },
      otpExpiry: { type: Date },
      status: {
        type: String,
        enum: ["pending", "verified"], // Restricts values to these options
        default: "pending",
      },
    },

    avatar: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    forgotPasswordOptions: {
      otp: { type: String },
      otpExpiry: { type: Date },
      otpVerified: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;