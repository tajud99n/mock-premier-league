import { Document, Model, model, Schema } from "mongoose";
import { config } from "../config/config";

export interface TeamDoc extends Document {
	teamId: string;
	name: string;
	manager: string;
	emblem: string;
	color: string;
	stadium: string;
	meta: any;
}

const teamSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 1,
		},
		teamId: {
			type: String,
			required: true,
			unique: true,
		},
		manager: {
			type: String,
			required: true,
		},
		emblem: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		stadium: {
			type: String,
			required: true,
		},
		meta: {
			alias: {
				type: String,
			},
			fixtures: [
				{
					type: Schema.Types.ObjectId,
					ref: "fixtures",
				},
			],
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "admins",
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

export const TeamModel: Model<TeamDoc> = model<TeamDoc>(
	config.mongodb.collections.team,
	teamSchema
);
