export interface IUser {
	name: string;
	email: string;
	password: string;
}

export interface IRequestUser extends Request {
	user?: {
		_id: string;
	};
}