import { Document, Model, model, Schema } from "mongoose";
import { config } from "../config/config";

export interface FixtureDoc extends Document {
	fixtureId: string;
	home: string;
	away: string;
	link: string;
	status: string;
	venue: string;
	kickOff: Date;
	report: any;
	createdBy: string;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const fixtureSchema = new Schema(
	{
		home: {
			type: String,
			required: true,
		},
		away: {
			type: String,
			required: true,
		},
		kickOff: {
			type: Date,
			required: true,
		},
		fixtureId: {
			type: String,
			required: true,
			unique: true,
		},
		venue: {
			type: String,
			required: true,
		},
		report: {
			scores: {
				home: {
					type: Number,
				},
				away: {
					type: Number,
				},
			},
		},
		link: {
			type: String,
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "admins",
		},
		status: {
			type: String,
			enum: ["pending", "on-going", "completed", "abandoned"],
			default: "pending",
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

export const FixtureModel: Model<FixtureDoc> = model<FixtureDoc>(
	config.mongodb.collections.fixture,
	fixtureSchema
);
