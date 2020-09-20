import { Document, Model, model, Schema } from "mongoose";
import { config } from "../config/config";

export interface AdminDoc extends Document {
	_id: string;
	name: string;
	email: string;
	role: string;
	password: string;
	isDeleted: boolean;
}

const adminSchema = new Schema(
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
		role: {
			type: String,
			require: true,
			enum: ["root", "super"],
			default: "root",
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


export const AdminModel: Model<AdminDoc> = model<AdminDoc>(
	config.mongodb.collections.admin,
	adminSchema
);
