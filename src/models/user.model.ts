import mongoose, { Schema, Document } from "mongoose"

interface IUser extends Document {
  name: string
  email: string
  mobile?: string
  dob?: Date
  profilePicture?: string
  authId: mongoose.Types.ObjectId
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    mobile: {
      type: String,
      required: false
    },
    dob: {
      type: Date,
      required: false
    },
    profilePicture: {
      type: String,
      required: false
    },
    authId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Auth"
    }
  },
  {
    timestamps: true,
  }
)

export const User = mongoose.model<IUser>("User", userSchema)