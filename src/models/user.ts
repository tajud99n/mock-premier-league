import { Document, Model, model, Schema } from "mongoose";
import { config } from "../config/config";

export interface UserDoc extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    isDeleted: boolean;
}

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 5,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            minlength: 5,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            minlength: 6,
            trim: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const UserModel: Model<UserDoc> = model<UserDoc>(
	config.mongodb.collections.user,
	userSchema
);