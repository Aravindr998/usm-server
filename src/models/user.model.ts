import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
}

export const userFormItems = [
	{
		key: "name",
		type: "text",
		mongooseType: String,
		required: true
	},
	{
		key: "email",
		type: "email",
		mongooseType: String,
		required: true,
		unique: true,
		uniqueMessage: "Email address already exists, please login to continue",
		index: true
	},
	{
		key: "password",
		type: "password",
		mongooseType: String,
		required: true
	},
	{
		key: "isVerified",
		type: "static",
		mongooseType: Boolean,
		defaultValue: false,
		required: true
	},
]

  const schemaDefinition = userFormItems.reduce((acc: Record<string, any>, {key, mongooseType, required, unique = false, index = false, uniqueMessage, defaultValue}) => {
		acc[key] = {
			type: mongooseType,
			required,
			unique: [unique, uniqueMessage || "Field already exists"],
			index,
			default: defaultValue
		}
		return acc
	}, {})

const userSchema = new Schema<IUser>(
  schemaDefinition,
  {
    timestamps: true,
  }
)

export const User = mongoose.model<IUser>("User", userSchema)